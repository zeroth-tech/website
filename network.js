(() => {
'use strict';
const canvas = document.getElementById('network');
if (!canvas) return;
const ctx = canvas.getContext('2d', { alpha: true });
if (!ctx) return;
const stage = document.body;
const main = document.querySelector('main');
let contentTop = 0, contentBottom = 0;
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const accessibility=window.ZerothAccessibility;
const initialPreferences=accessibility?.getState();
let width = 0, height = 0, nodes = [], roots = [], edges = [], pulses = [], rings = [], letters = [], visibleLetters = [];
let tick = 0, lastTime = 0, birthClock = 0, autoClock = 0, letterClock = 0, lastStimulus = 0, lastPointerPulse = 0;
let userPaused = initialPreferences?.stopAnimation || false;
let easyRead = initialPreferences?.easyRead || false;
let reduced = initialPreferences?.reducedMotion ?? motionQuery.matches, paused = reduced || userPaused || easyRead, running = false;
let rafId = 0, measurePending = false, pointerPending = false;
const viewportTop = () => window.scrollY;
const viewportHeight = () => window.innerHeight;
const maxNodes = () => Math.min(900, Math.ceil(height / 750) * (mobile() ? 75 : 140));
let randomSeed = 18364, sequence = 0, nextId = 1, activeHighlight = new Set();
let pointer = { x: -1000, y: -1000, inside: false };
const TAU = Math.PI * 2, clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const rng = () => { randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0; return randomSeed / 4294967296; };
const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const mobile = () => width < 600;
// Keep links and semantic elements intact. Screen readers receive the original
// text once; visual letters remain selectable but are hidden from the accessibility tree.
function splitLetters() {
  const targets = document.querySelectorAll('main h1, main h2, main h3, .hero-description, .principles-intro>p, .name-grid p, .study-grid>div>p, .writing-intro>p, .feature-subtitle, .writing-note>p:not(.eyebrow)');
  targets.forEach(parent => {
    const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
    const texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(textNode => {
      if (!textNode.textContent.trim()) return;
      const fragment = document.createDocumentFragment();
      const accessible = document.createElement('span');
      accessible.className = 'sr-only'; accessible.textContent = textNode.textContent;
      fragment.append(accessible);
      textNode.textContent.split(/(\s+)/).forEach(part => {
        if (/^\s+$/.test(part)) { fragment.append(document.createTextNode(part)); return; }
        const word = document.createElement('span'); word.className = 'word'; word.setAttribute('aria-hidden','true');
        [...part].forEach(char => { const span = document.createElement('span'); span.className = 'letter'; span.textContent = char; word.append(span); });
        fragment.append(word);
      });
      textNode.replaceWith(fragment);
    });
  });
  letters = [...document.querySelectorAll('.letter')].map(el => ({el, x:0, y:0, w:0, h:0, until:0, group:el.closest('h1,h2,h3,p')}));
}
let needsMeasurement = false;
function measureLetters(remeasure=true) {
  measurePending=false;
  clearHighlights();
  if(remeasure){
    // Document coordinates do not change on scroll. Cache geometry only after
    // layout changes rather than forcing a full DOM measurement every scroll.
    letters.forEach(letter=>{
      const rect=letter.el.getBoundingClientRect();
      Object.assign(letter,{x:rect.left+rect.width/2,y:rect.top+window.scrollY+rect.height/2,w:rect.width,h:rect.height});
    });
  }
  const top=viewportTop(),bottom=top+viewportHeight();
  visibleLetters=letters.filter(letter=>letter.y+letter.h/2>top-70&&letter.y-letter.h/2<bottom+70);
}
function scheduleMeasure(remeasure=false) {
  needsMeasurement=needsMeasurement||remeasure;
  if(measurePending)return;
  measurePending=true;
  requestAnimationFrame(()=>{const measure=needsMeasurement;needsMeasurement=false;measureLetters(measure);render(0);});
}
function clearHighlights() { activeHighlight.forEach(l=>l.el.classList.remove('lit')); activeHighlight.clear(); }
function addNode(parent, x, y, born = tick) {
  const node = { id:nextId++, x, y, parent:parent?.id??null, children:0, depth:parent?parent.depth+1:0, born, glow:0, links:[] };
  node.root = parent ? parent.root : node;
  nodes.push(node);
  if(parent) {
    const e = { a:parent, b:node, length:dist(parent,node), born, cross:false };
    edges.push(e); parent.links.push(e); node.links.push(e); parent.children++;
  }
  return node;
}
function addCross(a,b) {
  if(a.links.some(e=>e.a===b||e.b===b)) return;
  const e = { a, b, length:dist(a,b), born:tick, cross:true }; edges.push(e); a.links.push(e); b.links.push(e);
}
function grow(target=null, force=false) {
  const max = maxNodes();
  if(nodes.length >= max) return false;
  let parent;
  if(target) parent = nodes.filter(n=>n.children<4).sort((a,b)=>dist(a,target)-dist(b,target))[0];
  else {
    const candidates=nodes.filter(n=>n.children<3 && tick-n.born>.2);
    if(!candidates.length) return false;
    const index=Math.floor(Math.pow(rng(),.65)*candidates.length); parent=candidates[Math.min(index,candidates.length-1)];
  }
  if(!parent) return false;
  const root=parent.root;
  for(let tries=0;tries<20;tries++) {
    let angle;
    if(target && tries<10) angle=Math.round(Math.atan2(target.y-parent.y,target.x-parent.x)/(Math.PI/4))*Math.PI/4 + (tries>3?(rng()>.5?1:-1)*Math.PI/4:0);
    else if(rng()<.7) angle=Math.round(Math.atan2(parent.y-root.y,parent.x-root.x)/(Math.PI/4))*Math.PI/4 + Math.round((rng()-.5)*4)*Math.PI/4;
    else angle=Math.floor(rng()*8)*Math.PI/4;
    const size=(mobile()?31:38)+rng()*(mobile()?38:56);
    const x=parent.x+Math.cos(angle)*size,y=parent.y+Math.sin(angle)*size;
    if(x<18||x>width-18||y<55||y>height-70) continue;
    if(nodes.some(n=>Math.hypot(n.x-x,n.y-y)<(mobile()?25:31))) continue;
    const node=addNode(parent,x,y,force?tick-.8:tick);
    if(target) { node.glow=1; parent.glow=1; }
    if(rng()<.22) {
      const near=nodes.filter(n=>n!==node && n!==parent && dist(n,node)<100 && dist(n,node)>30).sort((a,b)=>dist(a,node)-dist(b,node))[0];
      if(near) addCross(node,near);
    }
    return true;
  }
  return false;
}
function reset(staticDrawing=false) {
  nodes=[];roots=[];edges=[];pulses=[];rings=[];tick=0;birthClock=0;autoClock=0;nextId=1;randomSeed=18364+sequence++*712;
  clearHighlights();
  // The same connected visual language is seeded down the document, not
  // repeated in a viewport overlay. Every point has a stable page coordinate.
  const bands=Math.max(1,Math.ceil(height/750));
  for(let band=0;band<bands;band++){
    const top=band*height/bands;
    const root=addNode(null,width*(mobile()?(band%2?.36:.64):(band%2?.28:.745)),top+(height/bands)*.46,-2);
    roots.push(root); root.glow=1;
    const branches=mobile()?5:7;
    for(let i=0;i<branches;i++){
      const angle=(i/branches)*TAU;
      addNode(root,clamp(root.x+Math.cos(angle)*43,18,width-18),clamp(root.y+Math.sin(angle)*43,55,height-70),-2);
    }
  }
  const attempts=Math.min(maxNodes(),bands*(staticDrawing?50:32));
  for(let i=0;i<attempts;i++){tick+=.15;grow(null,true);}
  tick=0;nodes.forEach(n=>n.born=-10);edges.forEach(e=>e.born=-10);
  render(0,true);if(!paused)start();
}
function resize() {
  const oldWidth=width,oldHeight=height;
  width=document.documentElement.clientWidth;
  // Absolute canvas children do not contribute to this content box, avoiding
  // a scrollHeight feedback loop when fonts or responsive content reflow.
  height=Math.ceil(stage.getBoundingClientRect().height);
  const mainRect=main.getBoundingClientRect();
  contentTop=mainRect.top+window.scrollY;contentBottom=mainRect.bottom+window.scrollY;
  if (width===oldWidth && height===oldHeight) { scheduleMeasure(true); return; }
  // Bound the single document canvas to roughly 24 MB of backing pixels.
  const dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(6000000/(width*height)));
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  if(!oldWidth||Math.abs(oldWidth-width)>80) reset(paused);
  else if(oldWidth!==width||oldHeight!==height){
    nodes.forEach(n=>{n.x*=width/oldWidth;n.y*=height/oldHeight;});
    edges.forEach(e=>e.length=dist(e.a,e.b));
  }
  measureLetters();render(0,true);
}
function launchFrom(node, ttl=5, energy=1, exclude=null) {
  if(!node) return;node.glow=1;
  for(const edge of node.links) {
    const to=edge.a===node?edge.b:edge.a;
    if(to===exclude)continue;
    if(pulses.length>95)break;
    pulses.push({edge,from:node,to,progress:0,ttl,energy,visited:new Set([node.id])});
  }
}
function sendPulse(target=null, broad=false) {
  if(paused || !nodes.length) return;
  const point=target||{x:width*.6,y:viewportTop()+viewportHeight()*.45};
  const origin=nodes.reduce((best,n)=>dist(n,point)<dist(best,point)?n:best,nodes[0]);
  launchFrom(origin,broad?10:6,1); rings.push({x:origin.x,y:origin.y,age:0});
  if(broad) {
    // A second branch carries the stronger pulse through the visible reading area.
    const textTarget=visibleLetters.length?visibleLetters[Math.floor(rng()*visibleLetters.length)]:{x:width*.25,y:viewportTop()+viewportHeight()*.40};
    const close=nodes.reduce((best,n)=>dist(n,textTarget)<dist(best,textTarget)?n:best,nodes[0]);
    launchFrom(close,6,.95);
  }
}
function stimulate(x,y,isClick=false) {
  if(paused||reduced)return;
  const target={x,y};
  const now=performance.now();
  if(isClick||now-lastStimulus>150){grow(target);if(isClick)grow(target);lastStimulus=now;}
  nodes.forEach(n=>{const d=dist(n,target);if(d<120)n.glow=Math.max(n.glow,1-d/120);});
  if(isClick||now-lastPointerPulse>650){sendPulse(target);lastPointerPulse=now;}
}
function update(dt) {
  tick+=dt;birthClock+=dt;autoClock+=dt;letterClock+=dt;
  const rate=nodes.length<45?.075:nodes.length<100?.15:.43;
  if(birthClock>rate){birthClock=0;const towardCopy=nodes.length<100&&rng()<.55;grow(towardCopy?{x:width*(.08+rng()*.32),y:viewportTop()+viewportHeight()*(.18+rng()*.52)}:null);}
  if(autoClock>3.2){autoClock=0;sendPulse(null,true);}
  nodes.forEach(n=>n.glow=Math.max(0,n.glow-dt*.8));
  const next=[];
  for(const p of pulses){
    p.progress+=dt*(mobile()?155:195)/Math.max(1,p.edge.length);
    if(p.progress<1){next.push(p);continue;}
    p.to.glow=Math.max(p.to.glow,p.energy);
    if(p.ttl>0 && next.length<95) {
      let count=0;
      for(const e of p.to.links){
        const to=e.a===p.to?e.b:e.a;
        if(to===p.from||p.visited.has(to.id))continue;
        if(count++>2)break;
        const visited=new Set(p.visited);visited.add(p.to.id);
        next.push({edge:e,from:p.to,to,progress:0,ttl:p.ttl-1,energy:p.energy*.85,visited});
      }
    }
  }
  pulses=next.slice(0,110);
  rings=rings.filter(r=>(r.age+=dt)<1.5);
  if(letterClock>.055){letterClock=0;updateLetters();}
}
function updateLetters() {
  if(paused||reduced)return;
  const now=performance.now();
  const points=pulses.map(p=>({x:p.from.x+(p.to.x-p.from.x)*p.progress,y:p.from.y+(p.to.y-p.from.y)*p.progress}));
  for(const l of visibleLetters){
    let lit=false;
    for(const p of points){if(Math.abs(p.x-l.x)<l.w/2+18&&Math.abs(p.y-l.y)<l.h/2+10){lit=true;break;}}
    if(pointer.inside && Math.hypot(l.x-pointer.x,l.y-pointer.y)<70)lit=true;
    if(lit){l.until=now+390;if(!activeHighlight.has(l)){l.el.classList.add('lit');activeHighlight.add(l);}}
    else if(activeHighlight.has(l)&&l.until<now){l.el.classList.remove('lit');activeHighlight.delete(l);}
  }
}
function pathEdge(e,portion=1) {
  ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.lineTo(e.a.x+(e.b.x-e.a.x)*portion,e.a.y+(e.b.y-e.a.y)*portion);
}
function render(dt,full=false) {
  if(!nodes.length)return;
  const top=Math.max(contentTop,full?0:Math.max(0,viewportTop()-160));
  const bottom=Math.min(contentBottom,full?height:Math.min(height,viewportTop()+viewportHeight()+160));
  if(bottom<=top)return;
  // Paint only the visible document slice. Scrolling moves the canvas itself;
  // it never translates or repositions the graph relative to the content.
  ctx.save();ctx.beginPath();ctx.rect(0,top,width,bottom-top);ctx.clip();
  ctx.clearRect(0,top,width,bottom-top);
  for(const root of roots){
    const radius=mobile()?250:430;
    if(root.y+radius<top||root.y-radius>bottom)continue;
    const ambient=ctx.createRadialGradient(root.x,root.y,0,root.x,root.y,radius);
    ambient.addColorStop(0,'rgba(32,106,182,.12)');ambient.addColorStop(1,'rgba(20,70,130,0)');ctx.fillStyle=ambient;ctx.fillRect(0,top,width,bottom-top);
  }
  // Registration marks and distant coordinates keep the drawing architectural, not a particle field.
  ctx.strokeStyle='rgba(95,140,186,.12)';ctx.lineWidth=.7;
  for(let x=28;x<width;x+=128)for(let y=58+Math.max(0,Math.floor((top-58)/128))*128;y<bottom;y+=128){ctx.beginPath();ctx.moveTo(x-2,y);ctx.lineTo(x+2,y);ctx.moveTo(x,y-2);ctx.lineTo(x,y+2);ctx.stroke();}
  for(const e of edges){
    if(Math.max(e.a.y,e.b.y)<top||Math.min(e.a.y,e.b.y)>bottom)continue;
    const progress=clamp((tick-e.born)/.7,0,1);if(progress<=0)continue;
    const mid={x:(e.a.x+e.b.x)/2,y:(e.a.y+e.b.y)/2};
    const proximity=pointer.inside?Math.max(0,1-dist(mid,pointer)/170):0;
    const energy=Math.max(e.a.glow,e.b.glow);
    const base=e.cross?.12:.21;
    ctx.strokeStyle=`rgba(67,143,215,${base+proximity*.52+energy*.22})`;ctx.lineWidth=.65+proximity*.65;pathEdge(e,progress);ctx.stroke();
    if(progress<1){ctx.fillStyle='#82c9ff';ctx.beginPath();ctx.arc(e.a.x+(e.b.x-e.a.x)*progress,e.a.y+(e.b.y-e.a.y)*progress,1.7,0,TAU);ctx.fill();}
  }
  for(const p of pulses){
    if(Math.max(p.from.y,p.to.y)<top||Math.min(p.from.y,p.to.y)>bottom)continue;
    const x=p.from.x+(p.to.x-p.from.x)*p.progress,y=p.from.y+(p.to.y-p.from.y)*p.progress;
    const tail=Math.max(0,p.progress-.30);
    const gradient=ctx.createLinearGradient(p.from.x+(p.to.x-p.from.x)*tail,p.from.y+(p.to.y-p.from.y)*tail,x+.01,y+.01);
    gradient.addColorStop(0,'rgba(64,158,255,0)');gradient.addColorStop(1,`rgba(116,202,255,${p.energy})`);
    ctx.strokeStyle=gradient;ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(p.from.x+(p.to.x-p.from.x)*tail,p.from.y+(p.to.y-p.from.y)*tail);ctx.lineTo(x,y);ctx.stroke();
    ctx.shadowBlur=9;ctx.shadowColor='#389bff';ctx.fillStyle=`rgba(177,224,255,${p.energy})`;ctx.beginPath();ctx.arc(x,y,1.7,0,TAU);ctx.fill();ctx.shadowBlur=0;
  }
  for(const n of nodes){
    if(tick<n.born||n.y<top-10||n.y>bottom+10)continue;
    const near=pointer.inside?Math.max(0,1-dist(n,pointer)/130):0;
    const glow=Math.max(n.glow,near);
    ctx.fillStyle=`rgba(${glow>.4?'134,204,255':'75,141,202'},${.42+glow*.58})`;ctx.beginPath();ctx.arc(n.x,n.y,n.id===1?3:1.3+glow*1.2,0,TAU);ctx.fill();
    if(glow>.08){ctx.strokeStyle=`rgba(65,160,255,${glow*.45})`;ctx.lineWidth=.6;ctx.beginPath();ctx.arc(n.x,n.y,5+glow*3,0,TAU);ctx.stroke();}
  }
  // Nuclei remain stable anchors attached to their places in the document.
  for(const root of roots){
  if(root.y<top-22||root.y>bottom+22)continue;
  ctx.strokeStyle='rgba(75,163,255,.55)';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(root.x,root.y,13,0,TAU);ctx.stroke();
  ctx.strokeStyle='rgba(73,155,240,.18)';ctx.beginPath();ctx.arc(root.x,root.y,22,0,TAU);ctx.stroke();
  }
  for(const r of rings){ctx.strokeStyle=`rgba(68,164,255,${(1-r.age/1.5)*.35})`;ctx.lineWidth=.6;ctx.beginPath();ctx.arc(r.x,r.y,12+r.age*72,0,TAU);ctx.stroke();}
  if(pointer.inside&&!paused){ctx.strokeStyle='rgba(90,177,255,.22)';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(pointer.x,pointer.y,18,0,TAU);ctx.stroke();ctx.fillStyle='rgba(140,210,255,.7)';ctx.fillRect(pointer.x-1,pointer.y-1,2,2);}
  ctx.restore();
}
// Stop the actual frame loop while paused or hidden. Keep work at 30 fps,
// sufficient for the deliberate network movement and lighter on mobile devices.
function frame(time) {
  if(paused || document.hidden){stop();return;}
  if (!lastTime || time-lastTime >= 1000/30) {
    const dt=Math.min((time-(lastTime||time))/1000,.05);
    lastTime=time;
    if (pointerPending) { stimulate(pointer.x,pointer.y); pointerPending=false; }
    update(dt);render(dt);
  }
  rafId=requestAnimationFrame(frame);
}
function stop(){cancelAnimationFrame(rafId);rafId=0;running=false;lastTime=0;}
function start(){if(running||paused||document.hidden)return;running=true;lastTime=0;rafId=requestAnimationFrame(frame);}
function setMotion(){
  paused=reduced||userPaused||easyRead;
  document.body.classList.toggle('motion-paused',paused);
  if(paused){stop();clearHighlights();pulses=[];rings=[];pointer.inside=false;pointerPending=false;render(0,true);}else start();
}
splitLetters();
resize();
setMotion();
if(document.fonts)document.fonts.ready.then(()=>scheduleMeasure(true));
window.addEventListener('resize',resize,{passive:true});
window.addEventListener('scroll',()=>{pointer.inside=false;scheduleMeasure();},{passive:true});
new ResizeObserver(resize).observe(document.body);
document.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch'||paused||event.target.closest('button'))return;
  pointer={x:event.clientX,y:event.clientY+window.scrollY,inside:true};pointerPending=true;
},{passive:true});
document.addEventListener('pointerout',event=>{if(!event.relatedTarget)pointer.inside=false;},{passive:true});
document.addEventListener('pointerdown',event=>{
  if(paused||event.target.closest('a,button,input,select,textarea'))return;
  stimulate(event.clientX,event.clientY+window.scrollY,true);
},{passive:true});
if(accessibility){
  window.addEventListener('zeroth:accessibilitychange',event=>{
    const state=event.detail;
    const newlyReduced=!reduced&&state.reducedMotion;
    userPaused=state.stopAnimation;reduced=state.reducedMotion;easyRead=state.easyRead;
    setMotion();if(newlyReduced)reset(true);
    resize();scheduleMeasure(true);
  });
}else motionQuery.addEventListener('change',event=>{
  reduced=event.matches;setMotion();if(reduced)reset(true);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
window.addEventListener('pagehide',stop);
window.addEventListener('pageshow',start);
})();
