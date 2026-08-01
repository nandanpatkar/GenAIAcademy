import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";
import { useEffect, useRef } from "react";
import "./Orb.css";

export default function Orb({ hue = 0, hoverIntensity = 0.2, rotateOnHover = true, forceHoverState = false, backgroundColor = "#000000", speed = 1 }) {
  const containerRef = useRef(null);
  const vert = `precision highp float; attribute vec2 position; attribute vec2 uv; varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;
  const frag = `precision highp float;
uniform float iTime; uniform vec3 iResolution; uniform float hue; uniform float hover; uniform float rot; uniform float hoverIntensity; uniform vec3 backgroundColor; varying vec2 vUv;
vec3 rgb2yiq(vec3 c){return vec3(dot(c,vec3(.299,.587,.114)),dot(c,vec3(.596,-.274,-.322)),dot(c,vec3(.211,-.523,.312)));}
vec3 yiq2rgb(vec3 c){return vec3(c.x+.956*c.y+.621*c.z,c.x-.272*c.y-.647*c.z,c.x-1.106*c.y+1.703*c.z);}
vec3 adjustHue(vec3 color,float hueDeg){float a=hueDeg*3.14159265/180.;vec3 y=rgb2yiq(color);float i=y.y*cos(a)-y.z*sin(a);y.z=y.y*sin(a)+y.z*cos(a);y.y=i;return yiq2rgb(y);}
vec3 hash33(vec3 p){p=fract(p*vec3(.1031,.11369,.13787));p+=dot(p,p.yxz+19.19);return -1.+2.*fract(vec3(p.x+p.y,p.x+p.z,p.y+p.z)*p.zyx);}
float snoise3(vec3 p){const float K1=.333333333;const float K2=.166666667;vec3 i=floor(p+(p.x+p.y+p.z)*K1);vec3 d0=p-(i-(i.x+i.y+i.z)*K2);vec3 e=step(vec3(0.),d0-d0.yzx);vec3 i1=e*(1.-e.zxy);vec3 i2=1.-e.zxy*(1.-e);vec3 d1=d0-(i1-K2);vec3 d2=d0-(i2-K1);vec3 d3=d0-.5;vec4 h=max(.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.);vec4 n=h*h*h*h*vec4(dot(d0,hash33(i)),dot(d1,hash33(i+i1)),dot(d2,hash33(i+i2)),dot(d3,hash33(i+1.)));return dot(vec4(31.316),n);}
vec4 extractAlpha(vec3 c){float a=max(max(c.r,c.g),c.b);return vec4(c/(a+1e-5),a);}
float light1(float i,float a,float d){return i/(1.+d*a);} float light2(float i,float a,float d){return i/(1.+d*d*a);}
vec4 draw(vec2 uv){vec3 c1=adjustHue(vec3(.611765,.262745,.996078),hue);vec3 c2=adjustHue(vec3(.298039,.760784,.913725),hue);vec3 c3=adjustHue(vec3(.062745,.078431,.6),hue);float inner=.6;float ang=atan(uv.y,uv.x);float len=length(uv);float inv=len>0.?1./len:0.;float lum=dot(backgroundColor,vec3(.299,.587,.114));float n=snoise3(vec3(uv*.65,iTime*.5))*.5+.5;float r=mix(mix(inner,1.,.4),mix(inner,1.,.6),n);float d0=distance(uv,(r*inv)*uv);float v0=light1(1.,10.,d0);v0*=smoothstep(r*1.05,r,len);v0*=mix(smoothstep(r*.8,r*.95,len),1.,lum*.7);float cl=cos(ang+iTime*2.)*.5+.5;float a=-iTime;float d=distance(uv,vec2(cos(a),sin(a))*r);float v1=light2(1.5,5.,d)*light1(1.,50.,d0);float v2=smoothstep(1.,mix(inner,1.,n*.5),len);float v3=smoothstep(inner,mix(inner,1.,.5),len);vec3 base=mix(c1,c2,cl);vec3 dark=clamp((mix(c3,base,v0)+v1)*v2*v3,0.,1.);vec3 light=clamp(mix(backgroundColor,(base+v1)*mix(1.,v2*v3,mix(1.,.1,lum)),v0),0.,1.);return extractAlpha(mix(dark,light,lum));}
void main(){vec2 center=iResolution.xy*.5;float size=min(iResolution.x,iResolution.y);vec2 uv=(vUv*iResolution.xy-center)/size*2.;float s=sin(rot),c=cos(rot);uv=vec2(c*uv.x-s*uv.y,s*uv.x+c*uv.y);uv.x+=hover*hoverIntensity*.1*sin(uv.y*10.+iTime);uv.y+=hover*hoverIntensity*.1*sin(uv.x*10.+iTime);vec4 col=draw(uv);gl_FragColor=vec4(col.rgb*col.a,col.a);}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);
    const program = new Program(gl, { vertex: vert, fragment: frag, uniforms: { iTime: { value: 0 }, iResolution: { value: new Vec3(1, 1, 1) }, hue: { value: hue }, hover: { value: 0 }, rot: { value: 0 }, hoverIntensity: { value: hoverIntensity }, backgroundColor: { value: hexToVec3(backgroundColor) } } });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); const width = container.clientWidth; const height = container.clientHeight; renderer.setSize(width * dpr, height * dpr); gl.canvas.style.width = `${width}px`; gl.canvas.style.height = `${height}px`; program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / Math.max(1, gl.canvas.height)); };
    const onMove = (event) => { const rect = container.getBoundingClientRect(); const size = Math.min(rect.width, rect.height); const x = ((event.clientX - rect.left - rect.width / 2) / size) * 2; const y = ((event.clientY - rect.top - rect.height / 2) / size) * 2; targetHover = Math.hypot(x, y) < .8 ? 1 : 0; };
    let targetHover = 0; let lastTime = 0; let rotation = 0; let frame;
    const update = (time) => { frame = requestAnimationFrame(update); const dt = (time - lastTime) * .001; lastTime = time; program.uniforms.iTime.value = time * .001 * speed; program.uniforms.hue.value = hue; program.uniforms.hoverIntensity.value = hoverIntensity; program.uniforms.backgroundColor.value = hexToVec3(backgroundColor); const effectiveHover = forceHoverState ? 1 : targetHover; program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * .1; if (rotateOnHover && effectiveHover > .5) rotation += dt * .3; program.uniforms.rot.value = rotation; renderer.render({ scene: mesh }); };
    window.addEventListener("resize", resize); container.addEventListener("mousemove", onMove); container.addEventListener("mouseleave", () => { targetHover = 0; }); resize(); frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); gl.canvas.remove(); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, [backgroundColor, forceHoverState, hoverIntensity, hue, rotateOnHover, speed]);
  return <div ref={containerRef} className="orb-container" aria-hidden="true" />;
}

function hexToVec3(color) { const value = color.replace("#", ""); return new Vec3(parseInt(value.slice(0, 2), 16) / 255, parseInt(value.slice(2, 4), 16) / 255, parseInt(value.slice(4, 6), 16) / 255); }
