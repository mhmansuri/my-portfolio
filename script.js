/* ---------- Content: edit this block to make the site yours ---------- */
const SKILLS = {
  "Front end": ["TypeScript","React","CSS","Accessibility"],
  "Back end":  ["Node.js","PostgreSQL","GraphQL"],
  "Craft":     ["Design systems","Prototyping","Testing"]
};
const PROJECTS = [
  {name:"Tidal", year:2025, desc:"A shared budgeting app for households, with real-time sync and a weekly summary. Used by 12,000 people.", skills:["TypeScript","React","Node.js","PostgreSQL"]},
  {name:"Atlas Design System", year:2024, desc:"A documented component library adopted by five product teams, cutting UI build time by about a third.", skills:["React","CSS","Accessibility","Design systems","Testing"]},
  {name:"Fieldnotes", year:2023, desc:"An offline-first notes app for researchers working in the field, with photo capture and automatic sync.", skills:["TypeScript","GraphQL","PostgreSQL","Prototyping"]},
  {name:"Paperplane", year:2022, desc:"A lightweight newsletter tool for independent writers, built from a one-week prototype into a paid product.", skills:["Node.js","CSS","Prototyping"]}
];

/* ---------- Hero: letters get heavier near the pointer ---------- */
const nameEl = document.getElementById("name");
const letters = [];
["Mohammad","Mansuri"].forEach(word=>{
  const line = document.createElement("span"); line.className="line"; line.setAttribute("aria-hidden","true");
  [...word].forEach(ch=>{const s=document.createElement("span");s.textContent=ch;line.appendChild(s);letters.push(s)});
  nameEl.appendChild(line);
});
function weigh(x,y){
  for(const l of letters){
    const r=l.getBoundingClientRect();
    const d=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));
    const w=Math.max(200,Math.min(800,800-d*2.2));  
    l.style.setProperty("--w",Math.round(w));
  }
}
addEventListener("pointermove",e=>weigh(e.clientX,e.clientY),{passive:true});
addEventListener("pointerleave",()=>letters.forEach(l=>l.style.setProperty("--w",300)));
/* intro sweep: one orchestrated moment on load */
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
  letters.forEach((l,i)=>setTimeout(()=>{l.style.setProperty("--w",800);setTimeout(()=>l.style.setProperty("--w",300),260)},i*90));
}

/* ---------- Skills + projects ---------- */
let active=null;
const groups=document.getElementById("skillGroups"), list=document.getElementById("projectList"), status=document.getElementById("status");

for(const [group,items] of Object.entries(SKILLS)){
  const box=document.createElement("div");
  box.innerHTML=`<h3>${group}</h3><div class="chips"></div>`;
  items.forEach(s=>{
    const b=document.createElement("button");
    b.className="chip"; b.type="button"; b.textContent=s; b.setAttribute("aria-pressed","false");
    b.addEventListener("click",()=>{active=active===s?null:s;applyFilter()});
    box.lastElementChild.appendChild(b);
  });
  groups.appendChild(box);
}

PROJECTS.forEach((p,i)=>{
  const el=document.createElement("article"); el.className="proj"; el.dataset.i=i;
  el.innerHTML=`<button type="button" aria-expanded="false" aria-controls="d${i}">
      <span><h3>${p.name}</h3><span class="yr">${p.year}</span></span><span class="plus" aria-hidden="true"></span></button>
    <div class="detail" id="d${i}"><div><div class="in"><p>${p.desc}</p>
      <ul class="tags" aria-label="Skills used">${p.skills.map(s=>`<li data-s="${s}">${s}</li>`).join("")}</ul></div></div></div>`;
  el.querySelector("button").addEventListener("click",e=>{
    const open=el.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded",open);
  });
  list.appendChild(el);
});

function applyFilter(){
  document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",c.textContent===active));
  let n=0;
  document.querySelectorAll(".proj").forEach(el=>{
    const p=PROJECTS[el.dataset.i], hit=!active||p.skills.includes(active);
    el.classList.toggle("dim",!hit); if(hit&&active)n++;
    el.querySelectorAll(".tags li").forEach(t=>t.classList.toggle("hit",t.dataset.s===active));
  });
  status.textContent=active?`${n} of ${PROJECTS.length} projects use ${active}.`:"";
}

/* ---------- Contact form (opens the visitor's email app) ---------- */
document.getElementById("form").addEventListener("submit",e=>{
  e.preventDefault();
  const f=new FormData(e.target);
  const body=`${f.get("msg")}\n\n— ${f.get("name")} (${f.get("email")})`;
  location.href=`mailto:hello@mohammadhusainmansuri.dev?subject=${encodeURIComponent("Portfolio enquiry from "+f.get("name"))}&body=${encodeURIComponent(body)}`;
  document.getElementById("formNote").textContent="Opening your email app to send the message.";
});

/* ---------- Theme + footer ---------- */
const root=document.documentElement;
document.getElementById("theme").addEventListener("click",()=>{
  const dark=root.dataset.theme?root.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme=dark?"light":"dark";
});
document.getElementById("yr").textContent=new Date().getFullYear();
