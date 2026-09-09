const header=document.querySelector('.site-header');const menu=document.querySelector('.menu');const nav=document.querySelector('.nav');window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>30));menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Cinematic hero movement: slow orbit + subtle mouse and scroll parallax.
const hero=document.querySelector('.hero');
const heroStage=document.querySelector('.hero-image-stage');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(hero&&heroStage&&!reducedMotion){
  let targetX=0,targetY=0,currentX=0,currentY=0;
  let rafId=null;

  const renderHeroParallax=()=>{
    currentX+=(targetX-currentX)*0.055;
    currentY+=(targetY-currentY)*0.055;
    heroStage.style.setProperty('--hero-x',`${currentX.toFixed(2)}px`);
    heroStage.style.setProperty('--hero-y',`${currentY.toFixed(2)}px`);
    rafId=requestAnimationFrame(renderHeroParallax);
  };

  hero.addEventListener('pointermove',e=>{
    const r=hero.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    targetX=x*-18;
    targetY=y*-10;
  });

  hero.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});

  const updateHeroScroll=()=>{
    const amount=Math.min(Math.max(window.scrollY,0),hero.offsetHeight)*0.055;
    heroStage.style.setProperty('--hero-scroll',`${amount.toFixed(2)}px`);
  };
  window.addEventListener('scroll',updateHeroScroll,{passive:true});
  updateHeroScroll();
  rafId=requestAnimationFrame(renderHeroParallax);
}
