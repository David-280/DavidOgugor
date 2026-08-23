const body=document.body;
const header=document.querySelector('.site-header');
const progress=document.querySelector('.scroll-progress span');
const themeToggle=document.querySelector('.theme-toggle');
const menuToggle=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');

function updateScroll(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  header.classList.toggle('scrolled',window.scrollY>30);
}
window.addEventListener('scroll',updateScroll,{passive:true}); updateScroll();

const savedTheme=localStorage.getItem('david-theme');
if(savedTheme) body.dataset.theme=savedTheme;
themeToggle?.addEventListener('click',()=>{
  const next=body.dataset.theme==='light'?'dark':'light';
  if(next==='light') body.dataset.theme='light'; else delete body.dataset.theme;
  localStorage.setItem('david-theme',next);
});

menuToggle?.addEventListener('click',()=>{
  const open=navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',open);
});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

const observer=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      entry.target.style.transitionDelay=(i%5)*45+'ms';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.filter').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    button.classList.add('active');
    const filter=button.dataset.filter;
    document.querySelectorAll('.project').forEach(project=>{
      const show=filter==='all'||project.dataset.category===filter;
      project.classList.toggle('hidden',!show);
    });
  });
});

const modal=document.getElementById('project-modal');
const modalTitle=document.getElementById('modal-title');
const modalType=document.getElementById('modal-type');
const modalDescription=document.getElementById('modal-description');
const modalOverview=document.getElementById('modal-overview');
const modalTools=document.getElementById('modal-tools');
const modalLink=document.getElementById('modal-link');

function openProject(project){
  modalTitle.textContent=project.dataset.title;
  // modalType.textContent=project.dataset.type+' / SELF-INITIATED';
  modalDescription.textContent=project.dataset.description;
  modalOverview.textContent=project.dataset.outcome||'A Web project created to solve problems and increase brand reach.';
  modalTools.textContent=project.dataset.tools;
  const link=project.dataset.link;
  modalLink.href=link||'#';
  modalLink.style.display=link&&link!=='#'?'inline-flex':'none';
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); body.classList.add('modal-open');
}
document.querySelectorAll('.project').forEach(project=>{
  project.addEventListener('click',e=>{
    if(e.target.closest('button')) return;
    openProject(project);
  });
  project.querySelector('.project-open')?.addEventListener('click',()=>openProject(project));
});
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>{
  modal.classList.remove('open');modal.setAttribute('aria-hidden','true');body.classList.remove('modal-open');
}));

document.querySelectorAll('.process-item').forEach(item=>{
  item.addEventListener('click',()=>{
    document.querySelectorAll('.process-item').forEach(x=>x.classList.remove('active'));
    item.classList.add('active');
  });
});

const lightbox=document.getElementById('lightbox');
document.querySelectorAll('.gallery-item').forEach(item=>{
  item.addEventListener('click',()=>{
    const path=item.dataset.image;
    const holder=lightbox.querySelector('.lightbox-placeholder');
    holder.innerHTML='';
    if(path){
      const img=document.createElement('img');img.src=path;img.alt='Graphic design project';img.style.cssText='width:100%;height:100%;object-fit:contain;background:#11120F';holder.appendChild(img);
    }else{
      holder.innerHTML='<span>YOUR DESIGN</span><small>Add an image path to this gallery item in index.html.</small>';
    }
    lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');
  });
});
document.querySelector('[data-lightbox-close]')?.addEventListener('click',()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true')});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    modal.classList.remove('open');lightbox.classList.remove('open');body.classList.remove('modal-open');
  }
});

const cursor=document.querySelector('.cursor');
if(cursor && matchMedia('(pointer:fine)').matches){
  window.addEventListener('pointermove',e=>{
    cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';
  });
  document.querySelectorAll('a,button,.project,.gallery-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      cursor.classList.add('active');
      if(el.classList.contains('project')||el.classList.contains('gallery-item')) cursor.querySelector('span').textContent='VIEW';
      else cursor.querySelector('span').textContent='';
    });
    el.addEventListener('mouseleave',()=>cursor.classList.remove('active'));
  });
}

document.querySelectorAll('.magnetic').forEach(el=>{
  if(!matchMedia('(pointer:fine)').matches) return;
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.12}px,${y*.12}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

document.querySelectorAll('.hero-portrait-wrap').forEach(el=>{
  if(!matchMedia('(pointer:fine)').matches) return;
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    const frame=el.querySelector('.portrait-frame');
    frame.style.transform=`rotate(4deg) translate(${x*10}px,${y*10}px)`;
  });
  el.addEventListener('pointerleave',()=>el.querySelector('.portrait-frame').style.transform='rotate(4deg)');
});
