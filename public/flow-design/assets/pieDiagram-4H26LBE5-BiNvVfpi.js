import{g as Q,s as Y,a as tt,b as et,q as at,p as rt,_ as u,l as z,c as nt,G as it,K as st,O as ot,d as lt,z as ct,H as pt}from"./mermaid.core-CdV0AnaJ.js";import{p as ut}from"./chunk-4BX2VUAB-DsyJiGVc.js";import{p as dt}from"./wardley-L42UT6IY-Bu_QIo0x.js";import"./index-DRVVxoQk.js";import{d as _}from"./arc-CvxKGtKH.js";import{o as gt}from"./ordinal-Cboi1Yqb.js";import{a as S,t as R,a1 as ft}from"./FlowEditor-YdT1yirz.js";import"./vendor-lucide-YCXXi_N9.js";import"./vendor-motion-Ds6UPYLE.js";import"./vendor-i18n-2e8yRHGn.js";import"./init-Gi6I4Gst.js";import"./viewerUrlCodec-DvInTfJv.js";import"./providerCatalog-BVn8CwlQ.js";import"./events-D76nTV-n.js";import"./vendor-ai-B6yI1Dsd.js";import"./vendor-elk-bundled-TDtrdbi3.js";function mt(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function ht(t){return t}function vt(){var t=ht,a=mt,f=null,y=S(0),s=S(R),d=S(0);function o(e){var n,l=(e=ft(e)).length,g,m,v=0,c=new Array(l),i=new Array(l),x=+y.apply(this,arguments),w=Math.min(R,Math.max(-R,s.apply(this,arguments)-x)),h,D=Math.min(Math.abs(w)/l,d.apply(this,arguments)),$=D*(w<0?-1:1),p;for(n=0;n<l;++n)(p=i[c[n]=n]=+t(e[n],n,e))>0&&(v+=p);for(a!=null?c.sort(function(A,C){return a(i[A],i[C])}):f!=null&&c.sort(function(A,C){return f(e[A],e[C])}),n=0,m=v?(w-l*$)/v:0;n<l;++n,x=h)g=c[n],p=i[g],h=x+(p>0?p*m:0)+$,i[g]={data:e[g],index:n,value:p,startAngle:x,endAngle:h,padAngle:D};return i}return o.value=function(e){return arguments.length?(t=typeof e=="function"?e:S(+e),o):t},o.sortValues=function(e){return arguments.length?(a=e,f=null,o):a},o.sort=function(e){return arguments.length?(f=e,a=null,o):f},o.startAngle=function(e){return arguments.length?(y=typeof e=="function"?e:S(+e),o):y},o.endAngle=function(e){return arguments.length?(s=typeof e=="function"?e:S(+e),o):s},o.padAngle=function(e){return arguments.length?(d=typeof e=="function"?e:S(+e),o):d},o}var xt=pt.pie,W={sections:new Map,showData:!1},T=W.sections,F=W.showData,St=structuredClone(xt),yt=u(()=>structuredClone(St),"getConfig"),wt=u(()=>{T=new Map,F=W.showData,ct()},"clear"),At=u(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(t)||(T.set(t,a),z.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),Ct=u(()=>T,"getSections"),Dt=u(t=>{F=t},"setShowData"),$t=u(()=>F,"getShowData"),V={getConfig:yt,clear:wt,setDiagramTitle:rt,getDiagramTitle:at,setAccTitle:et,getAccTitle:tt,setAccDescription:Y,getAccDescription:Q,addSection:At,getSections:Ct,setShowData:Dt,getShowData:$t},Tt=u((t,a)=>{ut(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),bt={parse:u(async t=>{const a=await dt("pie",t);z.debug(a),Tt(a,V)},"parse")},kt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),Et=kt,Mt=u(t=>{const a=[...t.values()].reduce((s,d)=>s+d,0),f=[...t.entries()].map(([s,d])=>({label:s,value:d})).filter(s=>s.value/a*100>=1);return vt().value(s=>s.value).sort(null)(f)},"createPieArcs"),Rt=u((t,a,f,y)=>{var P;z.debug(`rendering pie chart
`+t);const s=y.db,d=nt(),o=it(s.getConfig(),d.pie),e=40,n=18,l=4,g=450,m=g,v=st(a),c=v.append("g");c.attr("transform","translate("+m/2+","+g/2+")");const{themeVariables:i}=d;let[x]=ot(i.pieOuterStrokeWidth);x??(x=2);const w=o.textPosition,h=Math.min(m,g)/2-e,D=_().innerRadius(0).outerRadius(h),$=_().innerRadius(h*w).outerRadius(h*w);c.append("circle").attr("cx",0).attr("cy",0).attr("r",h+x/2).attr("class","pieOuterCircle");const p=s.getSections(),A=Mt(p),C=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let b=0;p.forEach(r=>{b+=r});const G=A.filter(r=>(r.data.value/b*100).toFixed(0)!=="0"),k=gt(C).domain([...p.keys()]);c.selectAll("mySlices").data(G).enter().append("path").attr("d",D).attr("fill",r=>k(r.data.label)).attr("class","pieCircle"),c.selectAll("mySlices").data(G).enter().append("text").text(r=>(r.data.value/b*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice");const U=c.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),L=[...p.entries()].map(([r,M])=>({label:r,value:M})),E=c.selectAll(".legend").data(L).enter().append("g").attr("class","legend").attr("transform",(r,M)=>{const I=n+l,X=I*L.length/2,Z=12*n,J=M*I-X;return"translate("+Z+","+J+")"});E.append("rect").attr("width",n).attr("height",n).style("fill",r=>k(r.label)).style("stroke",r=>k(r.label)),E.append("text").attr("x",n+l).attr("y",n-l).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const j=Math.max(...E.selectAll("text").nodes().map(r=>(r==null?void 0:r.getBoundingClientRect().width)??0)),q=m+e+n+l+j,N=((P=U.node())==null?void 0:P.getBoundingClientRect().width)??0,H=m/2-N/2,K=m/2+N/2,O=Math.min(0,H),B=Math.max(q,K)-O;v.attr("viewBox",`${O} 0 ${B} ${g}`),lt(v,g,B,o.useMaxWidth)},"draw"),zt={draw:Rt},Zt={parser:bt,db:V,renderer:zt,styles:Et};export{Zt as diagram};
