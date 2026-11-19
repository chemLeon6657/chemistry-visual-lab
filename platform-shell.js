/* 小肥鱼助教 + 全局模块入口 */
(function () {
  "use strict";
  if (window.__pfShellMounted) return;
  if (new URLSearchParams(location.search).get("embed") === "1") return;
  window.__pfShellMounted = true;

  const modules = [
    ["index.html", "平台首页", "00"],
    ["electron-cloud.html", "电子云杂化", "01"],
    ["molecular-geometry.html", "分子空间构型", "02"],
    ["crystal-structure.html", "晶体结构", "03"],
    ["reaction-mechanism.html", "反应机理", "04"],
    ["periodic-table.html", "元素周期表", "05"],
    ["experiment-apparatus.html", "化学实验装置", "06"],
    ["reaction-gallery.html", "反应观察台", "07"],
    ["organic-groups.html", "有机官能团", "08"],
    ["bond-formation.html", "C–C 成键", "↗"]
  ];

  const tips = {
    "electron-cloud.html": "先拖滑杆看杂化，再继续看两个碳原子成键。",
    "molecular-geometry.html": "先数孤对电子，再判断空间构型。",
    "crystal-structure.html": "先找晶胞，再数一个微粒周围的最近邻。",
    "reaction-mechanism.html": "盯住断键和成键的位置，再看能量曲线。",
    "periodic-table.html": "先选一个性质，再看整张表的变化趋势。",
    "experiment-apparatus.html": "先想气体性质，再决定除杂、干燥和收集。",
    "reaction-gallery.html": "先看价态变化，再看颜色、气体和沉淀。",
    "organic-groups.html": "官能团决定性质，碳骨架决定同分异构。",
    "bond-formation.html": "成键时注意 σ 键和 π 键的方向。",
    "index.html": "不知道从哪开始？点“元素周期表”，我带你从位置找规律。"
  };

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const active = path || "index.html";
  const tip = tips[active] || "点开一个模块，我陪你一起看现象、找规律。";

  const style = document.createElement("style");
  style.textContent = `
    .pf-fish-button{position:fixed;right:18px;bottom:18px;z-index:9000;width:58px;height:58px;border:1px solid rgba(103,232,249,.35);border-radius:50%;background:radial-gradient(circle at 35% 25%,rgba(103,232,249,.26),rgba(7,18,32,.96) 62%);box-shadow:0 14px 34px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.04) inset,0 0 26px rgba(34,211,238,.12);cursor:pointer;display:grid;place-items:center;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;padding:0}
    .pf-fish-button:hover{transform:translateY(-2px) scale(1.03);border-color:rgba(103,232,249,.65);box-shadow:0 18px 40px rgba(0,0,0,.45),0 0 34px rgba(34,211,238,.2)}
    .pf-fish-button svg{width:46px;height:42px;display:block;filter:drop-shadow(0 3px 8px rgba(0,0,0,.3))}
    .pf-panel{position:fixed;right:18px;bottom:86px;z-index:9001;width:310px;max-height:calc(100vh - 110px);overflow:auto;border:1px solid rgba(103,232,249,.2);border-radius:17px;background:linear-gradient(160deg,rgba(9,24,40,.97),rgba(5,13,25,.98));box-shadow:0 26px 70px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06);padding:13px;opacity:0;transform:translateY(8px) scale(.98);pointer-events:none;transition:opacity .2s ease,transform .2s ease;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
    .pf-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
    .pf-panel-head{display:flex;align-items:center;gap:9px;padding:2px 2px 10px;border-bottom:1px solid rgba(148,163,184,.1)}
    .pf-panel-head svg{width:42px;height:37px;flex:0 0 auto}
    .pf-panel-head h3{margin:0;color:#efffff;font-size:13px;font-weight:650;line-height:1.2}
    .pf-panel-head p{margin:3px 0 0;color:#7f95ad;font-size:9px;line-height:1.35}
    .pf-close{margin-left:auto;width:24px;height:24px;border:1px solid rgba(148,163,184,.14);border-radius:7px;background:rgba(4,10,20,.5);color:#8ea4c0;font-size:15px;line-height:1;cursor:pointer;padding:0}
    .pf-close:hover{color:#fff;border-color:rgba(103,232,249,.35)}
    .pf-tip{margin:10px 1px 10px;padding:8px 9px;border:1px solid rgba(103,232,249,.12);border-radius:8px;background:rgba(103,232,249,.04);color:#9fb8ce;font-size:9.5px;line-height:1.55}
    .pf-tip strong{color:#bdfbf1;font-weight:550}
    .pf-modules{display:grid;grid-template-columns:1fr 1fr;gap:5px}
    .pf-module{display:flex;align-items:center;gap:6px;min-height:30px;padding:0 7px;border:1px solid rgba(148,163,184,.1);border-radius:7px;background:rgba(4,10,20,.4);color:#a9c1d8;font-size:9px;text-decoration:none;transition:.16s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pf-module:hover{color:#efffff;border-color:rgba(103,232,249,.32);background:rgba(103,232,249,.07)}
    .pf-module.active{color:#eaffff;border-color:rgba(103,232,249,.38);background:rgba(103,232,249,.1)}
    .pf-module .n{font-family:"Cascadia Code",Consolas,monospace;font-size:7px;color:rgba(103,232,249,.55);flex:0 0 auto}
    .pf-panel-foot{margin-top:9px;padding-top:8px;border-top:1px solid rgba(148,163,184,.08);color:#5e728c;font-size:8px;text-align:right;letter-spacing:.04em}
    @media (max-width: 640px){
      .pf-fish-button{right:12px;bottom:12px;width:50px;height:50px}
      .pf-fish-button svg{width:40px;height:36px}
      .pf-panel{right:10px;left:10px;bottom:72px;width:auto;max-height:calc(100vh - 96px)}
      .pf-modules{grid-template-columns:1fr 1fr}
    }
  `;
  document.head.appendChild(style);

  const fish = `<svg viewBox="0 0 220 170" fill="none" aria-hidden="true"><defs><linearGradient id="pfFishBody" x1="45" y1="35" x2="160" y2="145" gradientUnits="userSpaceOnUse"><stop stop-color="#5eead4"/><stop offset=".55" stop-color="#67e8f9"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs><path d="M27 87 1 58l10 29-10 29 26-21" fill="rgba(94,234,212,.28)" stroke="#5eead4" stroke-width="2"/><path d="M80 49c-12-18-26-23-39-16 8 15 17 24 31 30" fill="rgba(103,232,249,.24)" stroke="#67e8f9" stroke-width="2"/><ellipse cx="111" cy="87" rx="72" ry="51" fill="url(#pfFishBody)" stroke="rgba(234,255,255,.55)" stroke-width="1.6"/><path d="M135 127c-15 16-31 21-48 18 12-12 25-21 42-25" fill="rgba(94,234,212,.25)" stroke="#5eead4" stroke-width="2"/><path d="M94 62c12-9 33-9 46-2" stroke="rgba(4,10,20,.7)" stroke-width="4" stroke-linecap="round"/><circle cx="111" cy="61" r="15" fill="rgba(4,16,28,.86)" stroke="#dffcff" stroke-width="2"/><circle cx="146" cy="67" r="12" fill="rgba(4,16,28,.86)" stroke="#dffcff" stroke-width="2"/><path d="M126 61h8" stroke="#dffcff" stroke-width="2"/><circle cx="115" cy="58" r="3.2" fill="#f4ffff"/><circle cx="149" cy="64" r="2.8" fill="#f4ffff"/><circle cx="116" cy="59" r="1.2" fill="#04101c"/><circle cx="149" cy="65" r="1.1" fill="#04101c"/><path d="M137 93c4-4 10-3 13 1" stroke="#04101c" stroke-width="2.4" stroke-linecap="round"/><circle cx="158" cy="103" r="6" fill="#f9a8d4" opacity=".55"/><path d="M181 43c7-7 15-8 22-3" stroke="rgba(103,232,249,.5)" stroke-width="2" stroke-linecap="round"/><circle cx="190" cy="35" r="3" fill="rgba(103,232,249,.35)"/><circle cx="202" cy="27" r="2" fill="rgba(103,232,249,.28)"/></svg>`;

  const button = document.createElement("button");
  button.className = "pf-fish-button";
  button.type = "button";
  button.setAttribute("aria-label", "打开小肥鱼助教和模块菜单");
  button.innerHTML = fish;

  const panel = document.createElement("div");
  panel.className = "pf-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "小肥鱼助教");
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `<div class="pf-panel-head">${fish}<div><h3>小肥鱼助教</h3><p>模块导航 · 课堂提示</p></div><button class="pf-close" type="button" aria-label="关闭">×</button></div>
    <div class="pf-tip"><strong>小肥鱼：</strong>${tip}</div>
    <div class="pf-modules">${modules.map(([href,label,n])=>`<a class="pf-module ${href===active?"active":""}" href="${href}"><span class="n">${n}</span>${label}</a>`).join("")}</div>
    <div class="pf-panel-foot">高中化学可视化平台 · 小肥鱼助教</div>`;

  document.body.appendChild(button);
  document.body.appendChild(panel);

  function open(){panel.classList.add("open");button.setAttribute("aria-expanded","true");panel.setAttribute("aria-hidden","false");}
  function close(){panel.classList.remove("open");button.setAttribute("aria-expanded","false");panel.setAttribute("aria-hidden","true");}
  button.addEventListener("click",(e)=>{e.stopPropagation();panel.classList.contains("open")?close():open();});
  panel.addEventListener("click",(e)=>{if(e.target.closest(".pf-close")){e.stopPropagation();close();}});
  document.addEventListener("click",(e)=>{if(!panel.contains(e.target)&&!button.contains(e.target))close();});
  document.addEventListener("keydown",(e)=>{if(e.key==="Escape")close();});
  button.setAttribute("aria-expanded","false");
})();
