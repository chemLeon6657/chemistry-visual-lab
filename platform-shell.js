/* 鲸鱼娘助教 + 全局浮动头像 */
(function () {
  "use strict";
  if (window.__pfShellMounted) return;
  if (new URLSearchParams(location.search).get("embed") === "1") return;
  window.__pfShellMounted = true;

  const quotes = [
    ["Say my name.", "Heisenberg。行，名字记住了，现在把这道题的反应机理也写出来。"],
    ["Say my name.", "Hamburger。……好吧，至少你敢于配位。"],
    ["ΔG < 0", "今天也要做自发反应：快乐自发，内耗不自发。"],
    ["催化剂", "你不是反应物，你是催化剂：自己不消耗，却能让全班反应速率飙升。"],
    ["电子", "电子都知道要配对成键，你也该和这道题成键了。σ 键先连上，π 键慢慢来。"],
    ["孤对电子", "这道题没有孤对电子，只有孤军奋战的你——但你可以成键。"],
    ["摩尔", "别怕摩尔，摩尔也怕你。你多算一步，它就少一步。"],
    ["配位键", "生活给你一对孤对电子，你就去找一个空轨道。配位键，也是键。"],
    ["Token", "确定我们要把token花在玩梗上吗，老大。"],
    ["活化能", "先跨过第一道小题的活化能，后面就没那么陡了。"],
    ["平衡常数", "状态不好不等于平衡常数变了；你只是还没到平衡。"],
    ["熵", "桌面越乱熵越大，但你的知识网络要逆熵而行。"],
    ["共价键", "共用电子对才稳定；不会的题，拿去和同桌共用一下思路。"],
    ["pH", "心情偏酸的时候，先稀释一下：喝水、走动、再回来。"],
    ["焰色", "你不必一直发光；但 Na 的黄、K 的紫，都是被点燃以后才看见的。"],
    ["有效碰撞", "不是每次努力都是有效碰撞；但先提高浓度，总比零碰撞强。"],
    ["同位素", "同一道题可以有不同解法，就像同位素：质子数一样，脾气不同。"],
    ["电子排布", "先填能量低的轨道，别让焦虑抢占你的 4s。"]
  ];

  const style = document.createElement("style");
  style.textContent = `
    .pf-fish-button{position:fixed;right:18px;bottom:18px;z-index:9000;width:58px;height:58px;border:1px solid rgba(103,232,249,.35);border-radius:50%;background:radial-gradient(circle at 35% 25%,rgba(103,232,249,.26),rgba(7,18,32,.96) 62%);box-shadow:0 14px 34px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.04) inset,0 0 26px rgba(34,211,238,.12);cursor:pointer;display:grid;place-items:center;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;padding:0}
    .pf-fish-button:hover{transform:translateY(-2px) scale(1.03);border-color:rgba(103,232,249,.65);box-shadow:0 18px 40px rgba(0,0,0,.45),0 0 34px rgba(34,211,238,.2)}
    .pf-fish-button:focus-visible{outline:2px solid #5eead4;outline-offset:3px}
    .pf-fish-button img{width:46px;height:46px;display:block;object-fit:cover;border-radius:50%;filter:drop-shadow(0 3px 8px rgba(0,0,0,.3))}
    .pf-bubble{position:fixed;right:18px;bottom:88px;z-index:9001;width:318px;max-width:calc(100vw - 32px);padding:14px 14px 11px;border:1px solid rgba(103,232,249,.22);border-radius:18px;background:linear-gradient(160deg,rgba(9,24,40,.98),rgba(5,13,25,.98));box-shadow:0 24px 64px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.06);color:#e7fdff;opacity:0;transform:translateY(9px) scale(.975);visibility:hidden;pointer-events:none;transition:opacity .24s ease,transform .24s ease,visibility 0s linear .24s;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
    .pf-bubble.open{opacity:1;transform:translateY(0) scale(1);visibility:visible;pointer-events:auto;transition:opacity .24s ease,transform .24s ease,visibility 0s linear 0s}
    .pf-bubble::after{content:"";position:absolute;right:25px;bottom:-7px;width:12px;height:12px;background:#071421;border-right:1px solid rgba(103,232,249,.22);border-bottom:1px solid rgba(103,232,249,.22);transform:rotate(45deg)}
    .pf-bubble-head{display:flex;align-items:center;gap:9px;padding-bottom:10px;border-bottom:1px solid rgba(148,163,184,.12)}
    .pf-bubble-head img{width:40px;height:40px;flex:0 0 auto;object-fit:contain;border-radius:50%;background:rgba(103,232,249,.06)}
    .pf-bubble-head h3{margin:0;color:#f2ffff;font-size:13px;font-weight:650;line-height:1.2}
    .pf-bubble-head p{margin:3px 0 0;color:#8da5b9;font-size:9px;letter-spacing:.03em;line-height:1.35}
    .pf-bubble-x{margin-left:auto;width:24px;height:24px;border:1px solid rgba(148,163,184,.16);border-radius:7px;background:rgba(4,10,20,.5);color:#9db4c8;font-size:15px;line-height:1;cursor:pointer;padding:0;flex:0 0 auto}
    .pf-bubble-x:hover{color:#fff;border-color:rgba(103,232,249,.35)}
    .pf-bubble-quote{padding:12px 1px 8px}
    .pf-quote-en{margin:0 0 5px;color:#5eead4;font-family:"Cascadia Code",Consolas,monospace;font-size:11px;font-weight:650;letter-spacing:.02em}
    .pf-quote-zh{margin:0;color:#d8eff2;font-size:13px;line-height:1.7;font-weight:450}
    .pf-bubble-foot{padding-top:9px;border-top:1px solid rgba(148,163,184,.1);color:#7d94a9;font-size:9px;letter-spacing:.03em;text-align:right}
    html[data-theme="light"] .pf-fish-button{background:radial-gradient(circle at 35% 25%,#f0fdfa,#ffffff 64%);border-color:rgba(15,118,110,.22);box-shadow:0 14px 34px rgba(15,49,46,.16),0 0 0 1px rgba(255,255,255,.8) inset,0 0 0 4px rgba(15,118,110,.03)}
    html[data-theme="light"] .pf-fish-button:hover{border-color:rgba(15,118,110,.5);box-shadow:0 18px 38px rgba(15,49,46,.2),0 0 0 4px rgba(15,118,110,.06)}
    html[data-theme="light"] .pf-fish-button img{filter:drop-shadow(0 2px 4px rgba(15,49,46,.18))}
    html[data-theme="light"] .pf-bubble{background:linear-gradient(165deg,#ffffff,#f6fbf8);border-color:rgba(15,118,110,.2);box-shadow:0 22px 56px rgba(15,49,46,.16);color:#14312e}
    html[data-theme="light"] .pf-bubble::after{background:#f7fbf8;border-right-color:rgba(15,118,110,.2);border-bottom-color:rgba(15,118,110,.2)}
    html[data-theme="light"] .pf-bubble-head{border-bottom-color:rgba(15,118,110,.12)}
    html[data-theme="light"] .pf-bubble-head img{background:#e7f7f1}
    html[data-theme="light"] .pf-bubble-head h3{color:#14312e}
    html[data-theme="light"] .pf-bubble-head p{color:#5f7570}
    html[data-theme="light"] .pf-bubble-x{background:#f1f7f4;border-color:rgba(15,118,110,.18);color:#526b66}
    html[data-theme="light"] .pf-bubble-x:hover{color:#0f766e;border-color:rgba(15,118,110,.45);background:#e7f7f1}
    html[data-theme="light"] .pf-quote-en{color:#0f766e}
    html[data-theme="light"] .pf-quote-zh{color:#2f4f4a}
    html[data-theme="light"] .pf-bubble-foot{border-top-color:rgba(15,118,110,.1);color:#6b8179}
    @media (max-width: 640px){
      .pf-fish-button{right:12px;bottom:12px;width:50px;height:50px}
      .pf-fish-button img{width:40px;height:40px}
      .pf-bubble{right:12px;left:12px;bottom:74px;width:auto;max-width:none}
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement("button");
  button.className = "pf-fish-button";
  button.type = "button";
  button.setAttribute("aria-label", "和鲸鱼娘助教说句话");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = '<img src="mascot-head.png" alt="鲸鱼娘助教">';

  const bubble = document.createElement("div");
  bubble.className = "pf-bubble";
  bubble.setAttribute("role", "dialog");
  bubble.setAttribute("aria-label", "鲸鱼娘助教的化学鼓励");
  bubble.setAttribute("aria-hidden", "true");
  bubble.innerHTML = `
    <div class="pf-bubble-head">
      <img src="mascot-head.png" alt="">
      <div><h3>鲸鱼娘助教</h3><p>DEEPSEEK Q · 化学嘴替</p></div>
      <button class="pf-bubble-x" type="button" aria-label="收起对话">×</button>
    </div>
    <div class="pf-bubble-quote">
      <p class="pf-quote-en"></p>
      <p class="pf-quote-zh"></p>
    </div>
    <div class="pf-bubble-foot">再点我一下，我就安静。</div>`;

  document.body.appendChild(button);
  document.body.appendChild(bubble);

  const quoteEn = bubble.querySelector(".pf-quote-en");
  const quoteZh = bubble.querySelector(".pf-quote-zh");
  let isOpen = false;
  let quoteIndex = -1;

  const soundPress = new Audio("assets/whale-ya1.mp3");
  const soundRelease = new Audio("assets/whale-ya2.mp3");
  soundPress.preload = "auto";
  soundRelease.preload = "auto";
  soundPress.volume = 0.62;
  soundRelease.volume = 0.55;
  let soundTimer = 0;

  function playWhaleSound() {
    clearTimeout(soundTimer);
    try {
      soundPress.pause();
      soundPress.currentTime = 0;
      soundRelease.pause();
      soundRelease.currentTime = 0;
      const a = soundPress.play();
      if (a && typeof a.catch === "function") a.catch(function () {});
    } catch (err) {}
    soundTimer = setTimeout(function () {
      try {
        const b = soundRelease.play();
        if (b && typeof b.catch === "function") b.catch(function () {});
      } catch (err) {}
    }, 260);
  }

  function nextQuote() {
    if (!quotes.length) return ["", "先做一道题，再来找我聊天。"];
    if (quoteIndex < 0) quoteIndex = Math.floor(Math.random() * quotes.length);
    else quoteIndex = (quoteIndex + 1 + Math.floor(Math.random() * (quotes.length - 1))) % quotes.length;
    return quotes[quoteIndex];
  }

  function showBubble() {
    const q = nextQuote();
    quoteEn.textContent = q[0];
    quoteZh.textContent = q[1];
    bubble.classList.add("open");
    bubble.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    button.classList.add("is-talking");
    isOpen = true;
    playWhaleSound();
  }

  function hideBubble() {
    bubble.classList.remove("open");
    bubble.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    button.classList.remove("is-talking");
    isOpen = false;
  }

  function toggleBubble() {
    if (isOpen) hideBubble();
    else showBubble();
  }

  button.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleBubble();
  });

  bubble.addEventListener("click", function (e) {
    e.stopPropagation();
    hideBubble();
  });

  document.addEventListener("pointerdown", function (e) {
    if (!isOpen) return;
    if (!bubble.contains(e.target) && !button.contains(e.target)) hideBubble();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideBubble();
  });
})();
