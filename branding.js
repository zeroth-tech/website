(() => {
  'use strict';
  const anchor=document.querySelector('.hero-logo-anchor');
  const header=document.querySelector('.home-page .site-header');
  const headerLogo=header&&header.querySelector('.wordmark');
  if(!anchor||!headerLogo)return;
  const heroImage=anchor.querySelector('img');
  const headerImage=headerLogo.querySelector('img');

  // The travelling wordmark lives in a full-document track and is position:sticky,
  // so the browser itself scrolls it with the page and pins it at the header
  // position. Script only measures where it starts and where it pins (on load,
  // resize and layout changes) and swaps in the header logo once it has docked.
  // It never moves the wordmark per scroll frame, which is what caused the
  // jitter on phones (scrolling runs ahead of scroll events there).
  const track=document.createElement('div');
  track.className='brand-track';track.setAttribute('aria-hidden','true');
  const bridge=document.createElement('div');
  bridge.className='brand-bridge';
  bridge.append(heroImage.cloneNode(true));track.append(bridge);document.body.append(track);

  let frame=0,last='';
  function update(){
    frame=0;
    const origin=track.getBoundingClientRect();
    const source=anchor.getBoundingClientRect();
    // Where the header logo sits inside the sticky header = where the wordmark pins.
    const pinTop=headerImage.getBoundingClientRect().top-header.getBoundingClientRect().top;
    const startTop=source.top-origin.top,startLeft=source.left-origin.left;
    const next=[startTop,startLeft,source.width,pinTop].map(n=>n.toFixed(2)).join('|');
    if(next!==last){
      last=next;
      bridge.style.marginTop=startTop+'px';
      bridge.style.marginLeft=startLeft+'px';
      bridge.style.width=source.width+'px';
      bridge.style.top=pinTop+'px';
    }
    const docked=source.top<=pinTop+.5;
    document.body.classList.toggle('brand-docked',docked);
    headerLogo.setAttribute('aria-hidden',String(!docked));
    headerLogo.tabIndex=docked?0:-1;
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
