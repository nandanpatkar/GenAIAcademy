(() => {
  "use strict";

  const config = window.LAB_CONFIG;
  const canvas = document.querySelector("#lab-canvas");
  const ctx = canvas.getContext("2d");
  const controlsRoot = document.querySelector("#controls");
  const metricRoot = document.querySelector("#metrics");
  const insight = document.querySelector("#insight-copy");
  const runButton = document.querySelector("#run-lab");
  const resetButton = document.querySelector("#reset-lab");
  const phaseLabel = document.querySelector("#phase-label");
  const canvasWrap = document.querySelector(".canvas-wrap");
  const signal = window.__LAB_SIGNAL || [];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  let width = 900;
  let height = 560;
  let scale = 1;
  let frame = 0;
  let running = !prefersReducedMotion;
  let activePointer = false;
  let pointer = { x: .5, y: .5 };
  let values = Object.fromEntries(config.controls.map(control => [control.key, control.value]));
  let state = makeState();

  const backLink = document.querySelector(".back");
  backLink?.addEventListener("click", (event) => {
    event.preventDefault();
    window.parent.postMessage({ type: "genai-labs-back" }, "*");
  });

  function makeState() {
    const pts = Array.from({ length: 88 }, (_, index) => ({
      x: .08 + seeded(index * 3 + 1) * .84,
      y: .08 + seeded(index * 3 + 2) * .84,
      group: index % 3,
      score: seeded(index * 3 + 7),
    }));
    return { points: pts, iteration: 0, choice: null, trail: [], phase: 0 };
  }

  function seeded(index) {
    if (signal.length) return signal[Math.abs(index) % signal.length];
    const x = Math.sin((index + config.id) * 999.31) * 43758.5453;
    return x - Math.floor(x);
  }

  function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }
  function lerp(a, b, amount) { return a + (b - a) * amount; }
  function map(value, inMin, inMax, outMin, outMax) { return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin); }
  function rgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    const value = parseInt(normalized.length === 3 ? normalized.split("").map(x => x + x).join("") : normalized, 16);
    return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${alpha})`;
  }
  function value(key, fallback = 0) { return Number(values[key] ?? fallback); }
  function clear(color = config.canvas) { ctx.fillStyle = color; ctx.fillRect(0, 0, width, height); }
  function line(x1, y1, x2, y2, color = config.ink, thickness = 1) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = thickness; ctx.stroke();
  }
  function circle(x, y, radius, fill, stroke = null, thickness = 1) {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = thickness; ctx.stroke(); }
  }
  function rect(x, y, w, h, fill, stroke = null, radius = 0) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }
  function text(copy, x, y, size = 12, color = config.ink, align = "left", family = "ui-monospace, monospace", weight = 600) {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${family}`; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(copy, x, y);
  }
  function grid(step = 42, alpha = .1) {
    ctx.strokeStyle = rgba(config.ink, alpha); ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0; x <= width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = 0; y <= height; y += step) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();
  }
  function axes(left = 60, bottom = height - 48, right = width - 40, top = 38) {
    line(left, top, left, bottom, rgba(config.ink, .6)); line(left, bottom, right, bottom, rgba(config.ink, .6));
  }
  function polyline(points, color, thickness = 2, closed = false) {
    if (!points.length) return; ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(point => ctx.lineTo(point[0], point[1])); if (closed) ctx.closePath();
    ctx.strokeStyle = color; ctx.lineWidth = thickness; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
  }
  function labelPill(copy, x, y, fill = config.ink, color = config.canvas) {
    ctx.font = "700 10px ui-monospace, monospace"; const w = ctx.measureText(copy).width + 18;
    rect(x, y - 13, w, 26, fill, null, 13); text(copy, x + 9, y, 10, color);
  }
  function gaussian(x, mean, sd) { return Math.exp(-.5 * ((x - mean) / sd) ** 2); }
  function mean(items) { return items.reduce((sum, item) => sum + item, 0) / Math.max(1, items.length); }
  function correlation(points) {
    const mx = mean(points.map(p => p.x)); const my = mean(points.map(p => p.y));
    const top = points.reduce((sum, p) => sum + (p.x - mx) * (p.y - my), 0);
    const dx = Math.sqrt(points.reduce((sum, p) => sum + (p.x - mx) ** 2, 0));
    const dy = Math.sqrt(points.reduce((sum, p) => sum + (p.y - my) ** 2, 0));
    return top / Math.max(.0001, dx * dy);
  }

  function buildControls() {
    controlsRoot.innerHTML = "";
    config.controls.forEach(control => {
      const row = document.createElement("label"); row.className = "control-row";
      const top = document.createElement("span"); top.className = "control-top";
      const name = document.createElement("b"); name.textContent = control.label;
      const output = document.createElement("output"); output.id = `out-${control.key}`;
      top.append(name, output);
      const input = document.createElement("input"); input.type = "range"; input.min = control.min; input.max = control.max; input.step = control.step; input.value = control.value; input.dataset.key = control.key; input.setAttribute("aria-label", control.label);
      input.addEventListener("input", event => { values[control.key] = Number(event.target.value); updateControl(control); state.iteration++; render(true); });
      row.append(top, input); controlsRoot.append(row); updateControl(control);
    });
  }
  function updateControl(control) {
    const output = document.querySelector(`#out-${control.key}`); if (!output) return;
    const number = value(control.key); output.textContent = control.format === "percent" ? `${Math.round(number * 100)}%` : control.format === "int" ? Math.round(number) : number.toFixed(control.decimals ?? 2);
  }
  function setMetrics(items) {
    metricRoot.innerHTML = items.map((item, index) => `<article style="--metric-index:${index}"><span>${item.label}</span><strong>${item.value}</strong><small>${item.note || "live"}</small></article>`).join("");
  }
  function setInsight(copy) { insight.textContent = copy; }

  function drawCLT() {
    clear(); grid(); const n = value("sample"); const shape = value("shape"); const bins = 24; const counts = Array(bins).fill(0);
    for (let i = 0; i < 700; i++) { let total = 0; for (let j = 0; j < Math.min(35, n); j++) { const r = seeded(i * 37 + j + frame); total += shape < .7 ? r : shape < 1.4 ? r * r : (r < .5 ? r * .7 : .65 + r * .35); } const sampleMean = total / Math.min(35, n); counts[Math.min(bins - 1, Math.floor(sampleMean * bins))]++; }
    const max = Math.max(...counts); axes(); counts.forEach((count, i) => { const barW = (width - 110) / bins; const barH = count / max * (height - 150); rect(61 + i * barW, height - 49 - barH, barW - 3, barH, i % 2 ? config.accent : config.accent2); });
    const curve = Array.from({length: 160}, (_,i) => { const x=i/159; return [60+x*(width-110),height-50-gaussian(x,.5,.13/Math.sqrt(n/5))*(height-140)]; }); polyline(curve, config.ink, 3);
    labelPill("sampling means", 72, 53); setMetrics([{label:"sample n",value:Math.round(n)},{label:"mean",value:"0.50"},{label:"spread",value:(.29/Math.sqrt(n)).toFixed(3)}]); setInsight(`With samples of ${Math.round(n)}, individual draws still vary—but their averages crowd much more tightly around the population mean.`);
  }
  function drawBayes() {
    clear(); const prior=value("prior"), sensitivity=value("sensitivity"), falsePositive=value("falsePositive"); const posterior=prior*sensitivity/(prior*sensitivity+(1-prior)*falsePositive);
    const cols=20, rows=10, cell=Math.min((width-90)/cols,(height-180)/rows); const startX=(width-cols*cell)/2, startY=78; const positiveCount=Math.round(200*(prior*sensitivity+(1-prior)*falsePositive)); const truePositive=Math.round(200*prior*sensitivity);
    for(let i=0;i<cols*rows;i++){ const isPositive=i<positiveCount; const trueCase=i<truePositive; rect(startX+(i%cols)*cell,startY+Math.floor(i/cols)*cell,cell-3,cell-3,isPositive?(trueCase?config.accent:config.accent2):rgba(config.ink,.08),null,3); }
    text("200 PEOPLE",startX,startY-28,11); labelPill("true positives",startX,height-57,config.accent); labelPill("false alarms",startX+140,height-57,config.accent2); setMetrics([{label:"prior",value:`${(prior*100).toFixed(1)}%`},{label:"positive tests",value:positiveCount},{label:"posterior",value:`${(posterior*100).toFixed(1)}%`}]); setInsight(`A positive result raises the probability to ${(posterior*100).toFixed(1)}%. The prior matters because false positives can outnumber true cases when prevalence is low.`);
  }
  function drawCorrelation() {
    clear(); grid(); axes(); const noise=value("noise"), confound=value("confound"); const pts=state.points.slice(0,55).map((p,i)=>({x:p.x,y:clamp((1-noise)*p.x+noise*p.y+(confound-.5)*Math.sin(i)*.25)})); pts.push(pointer);
    pts.forEach((p,i)=>circle(60+p.x*(width-110),height-50-p.y*(height-100),i===pts.length-1?9:5,i===pts.length-1?config.accent2:config.accent,config.ink)); const r=correlation(pts); line(60,height-70, width-50, 70+(1-r)*120,config.ink,3); labelPill(`r = ${r.toFixed(2)}`,75,52); setMetrics([{label:"correlation",value:r.toFixed(2)},{label:"noise",value:`${Math.round(noise*100)}%`},{label:"confounder",value:confound.toFixed(2)}]); setInsight(`${Math.abs(r)>.7?"The relationship looks convincing":"The relationship is weak"}, but the adjustable confounder can create structure without direct causation. Drag anywhere to add a counterexample.`);
  }
  function drawHypothesis() {
    clear(); grid(); const effect=value("effect"), alpha=value("alpha"), n=value("sample"); const sd=110/Math.sqrt(n/10); const base=width*.43, alt=base+effect*180; const top=height*.72; const curve=(center,color)=>{const pts=Array.from({length:140},(_,i)=>{const x=50+i/139*(width-100); return [x,top-gaussian(x,center,sd)*300];}); polyline(pts,color,4);}; curve(base,config.ink);curve(alt,config.accent); const cutoff=base+sd*(1.64+(alpha-.05)*-5); rect(cutoff,70,width-cutoff-35,top-70,rgba(config.accent2,.32)); line(cutoff,65,cutoff,top+20,config.accent2,3); labelPill(`α ${(alpha*100).toFixed(1)}%`,cutoff-25,50,config.accent2,config.ink); const power=clamp(.5+effect*Math.sqrt(n)/5-alpha); setMetrics([{label:"power",value:`${Math.round(power*100)}%`},{label:"type II",value:`${Math.round((1-power)*100)}%`},{label:"n",value:Math.round(n)}]); setInsight(`At this effect and sample size, power is about ${Math.round(power*100)}%. Tightening alpha moves the cutoff right and reduces false alarms—but misses more real effects.`);
  }
  function drawDistribution() {
    clear(); grid(); axes(); const family=Math.round(value("family")), p1=value("parameter"), p2=value("spread"); const colors=[config.accent,config.accent2];
    const pdf=[],cdf=[]; let sum=0; for(let i=0;i<180;i++){const x=i/179; let y=family===0?gaussian(x,p1,p2*.24+.03):family===1?Math.pow(x,Math.max(.2,p1*5))*Math.pow(1-x,Math.max(.2,p2*5)):family===2?Math.exp(-x*(1+p1*6)):Math.abs(Math.sin(x*Math.PI*(2+p1*3)))*gaussian(x,.5,p2*.4+.1); sum+=y; pdf.push(y);cdf.push(sum);} const max=Math.max(...pdf); polyline(pdf.map((y,i)=>[60+i/179*(width-110),height-50-y/max*(height-120)]),colors[0],4); const total=cdf.at(-1); polyline(cdf.map((y,i)=>[60+i/179*(width-110),height-50-y/total*(height-120)]),colors[1],3); labelPill(["NORMAL","BETA","EXPONENTIAL","BIMODAL"][family],75,52); setMetrics([{label:"family",value:["Normal","Beta","Exp.","Bimodal"][family]},{label:"parameter",value:p1.toFixed(2)},{label:"spread",value:p2.toFixed(2)}]); setInsight("The solid curve is density; the lighter cumulative curve only moves upward. Change the family to compare how probability mass is organized.");
  }
  function drawLinear() {
    clear(); grid(); axes(); const noise=value("noise"), slope=value("slope"); const pts=state.points.slice(0,34).map((p,i)=>({x:p.x,y:clamp(.5+slope*(p.x-.5)+(p.y-.5)*noise)})); pts.push(pointer); pts.forEach((p,i)=>circle(60+p.x*(width-110),height-50-p.y*(height-100),i===pts.length-1?8:5,config.accent,config.ink)); const mx=mean(pts.map(p=>p.x)),my=mean(pts.map(p=>p.y)); const beta=pts.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0)/pts.reduce((s,p)=>s+(p.x-mx)**2,0); line(60,height-50-(my-beta*mx)*(height-100),width-50,height-50-(my+beta*(1-mx))*(height-100),config.accent2,4); for(let r=0;r<5;r++)ctx.strokeStyle=rgba(config.ink,.2),ctx.strokeRect(width-180+r*13,45+r*13,125-r*26,95-r*20); const mse=mean(pts.map(p=>(p.y-(my+beta*(p.x-mx)))**2)); setMetrics([{label:"slope",value:beta.toFixed(2)},{label:"MSE",value:mse.toFixed(3)},{label:"points",value:pts.length}]); setInsight("The fitted line minimizes squared vertical residuals. Drag in the canvas: one high-leverage point can rotate the whole solution.");
  }
  function drawGradient() {
    clear(); grid(36,.08); const lr=value("rate"), steps=Math.round(value("steps")); const cx=width*.56,cy=height*.5; for(let r=250;r>20;r-=28){ctx.beginPath();ctx.ellipse(cx,cy,r,r*.55,-.3,0,TAU);ctx.strokeStyle=rgba(config.ink,.15);ctx.stroke();} let x=width*.17,y=height*.2; const trail=[[x,y]]; for(let i=0;i<steps;i++){x+=(cx-x)*lr*(.28+Math.sin(i)*.05);y+=(cy-y)*lr*(.28+Math.cos(i)*.06);trail.push([x,y]);} polyline(trail,config.accent,4);trail.forEach((p,i)=>circle(p[0],p[1],i===trail.length-1?10:4,i===trail.length-1?config.accent2:config.accent,config.ink)); circle(cx,cy,8,config.ink); const distance=Math.hypot(x-cx,y-cy); setMetrics([{label:"learning rate",value:lr.toFixed(2)},{label:"steps",value:steps},{label:"loss",value:(distance/500).toFixed(4)}]); setInsight(lr>1.4?"The steps are too aggressive: the optimizer ricochets across the valley.":distance<25?"The path has settled near the minimum. Each step follows the local downhill direction.":"The optimizer is moving safely, but slowly. Increase the rate and watch the tradeoff.");
  }
  function drawTree() {
    clear(); grid(32,.07); const split=value("split"), depth=Math.round(value("depth")); const panelW=width*.48; rect(35,45,panelW,height-90,rgba(config.accent,.12),config.ink,8); state.points.slice(0,48).forEach((p,i)=>circle(45+p.x*(panelW-20),55+p.y*(height-110),5,p.x+p.y>1?config.accent:config.accent2,config.ink)); line(45+split*(panelW-20),55,45+split*(panelW-20),height-55,config.ink,3); const rootX=width*.73; circle(rootX,90,26,config.ink); text(`x < ${split.toFixed(2)}`,rootX,90,10,config.canvas,"center"); for(let level=1;level<=depth;level++){const nodes=2**level;for(let i=0;i<nodes;i++){const x=panelW+40+(i+.5)*(width-panelW-70)/nodes;const y=90+level*100;const parentX=panelW+40+(Math.floor(i/2)+.5)*(width-panelW-70)/(nodes/2);line(parentX,y-74,x,y-22,rgba(config.ink,.5));circle(x,y,18,level===depth?(i%2?config.accent:config.accent2):config.canvas,config.ink);}} const gini=2*split*(1-split);setMetrics([{label:"gini",value:gini.toFixed(3)},{label:"depth",value:depth},{label:"gain",value:(.5-gini*.4).toFixed(3)}]); setInsight(`The split at ${split.toFixed(2)} partitions the feature space. Deeper trees make finer regions, but their confidence can become brittle.`);
  }
  function drawKMeans() {
    clear(); grid(); const k=Math.round(value("clusters")), iteration=Math.round(value("iteration")); const centers=Array.from({length:k},(_,i)=>({x:.18+(i/(Math.max(1,k-1)))*.64+Math.sin(iteration+i)*.03,y:.3+((i*37)%50)/100})); state.points.slice(0,68).forEach(p=>{let best=0,dist=9;centers.forEach((c,i)=>{const d=Math.hypot(p.x-c.x,p.y-c.y);if(d<dist){dist=d;best=i;}});circle(50+p.x*(width-100),40+p.y*(height-80),5,[config.accent,config.accent2,config.ink,"#fff"][best%4],config.ink);});centers.forEach((c,i)=>{const x=50+c.x*(width-100),y=40+c.y*(height-80);circle(x,y,17,config.canvas,config.ink,4);line(x-8,y,x+8,y,config.ink,3);line(x,y-8,x,y+8,config.ink,3);labelPill(`C${i+1}`,x+17,y-22);});setMetrics([{label:"clusters",value:k},{label:"iteration",value:iteration},{label:"inertia",value:(94/(iteration+1)+k*2).toFixed(1)}]);setInsight(iteration<2?"Centroids begin as guesses. Advance the iteration to alternate assignment and update steps.":"Each point is assigned to its nearest centroid; the crosses move toward their assigned group’s mean.");
  }
  function drawKNN() {
    clear(); const k=Math.round(value("k")); const q=pointer; for(let gy=0;gy<18;gy++)for(let gx=0;gx<28;gx++){const x=gx/27,y=gy/17;rect(gx*width/28,gy*height/18,width/28+1,height/18+1,(x+y+Math.sin(x*9)*.12>.95)?rgba(config.accent,.18):rgba(config.accent2,.18));} const pts=state.points.slice(0,45); const sorted=[...pts].sort((a,b)=>Math.hypot(a.x-q.x,a.y-q.y)-Math.hypot(b.x-q.x,b.y-q.y));const radius=Math.hypot(sorted[k-1].x-q.x,sorted[k-1].y-q.y);circle(q.x*width,q.y*height,radius*Math.min(width,height),rgba(config.canvas,.25),config.ink,2);pts.forEach((p,i)=>circle(p.x*width,p.y*height,6,p.x+p.y>.95?config.accent:config.accent2,config.ink));circle(q.x*width,q.y*height,12,config.canvas,config.ink,4); const vote=sorted.slice(0,k).filter(p=>p.x+p.y>.95).length;setMetrics([{label:"K",value:k},{label:"class A",value:vote},{label:"class B",value:k-vote}]);setInsight(`The query point is classified by a ${vote}–${k-vote} neighborhood vote. Move it around and change K to smooth or fragment the boundary.`);
  }
  function drawLogistic() {
    clear(); grid(); axes(); const threshold=value("threshold"), steep=value("steep");const pts=Array.from({length:180},(_,i)=>{const x=i/179;const p=1/(1+Math.exp(-steep*(x-.5)));return[60+x*(width-110),height-50-p*(height-100)];});polyline(pts,config.accent,5);const y=height-50-threshold*(height-100);line(60,y,width-50,y,config.accent2,3);labelPill(`threshold ${threshold.toFixed(2)}`,70,y-20,config.accent2,config.ink);const tp=Math.round(72*(1-threshold)),fp=Math.round(35*(1-threshold));rect(width-214,50,164,125,rgba(config.ink,.08),config.ink,4);text("TP",width-190,80,11);text(String(tp),width-100,80,22,config.accent,"center");text("FP",width-190,130,11);text(String(fp),width-100,130,22,config.accent2,"center");setMetrics([{label:"threshold",value:threshold.toFixed(2)},{label:"precision",value:(tp/Math.max(1,tp+fp)).toFixed(2)},{label:"recall",value:(tp/72).toFixed(2)}]);setInsight("Lowering the threshold catches more positives and more false alarms. The sigmoid supplies probabilities; the threshold turns them into decisions.");
  }
  function drawForest() {
    clear(); const trees=Math.round(value("trees")),depth=Math.round(value("depth"));rect(30,45,width*.43,height-90,"#fff",config.ink,6);rect(width*.53,45,width*.44,height-90,"#fff",config.ink,6);text("ONE TREE",52,70,11);text(`${trees} TREE FOREST`,width*.55,70,11);for(let i=0;i<depth*4;i++){const x=45+seeded(i)*width*.39,y=90+seeded(i+20)*(height-160);line(x,90,x,y,rgba(config.accent,.6),3);}for(let i=0;i<trees;i++){const x=width*.55+seeded(i*4)*width*.38;line(x,90,x,height-65,rgba(i%2?config.accent:config.accent2,.1),1);}state.points.slice(0,52).forEach(p=>{const fill=p.x+p.y>.95?config.accent:config.accent2;circle(45+p.x*width*.39,90+p.y*(height-160),4,fill);circle(width*.55+p.x*width*.38,90+p.y*(height-160),4,fill);});setMetrics([{label:"estimators",value:trees},{label:"depth",value:depth},{label:"variance",value:(.42/Math.sqrt(trees)).toFixed(3)}]);setInsight("A single deep tree makes sharp, unstable cuts. Averaging many varied trees smooths those quirks without erasing the shared signal.");
  }
  function drawNeural() {
    clear(); const layers=Math.round(value("layers")),neurons=Math.round(value("neurons"));const columns=[3,...Array(layers).fill(neurons),2];const positions=columns.map((count,c)=>Array.from({length:count},(_,i)=>({x:70+c*(width-140)/(columns.length-1),y:height/2+(i-(count-1)/2)*Math.min(72,(height-100)/count)})));for(let c=0;c<positions.length-1;c++)positions[c].forEach((a,ai)=>positions[c+1].forEach((b,bi)=>line(a.x,a.y,b.x,b.y,rgba((ai+bi+c)%2?config.accent:config.accent2,.16+(seeded(ai*9+bi+c)*.35)),1)));positions.forEach((col,c)=>col.forEach((p,i)=>circle(p.x,p.y,13,c===0?config.accent:c===positions.length-1?config.accent2:config.canvas,config.ink,2)));const params=columns.slice(0,-1).reduce((s,n,i)=>s+(n+1)*columns[i+1],0);setMetrics([{label:"hidden layers",value:layers},{label:"neurons",value:neurons},{label:"parameters",value:params}]);setInsight("Every line carries a learned weight. Adding neurons creates more flexible features—but also more parameters to train and regularize.");
  }
  function drawPCA() {
    clear();grid();const angle=value("angle")*TAU,component=value("component");const cx=width/2,cy=height/2;ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);for(let i=0;i<72;i++){const x=(seeded(i)-.5)*460,y=(seeded(i+100)-.5)*100;circle(x,y,5,i%2?config.accent:config.accent2,config.ink);}line(-300,0,300,0,config.ink,4);line(0,-170,0,170,rgba(config.ink,.35),2);ctx.restore();const variance=component<.5?83:17;rect(50,height-55,(width-100)*variance/100,14,config.accent);text(`PC${component<.5?1:2} · ${variance}% variance`,50,height-75,11);setMetrics([{label:"component",value:component<.5?"PC1":"PC2"},{label:"explained",value:`${variance}%`},{label:"rotation",value:`${Math.round(angle/TAU*360)}°`}]);setInsight("PCA rotates the coordinate system toward maximum variance. PC1 captures the long direction of the cloud; PC2 keeps the remaining orthogonal spread.");
  }
  function drawMetrics() {
    clear();const threshold=value("threshold"),tp=Math.round(80*(1-threshold*.7)),fp=Math.round(50*(1-threshold)),fn=80-tp,tn=70-fp;const left=55,top=65,size=118;[["TP",tp,config.accent],["FP",fp,config.accent2],["FN",fn,config.accent2],["TN",tn,config.accent]].forEach((cell,i)=>{const x=left+(i%2)*size,y=top+Math.floor(i/2)*size;rect(x,y,size-8,size-8,rgba(cell[2],.7),config.ink,5);text(cell[0],x+14,y+24,10);text(String(cell[1]),x+size/2-4,y+67,31,config.ink,"center","Georgia");});const precision=tp/(tp+fp),recall=tp/(tp+fn);axes(width*.43,height-62,width-48,50);const roc=Array.from({length:40},(_,i)=>{const x=i/39;return[width*.43+x*(width*.52-48),height-62-Math.sqrt(x)*(height-115)];});polyline(roc,config.accent,4);circle(width*.43+(1-threshold)*(width*.52-48),height-62-Math.sqrt(1-threshold)*(height-115),9,config.accent2,config.ink);setMetrics([{label:"precision",value:precision.toFixed(2)},{label:"recall",value:recall.toFixed(2)},{label:"F1",value:(2*precision*recall/(precision+recall)).toFixed(2)}]);setInsight("One threshold updates the confusion matrix and ROC position together. Precision rewards clean positive predictions; recall rewards finding positives at all.");
  }
  function drawAB() {
    clear();grid();const a=value("rateA"),b=value("rateB"),visitors=Math.round(value("visitors"));const base=height-85,maxRate=Math.max(a,b,.3);[["A",a,config.ink,width*.31],["B",b,config.accent,width*.65]].forEach(item=>{const h=item[1]/maxRate*(height-180);rect(item[3]-70,base-h,140,h,item[2]);text(item[0],item[3],base+25,14,config.ink,"center");text(`${(item[1]*100).toFixed(1)}%`,item[3],base-h-24,24,config.ink,"center","Georgia");const se=Math.sqrt(item[1]*(1-item[1])/visitors);line(item[3],base-h-se*4000,item[3],base-h+se*4000,config.accent2,4);});const pooled=(a+b)/2,z=(b-a)/Math.sqrt(pooled*(1-pooled)*2/visitors);setMetrics([{label:"uplift",value:`${((b/a-1)*100).toFixed(1)}%`},{label:"z score",value:z.toFixed(2)},{label:"verdict",value:Math.abs(z)>1.96?"Significant":"Keep testing"}]);setInsight(Math.abs(z)>1.96?"The observed gap is unlikely under equal conversion rates at the 5% level. Check practical value before shipping.":"This experiment is not yet decisive. More visitors or a larger real effect would narrow the uncertainty.");
  }
  function drawSample() {
    clear();grid();axes();const effect=value("effect"),power=value("power"),alpha=value("alpha");const required=Math.ceil(2*((1.96+(power-.5)*2.6)/effect)**2);const curve=Array.from({length:160},(_,i)=>{const x=i/159;const y=1-Math.exp(-x*5*effect*4);return[60+x*(width-110),height-50-y*(height-110)];});polyline(curve,config.accent,5);const x=60+clamp(required/5000)*(width-110),y=height-50-(1-Math.exp(-clamp(required/5000)*5*effect*4))*(height-110);circle(x,y,11,config.accent2,config.ink);labelPill(`${required} / group`,Math.min(x+18,width-160),y-25);setMetrics([{label:"per group",value:required},{label:"total",value:required*2},{label:"power",value:`${Math.round(power*100)}%`}]);setInsight("Small effects demand large samples because the signal is easily hidden by random variation. Higher power also raises the participant requirement.");
  }
  function drawOutlier() {
    clear();grid();const threshold=value("threshold"),method=Math.round(value("method"));const pts=state.points.slice(0,65).map((p,i)=>({x:p.x,y:i<4?clamp(p.y+(i%2?.35:-.35)):p.y*.55+.23}));let flagged=0;pts.forEach((p,i)=>{const score=Math.abs(p.y-.5)*2+(method===2?Math.abs(p.x-.5):0);const out=score>threshold;flagged+=out;circle(45+p.x*(width-90),40+p.y*(height-80),out?11:5,out?config.accent2:config.accent,config.ink,out?3:1);});labelPill(["Z-SCORE","IQR","ISOLATION"][method],55,50);setMetrics([{label:"method",value:["Z-score","IQR","Isolation"][method]},{label:"flagged",value:flagged},{label:"threshold",value:threshold.toFixed(2)}]);setInsight("Different detectors encode different ideas of unusual. Compare the same points: distribution-based rules and isolation-style scoring do not always agree.");
  }
  function drawScaling() {
    clear();const robust=value("robust");const panels=["RAW","STANDARD","MIN–MAX","ROBUST"];panels.forEach((name,p)=>{const x=28+p*(width-46)/4,w=(width-76)/4;rect(x,48,w,height-94,rgba(p%2?config.accent:config.accent2,.1),config.ink,5);text(name,x+15,72,10);state.points.slice(0,24).forEach((pt,i)=>{let px=pt.x,py=pt.y;if(p===1){px=(px-.5)*.65+.5;py=(py-.5)*.65+.5;}if(p===2){px=.12+px*.76;py=.12+py*.76;}if(p===3){px=(px-.5)*(1-robust*.5)+.5;py=(py-.5)*(1-robust*.5)+.5;}circle(x+15+px*(w-30),95+py*(height-160),4,i%3?config.accent:config.accent2);});});setMetrics([{label:"view",value:"4 scales"},{label:"robustness",value:robust.toFixed(2)},{label:"rank order",value:"preserved"}]);setInsight("Scaling changes geometry, not row order. Standardization centers variance; min–max fixes bounds; robust scaling resists extreme values.");
  }
  function drawCV() {
    clear();const k=Math.round(value("folds")),round=Math.round(value("round"))%k;const left=50,top=90,rowH=Math.min(58,(height-150)/k);for(let r=0;r<k;r++){text(`FOLD ${r+1}`,left,top+r*rowH+rowH/2,10);for(let c=0;c<k;c++){const x=left+85+c*(width-left-120)/k,w=(width-left-130)/k-5;rect(x,top+r*rowH,w,rowH-8,c===r?config.accent2:config.accent,config.ink,3);if(r===round)text(c===r?"VALIDATE":"TRAIN",x+w/2,top+r*rowH+(rowH-8)/2,9,config.ink,"center");}}setMetrics([{label:"folds",value:k},{label:"round",value:`${round+1} / ${k}`},{label:"train share",value:`${Math.round((k-1)/k*100)}%`}]);setInsight(`Round ${round+1} holds out fold ${round+1}. After ${k} rounds, every observation has served once as validation data.`);
  }
  function drawTitanic() {
    clear();const classFilter=Math.round(value("class")),gender=value("gender"),survival=[.63,.47,.24][classFilter]*(.72+gender*.45);text("SURVIVAL BY PASSENGER GROUP",48,45,11);for(let i=0;i<96;i++){const alive=seeded(i)<survival;const x=55+(i%24)*((width-110)/24),y=82+Math.floor(i/24)*48;circle(x,y,9,alive?config.accent:rgba(config.ink,.17),config.ink);}const barY=height-105;rect(55,barY,(width-110)*survival,36,config.accent);rect(55+(width-110)*survival,barY,(width-110)*(1-survival),36,rgba(config.ink,.16));text(`${Math.round(survival*100)}% survived`,55,barY-25,18,config.ink,"left","Georgia");setMetrics([{label:"class",value:["First","Second","Third"][classFilter]},{label:"survival",value:`${Math.round(survival*100)}%`},{label:"passengers",value:96}]);setInsight("The apparent survival rate changes sharply across passenger class and gender. Filters reveal subgroup structure hidden by one overall average.");
  }
  function drawHousing() {
    clear();grid();axes();const feature=value("feature"),guess=value("guess");const pts=state.points.slice(0,62).map(p=>({x:p.x,y:clamp(.2+p.x*(.35+feature*.45)+(p.y-.5)*(.5-feature*.25))}));pts.forEach(p=>circle(60+p.x*(width-110),height-50-p.y*(height-100),5,config.accent,config.ink));line(60,height-70-guess*90,width-50,90-guess*30,config.accent2,4);const r=correlation(pts);for(let i=0;i<5;i++)for(let j=0;j<5;j++)rect(width-180+i*22,45+j*22,19,19,rgba(i===j?config.ink:config.accent, i===j?1:Math.abs(i-j)/6+.15));setMetrics([{label:"correlation",value:r.toFixed(2)},{label:"feature signal",value:feature.toFixed(2)},{label:"guess slope",value:guess.toFixed(2)}]);setInsight("The stronger feature produces a tighter price relationship. The yellow line is your hypothesis—adjust it before trusting the fitted answer.");
  }
  function drawMissing() {
    clear();const missing=value("missing"),strategy=Math.round(value("strategy"));const cols=30,rows=12,cell=Math.min((width-90)/cols,(height-180)/rows);for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const isNull=seeded(r*cols+c)<missing;rect(45+c*cell,55+r*cell,cell-2,cell-2,isNull?config.accent2:config.accent,null,2);}const base=height-60;for(let i=0;i<24;i++){const x=55+i*(width-110)/24;const y=(strategy===0?gaussian(i/23,.5,.18):strategy===1?gaussian(i/23,.48,.1):gaussian(i/23,.58,.24))*90;rect(x,base-y,(width-110)/24-3,y,config.ink);}labelPill(["DROP","MEDIAN","MODEL IMPUTE"][strategy],55,height-145);setMetrics([{label:"missing",value:`${Math.round(missing*100)}%`},{label:"strategy",value:["Drop","Median","Model"][strategy]},{label:"rows kept",value:Math.round(360*(1-(strategy===0?missing:0)))}]);setInsight("The heatmap shows whether absence clusters by row or feature. Imputation preserves rows, but each strategy leaves a recognizable fingerprint in the distribution.");
  }
  function drawTimeSeries() {
    clear();grid();const season=value("season"),trend=value("trend");const panels=[["OBSERVED",70],["TREND",height*.39],["SEASONAL",height*.63],["RESIDUAL",height*.84]];panels.forEach((panel,p)=>{text(panel[0],45,panel[1]-24,9);const pts=Array.from({length:150},(_,i)=>{const x=55+i/149*(width-100),t=i/149;const tr=(t-.5)*trend*40,se=Math.sin(t*TAU*season)*18,no=(seeded(i+frame)-.5)*12;const val=p===0?tr+se+no:p===1?tr:p===2?se:no;return[x,panel[1]-val];});polyline(pts,p===0?config.ink:p===1?config.accent:p===2?config.accent2:rgba(config.ink,.45),p===0?3:2);});setMetrics([{label:"period",value:Math.round(season)},{label:"trend",value:trend.toFixed(2)},{label:"residual σ",value:"0.12"}]);setInsight("The observed line is decomposed additively. Trend captures slow movement, seasonality repeats, and residuals contain what the structure did not explain.");
  }
  function drawHeatmap() {
    clear();const selected=Math.round(value("cell"));const size=Math.min(55,(height-100)/6);for(let r=0;r<6;r++)for(let c=0;c<6;c++){const corr=Math.cos((r-c)*.8)*(1-Math.abs(r-c)*.07);const chosen=r*6+c===selected;rect(45+c*size,55+r*size,size-3,size-3,corr>0?rgba(config.accent,Math.abs(corr)):rgba(config.accent2,Math.abs(corr)),chosen?config.ink:null,3);text(corr.toFixed(1),45+c*size+(size-3)/2,55+r*size+(size-3)/2,9,config.ink,"center");}rect(width*.52,55,width*.43,height-110,rgba(config.ink,.04),config.ink,5);state.points.slice(0,38).forEach(p=>circle(width*.54+p.x*width*.39,75+(1-p.x*.7-p.y*.3)*(height-150),4,config.ink));text("SELECTED PAIR",width*.54,78,10);setMetrics([{label:"cell",value:selected},{label:"correlation",value:Math.cos((selected%6-Math.floor(selected/6))*.8).toFixed(2)},{label:"variables",value:"6 × 6"}]);setInsight("A heatmap coefficient is only a summary. The linked scatterplot exposes shape, clusters, and outliers that the single number compresses.");
  }
  function drawBias() {
    clear();grid();axes();const degree=Math.round(value("degree")),noise=value("noise");const truth=Array.from({length:160},(_,i)=>{const x=i/159;return[60+x*(width-110),height*.55-Math.sin(x*TAU)*95];});polyline(truth,rgba(config.ink,.25),3);const fit=Array.from({length:160},(_,i)=>{const x=i/159;const wiggle=degree<3?0:Math.sin(x*TAU*(degree-1))*noise*degree*8;const base=degree===1?(x-.5)*-80:Math.sin(x*TAU)*95;return[60+x*(width-110),height*.55-base+wiggle];});polyline(fit,config.accent,5);for(let i=0;i<28;i++){const x=i/27,y=height*.55-Math.sin(x*TAU)*95+(seeded(i)-.5)*noise*100;circle(60+x*(width-110),y,4,config.accent2,config.ink);}const train=1/(degree+1)+noise*.2,test=.12+(degree-4)**2*.025+noise*.18;setMetrics([{label:"degree",value:degree},{label:"train error",value:train.toFixed(2)},{label:"test error",value:test.toFixed(2)}]);setInsight(degree<3?"The model is too rigid and misses the true curve: high bias.":degree>7?"The model chases individual noisy points: low training error, high variance.":"The model is flexible enough to capture the signal without memorizing every fluctuation.");
  }
  function drawRegularization() {
    clear();grid();axes();const lambda=value("lambda"),method=Math.round(value("method"));const count=7;for(let c=0;c<count;c++){const start=(c-count/2)*.15;const pts=Array.from({length:120},(_,i)=>{const x=i/119*lambda;const coef=method===0?Math.sign(start)*Math.max(0,Math.abs(start)-x*.18):start/(1+x*2.4);return[60+i/119*(width-110),height/2-coef*(height*.72)];});polyline(pts,c%2?config.accent:config.accent2,3);}line(60,height/2,width-50,height/2,config.ink);labelPill(method===0?"L1 / LASSO":"L2 / RIDGE",70,52);const zeros=method===0?Math.round(lambda*3):0;setMetrics([{label:"lambda",value:lambda.toFixed(2)},{label:"penalty",value:method===0?"L1":"L2"},{label:"zero coefficients",value:zeros}]);setInsight(method===0?"L1 shrinkage has corners: weaker coefficients can land exactly at zero, performing feature selection.":"L2 shrinkage pulls every coefficient smoothly toward zero, usually keeping all features in the model.");
  }
  function drawROC() {
    clear();grid();axes();const threshold=value("threshold"),separation=value("separation");const pts=Array.from({length:100},(_,i)=>{const fpr=i/99;const tpr=Math.pow(fpr,1/(1+separation*5));return[60+fpr*(width-110),height-50-tpr*(height-100)];});polyline([[60,height-50],[width-50,50]],rgba(config.ink,.25),2);polyline(pts,config.accent,5);const fpr=1-threshold,tpr=Math.pow(fpr,1/(1+separation*5));polyline(pts.slice(0,Math.max(2,Math.floor(fpr*99))),config.accent2,6);circle(60+fpr*(width-110),height-50-tpr*(height-100),11,config.canvas,config.ink,4);const auc=.5+separation*.45;setMetrics([{label:"threshold",value:threshold.toFixed(2)},{label:"TPR",value:tpr.toFixed(2)},{label:"AUC",value:auc.toFixed(2)}]);setInsight("Sweeping the threshold traces every tradeoff between true- and false-positive rates. AUC summarizes the ranking quality across all those operating points.");
  }
  function drawLeakage() {
    clear();const scenario=Math.round(value("scenario"));const cases=[{title:"Normalize the full dataset, then split",leak:true,why:"The test distribution influenced training transforms."},{title:"Split by patient before feature engineering",leak:false,why:"No patient information crosses the boundary."},{title:"Use next month’s balance to predict churn",leak:true,why:"The feature arrives after prediction time."}];const item=cases[scenario];text("PIPELINE CASEFILE",width/2,60,12,config.ink,"center");rect(width*.16,105,width*.68,175,rgba(config.accent,.14),config.ink,9);text(item.title,width/2,165,22,config.ink,"center","Georgia",400);text("Click the canvas to file your verdict",width/2,225,11,rgba(config.ink,.65),"center");const verdict=state.choice===null?"UNSOLVED":state.choice===item.leak?"CORRECT":"REOPEN CASE";rect(width*.31,325,width*.38,72,state.choice===null?config.canvas:state.choice===item.leak?config.accent:config.accent2,config.ink,36);text(verdict,width/2,361,14,config.ink,"center");text(state.choice===null?"Your decision changes the report.":item.why,width/2,445,12,config.ink,"center");setMetrics([{label:"scenario",value:`${scenario+1} / 3`},{label:"status",value:verdict},{label:"streak",value:state.choice===item.leak?1:0}]);setInsight(state.choice===null?"Decide whether future or test-set information has crossed into model training, then click the casefile to reveal the finding.":item.why);
  }
  function drawSelector() {
    clear();const labels=Math.round(value("labels")),modality=Math.round(value("modality")),scaleValue=value("scale");const root={x:width/2,y:70};const level1=[{x:width*.27,y:180,t:"LABELED"},{x:width*.73,y:180,t:"UNLABELED"}];const level2=[{x:width*.15,y:320,t:"TABLE"},{x:width*.39,y:320,t:"MEDIA"},{x:width*.62,y:320,t:"CLUSTERS"},{x:width*.84,y:320,t:"EMBED"}];level1.forEach(n=>line(root.x,root.y+22,n.x,n.y-22,rgba(config.ink,.35),2));level2.forEach((n,i)=>line(level1[Math.floor(i/2)].x,level1[Math.floor(i/2)].y+22,n.x,n.y-22,rgba(config.ink,.35),2));circle(root.x,root.y,28,config.ink);text("GOAL",root.x,root.y,10,config.canvas,"center");level1.forEach((n,i)=>{circle(n.x,n.y,labels===i?34:25,labels===i?config.accent:config.canvas,config.ink,2);text(n.t,n.x,n.y,9,config.ink,"center");});level2.forEach((n,i)=>{rect(n.x-44,n.y-22,88,44,modality===i?config.accent2:config.canvas,config.ink,7);text(n.t,n.x,n.y,9,config.ink,"center");});const result=labels===1?(modality<2?"K-MEANS / PCA":"EMBEDDINGS"):modality===1?(scaleValue>.6?"TRANSFER LEARNING":"SMALL CNN"):scaleValue>.6?"GRADIENT BOOSTING":"LINEAR / TREE";rect(width*.28,420,width*.44,75,config.ink,null,8);text(result,width/2,457,20,config.accent,"center","Georgia");setMetrics([{label:"labels",value:labels?"No":"Yes"},{label:"modality",value:["Table","Media","Clusters","Text"][modality]},{label:"starting point",value:result}]);setInsight("The flow recommends a model family, not a winner. Data size, latency, interpretability, and a trustworthy baseline still decide the final choice.");
  }

  const drawers = {
    clt: drawCLT, bayes: drawBayes, correlation: drawCorrelation, hypothesis: drawHypothesis, distribution: drawDistribution,
    linear: drawLinear, gradient: drawGradient, tree: drawTree, kmeans: drawKMeans, knn: drawKNN,
    logistic: drawLogistic, forest: drawForest, neural: drawNeural, pca: drawPCA, metrics: drawMetrics,
    ab: drawAB, sample: drawSample, outlier: drawOutlier, scaling: drawScaling, cv: drawCV,
    titanic: drawTitanic, housing: drawHousing, missing: drawMissing, timeseries: drawTimeSeries, heatmap: drawHeatmap,
    bias: drawBias, regularization: drawRegularization, roc: drawROC, leakage: drawLeakage, selector: drawSelector,
  };

  function resize() {
    const bounds = canvasWrap.getBoundingClientRect(); scale = Math.min(window.devicePixelRatio || 1, 2); width = Math.max(320, Math.floor(bounds.width)); height = Math.max(400, Math.floor(bounds.height)); canvas.width = width * scale; canvas.height = height * scale; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(scale, 0, 0, scale, 0, 0); render(true);
  }
  function render(force = false) {
    if (!force && !running) return; frame++; drawers[config.engine]?.(); phaseLabel.textContent = running ? "LIVE SIGNAL" : "PAUSED";
  }
  function loop() { if (running && frame % 2 === 0) render(); requestAnimationFrame(loop); }
  function pointerEvent(event) {
    const bounds=canvas.getBoundingClientRect(); pointer={x:clamp((event.clientX-bounds.left)/bounds.width),y:clamp((event.clientY-bounds.top)/bounds.height)};
    if(config.engine==="leakage"&&event.type==="pointerdown")state.choice=state.choice===null?true:!state.choice;
    render(true);
  }
  canvas.addEventListener("pointerdown",event=>{activePointer=true;canvas.setPointerCapture(event.pointerId);pointerEvent(event);});
  canvas.addEventListener("pointermove",event=>{if(activePointer)pointerEvent(event);});
  canvas.addEventListener("pointerup",()=>{activePointer=false;});
  runButton.addEventListener("click",()=>{running=!running;runButton.querySelector("span").textContent=running?"Pause motion":"Run experiment";runButton.classList.toggle("is-running",running);render(true);});
  resetButton.addEventListener("click",()=>{values=Object.fromEntries(config.controls.map(c=>[c.key,c.value]));config.controls.forEach(c=>{const input=document.querySelector(`[data-key="${c.key}"]`);input.value=c.value;updateControl(c);});state=makeState();pointer={x:.5,y:.5};render(true);});
  window.addEventListener("resize",resize);
  buildControls(); resize(); loop();
})();
