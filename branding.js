(() => {
  'use strict';
  const anchor=document.querySelector('.hero-logo-anchor');
  const headerLogo=document.querySelector('.home-page .site-header .wordmark');
  if(!anchor||!headerLogo)return;
  const heroImage=anchor.querySelector('img');
  const bridge=document.createElement('div');
  bridge.className='brand-bridge';bridge.setAttribute('aria-hidden','true');
  bridge.append(heroImage.cloneNode(true));document.body.append(bridge);
  let frame=0;
  function update(){
    frame=0;
    const source=anchor.getBoundingClientRect();
    const target=headerLogo.querySelector('img').getBoundingClientRect();
    // A single wordmark follows its actual document position until it reaches
    // the same glyph position in the sticky header. No animated catch-up.
    const docked=source.top<=target.top+.5;
    document.body.classList.toggle('brand-docked',docked);
    headerLogo.setAttribute('aria-hidden',String(!docked));
    headerLogo.tabIndex=docked?0:-1;
    bridge.hidden=docked;
    if(!docked){bridge.style.left=source.left+'px';bridge.style.top=source.top+'px';bridge.style.width=source.width+'px';}
    document.body.classList.add('brand-ready');
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('zeroth:accessibilitychange',schedule);
  new ResizeObserver(schedule).observe(document.body);
  if(document.fonts)document.fonts.ready.then(schedule);
  heroImage.addEventListener('load',schedule);
  update();
})();
