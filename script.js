document.addEventListener('DOMContentLoaded', function(){
  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // Header scroll shadow
  const header = document.getElementById('site-header');
  const onScroll = ()=>{
    const sc = window.scrollY;
    if(sc>20) header.classList.add('scrolled'); else header.classList.remove('scrolled');

    // Hero parallax and fade
    const hero = document.querySelector('.hero-new');
    if(hero){
      const t = Math.min(sc / (window.innerHeight || 800), 1);
      const left = hero.querySelector('.hero-left');
      const world = hero.querySelector('.hero-layer.worldmap img');
      if(left) left.style.opacity = String(1 - t*0.9);
      if(world) world.style.transform = `translateY(${t*30}px) translateX(-6%)`;
    }
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Ripple effect for buttons
  function createRipple(e){
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const r = document.createElement('span');
    const size = Math.max(rect.width, rect.height)*1.2;
    r.style.width = r.style.height = size+'px';
    r.style.left = (e.clientX - rect.left - size/2)+'px';
    r.style.top = (e.clientY - rect.top - size/2)+'px';
    r.className = 'ripple-ef';
    btn.appendChild(r);
    setTimeout(()=>{r.remove()},700);
  }
  document.querySelectorAll('.ripple').forEach(b=>b.addEventListener('click', createRipple));

  // Simple particles using canvas
  (function initParticles(){
    const container = document.getElementById('hero-particles');
    if(!container) return;
    const canvas = document.createElement('canvas');
    canvas.style.width='100%';canvas.style.height='100%';canvas.width = container.clientWidth;canvas.height=container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w=canvas.width,h=canvas.height;window.addEventListener('resize',()=>{w=canvas.width=container.clientWidth;h=canvas.height=container.clientHeight});
    const particles = Array.from({length:40}).map(()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2+0.6,dx:(Math.random()-0.5)*0.3,dy:(Math.random()-0.5)*0.6,alpha:Math.random()*0.8+0.2}));
    function draw(){ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.x+=p.dx;p.y+=p.dy; if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;ctx.beginPath();ctx.fillStyle=`rgba(255,255,255,${p.alpha})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});requestAnimationFrame(draw)}
    draw();
  })();

  // Accordion
  document.querySelectorAll('.accordion .accordion-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.nextElementSibling;
      const open = panel.style.display === 'block';
      document.querySelectorAll('.accordion .panel').forEach(p=>p.style.display='none');
      document.querySelectorAll('.accordion .accordion-item .chev').forEach(c=>c.textContent='+');
      if(!open){
        panel.style.display='block';
        btn.querySelector('.chev').textContent='-';
      }
    });
  });

  // Tracking demo
  document.getElementById('track-btn').addEventListener('click', ()=>{
    const val = document.getElementById('track-input').value.trim();
    const out = document.getElementById('track-result');
    if(!val){out.textContent='Please enter a tracking number.';return}
    out.innerHTML = '<strong>Tracking:</strong> '+val+'<br><em>Checking status...</em>';
    setTimeout(()=>{
      out.innerHTML = '<strong>Status:</strong> In Transit<br><small>Left origin facility — expected delivery in 3-5 business days.</small>';
    },1200);
  });

  // Simple form handlers (demo only)
  const demoHandler = (formId)=>{
    const f = document.getElementById(formId);
    if(!f) return;
    f.addEventListener('submit', function(e){
      e.preventDefault();
      const btn = f.querySelector('button[type="submit"]');
      if(btn){btn.disabled=true; btn.dataset.orig = btn.dataset.orig || btn.textContent; btn.textContent='Sending...';}
      setTimeout(()=>{if(btn){btn.disabled=false;btn.textContent='Submitted'};alert('Form submitted (demo). Our team will contact you.');f.reset()},800);
    });
  };
  // attach to forms
  demoHandler('rate-form');
  demoHandler('book-form');

  // Animated counters (if added later)
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(c=>{
    const end = +c.getAttribute('data-counter');
    let cur=0;const step=Math.ceil(end/60);
    const id=setInterval(()=>{cur+=step; if(cur>=end){c.textContent=end;clearInterval(id)}else c.textContent=cur},30);
  });
});
