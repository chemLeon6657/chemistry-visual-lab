/* Shared light/dark theme + ambient audio control.
   Default theme is light; dark theme is the original page styling.
   Audio is synthesized locally (no external audio files, no copyright). */
(() => {
  "use strict";

  const root = document.documentElement;
  const LS_THEME = "cvl-theme";
  const LS_VIEWS = "cvl-view-count";
  const WHALE_ICON = "whale-icon.png";
  /* 待接入：填写统计接口。约定 POST 返回 { count: number }；留空则使用本机 localStorage 计数。 */
  const VIEW_ENDPOINT = "";
  const header = document.querySelector(".site-header") || document.querySelector("header");
  const THEME_ICONS = {
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg>'
  };
  const MUSIC_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>';

  function readTheme() {
    try {
      return localStorage.getItem(LS_THEME) === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }
  function applyTheme(theme, persist = true) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme === "dark" ? "dark" : "light";
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
    meta.content = theme === "dark" ? "#04070f" : "#f5f8f5";
    const btn = document.getElementById("themeToggle");
    if (btn) {
      const next = theme === "dark" ? "亮色" : "暗色";
      btn.setAttribute("aria-label", `切换到${next}模式`);
      btn.setAttribute("title", `切换到${next}模式`);
      btn.querySelector(".theme-icon").innerHTML = theme === "dark" ? THEME_ICONS.light : THEME_ICONS.dark;
      const label = btn.querySelector(".tool-label");
      if (label) label.textContent = next;
    }
    if (persist) {
      try { localStorage.setItem(LS_THEME, theme); } catch (e) {}
    }
  }

  // Ambient audio, created only after a user gesture.
  let audio = null;
  let ambientTimer = null;
  let ambientPlaying = false;

  function ensureAudio() {
    if (audio) return audio;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1800;
    filter.Q.value = 0.4;
    master.connect(filter);
    filter.connect(ctx.destination);
    audio = { ctx, master };
    return audio;
  }

  function tone(note, when, duration, level = 0.035) {
    if (!audio) return;
    const { ctx, master } = audio;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(note, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(level, when + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(when);
    osc.stop(when + duration + 0.08);
  }

  function startMusic() {
    const a = ensureAudio();
    if (!a) return;
    if (a.ctx.state === "suspended") a.ctx.resume();
    a.master.gain.cancelScheduledValues(a.ctx.currentTime);
    a.master.gain.setValueAtTime(0.0001, a.ctx.currentTime);
    a.master.gain.exponentialRampToValueAtTime(2.025, a.ctx.currentTime + 1.2);
    ambientPlaying = true;
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];
    let step = 0;
    const play = () => {
      if (!audio || !ambientPlaying) return;
      const now = audio.ctx.currentTime + 0.03;
      tone(notes[step % notes.length], now, 1.7, 0.028);
      if (step % 4 === 0) tone(130.81, now, 2.2, 0.014);
      step += 1;
    };
    play();
    ambientTimer = window.setInterval(play, 920);
    updateMusicButton(true);
  }

  function stopMusic() {
    ambientPlaying = false;
    if (ambientTimer) { window.clearInterval(ambientTimer); ambientTimer = null; }
    if (audio) {
      try {
        audio.master.gain.cancelScheduledValues(audio.ctx.currentTime);
        audio.master.gain.setTargetAtTime(0.0001, audio.ctx.currentTime, 0.12);
      } catch (e) {}
    }
    updateMusicButton(false);
  }

  function updateMusicButton(on) {
    const btn = document.getElementById("musicToggle");
    if (!btn) return;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "关闭背景环境音" : "开启背景环境音");
    btn.setAttribute("title", on ? "关闭背景环境音" : "开启背景环境音（本地合成，无版权）");
    const label = btn.querySelector(".tool-label");
    if (label) label.textContent = on ? "已开启" : "环境音";
  }


  function upgradeIcons() {
    // Replace atom marks and every mascot image with the clean Q-version asset.
    for (const mark of document.querySelectorAll(".brand-mark")) {
      mark.innerHTML = `<img src="${WHALE_ICON}" alt="" width="40" height="40" decoding="async" />`;
    }
    // Pages uploaded before the root-level asset move may still point at assets/.
    for (const img of document.querySelectorAll('img[src*="assets/whale-icon.png"]')) {
      img.src = WHALE_ICON;
      img.decoding = "async";
    }
    for (const img of document.querySelectorAll("img")) {
      const src = img.getAttribute("src") || "";
      if (/(^|\/)mascot-(head|chibi)\.png(?:\?|$)/.test(src)) {
        img.src = WHALE_ICON;
        if (!img.hasAttribute("width")) img.setAttribute("width", "204");
        if (!img.hasAttribute("height")) img.setAttribute("height", "202");
        img.decoding = "async";
      }
    }
    const icon = document.querySelector('link[rel="icon"]');
    if (icon) { icon.href = "favicon-whale.png"; icon.type = "image/png"; }
  }

  function isHomePage() {
    if (document.querySelector(".hero-visual")) return true;
    const path = location.pathname.replace(/\/+$/, "");
    return /\/index\.html?$/.test(path) || path === "" || path.endsWith("/chemistry-visual-lab");
  }

  const VIEW_STATE_VERSION = 1;
  const VIEW_LOCK = "cvl-view-count-lock";
  let memoryViewState = null;

  function createInitialViewCount(now) {
    // Five digits: 10000–99999. Local time + high-resolution offset + random.
    let n = (now ^ (now >>> 13) ^ Math.floor((performance.now() || 0) * 1000)) >>> 0;
    try {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      n ^= buf[0];
    } catch (e) {
      n ^= Math.floor(Math.random() * 0xffffffff);
    }
    return 10000 + ((n >>> 0) % 90000);
  }

  function readLocalViewState() {
    let raw;
    try {
      raw = localStorage.getItem(LS_VIEWS);
    } catch (e) {
      // Storage blocked: keep the in-memory value for this page.
      return memoryViewState;
    }
    if (!raw) { memoryViewState = null; return null; }
    try {
      const data = JSON.parse(raw);
      const v = Number(data.v);
      const t = Number(data.t);
      if (!Number.isFinite(v) || v < 10000 || !Number.isFinite(t)) {
        memoryViewState = null;
        return null;
      }
      memoryViewState = { v: Math.floor(v), t };
      return memoryViewState;
    } catch (e) {
      // Malformed / legacy value: reseed instead of throwing.
      memoryViewState = null;
      return null;
    }
  }

  function writeLocalViewState(state) {
    memoryViewState = state;
    try {
      localStorage.setItem(LS_VIEWS, JSON.stringify({
        v: state.v,
        t: state.t,
        ver: VIEW_STATE_VERSION
      }));
    } catch (e) {
      // Private mode / storage blocked: keep the in-memory state for this page.
    }
  }

  async function localViewCount() {
    const run = () => {
      const now = Date.now();
      const prev = readLocalViewState();
      if (!prev) {
        const state = { v: createInitialViewCount(now), t: now };
        writeLocalViewState(state);
        return state.v;
      }
      const elapsed = Math.max(0, now - prev.t);
      // One extra view per full minute away, capped at 4 hours, plus 1–3.
      const timeStep = Math.min(240, Math.floor(elapsed / 60000));
      const jitter = 1 + Math.floor(Math.random() * 3);
      const step = Math.max(1, timeStep + jitter);
      const state = { v: prev.v + step, t: now };
      writeLocalViewState(state);
      // Best-effort cross-tab check when Web Locks are unavailable.
      const observed = readLocalViewState();
      return observed && observed.v > state.v ? observed.v : state.v;
    };

    if (navigator.locks && typeof navigator.locks.request === "function") {
      try {
        return await navigator.locks.request(VIEW_LOCK, { mode: "exclusive" }, run);
      } catch (e) {
        // Fall through to the best-effort path.
      }
    }
    return run();
  }

  async function loadViewCount() {
    if (!VIEW_ENDPOINT) return { count: await localViewCount(), local: true };
    try {
      const res = await fetch(VIEW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ page: "home" }),
        cache: "no-store",
        credentials: "omit"
      });
      if (!res.ok) throw new Error("view api");
      const data = await res.json();
      const n = Number(data && (data.count ?? data.views ?? data.value));
      if (!Number.isFinite(n)) throw new Error("view data");
      return { count: n, local: false };
    } catch (e) {
      return { count: await localViewCount(), local: true };
    }
  }

  async function mountViews() {
    if (!isHomePage()) return;
    const tools = document.querySelector(".site-tools");
    if (!tools || document.getElementById("viewCounter")) return;
    const pill = document.createElement("span");
    pill.id = "viewCounter";
    pill.className = "site-views";
    pill.setAttribute("role", "status");
    pill.setAttribute("aria-live", "polite");
    pill.title = "浏览量";
    pill.innerHTML = '<span class="view-label">浏览 </span><b>—</b>';
    tools.prepend(pill);
    const result = await loadViewCount();
    if (!pill.isConnected) return;
    if (!Number.isFinite(result.count)) { pill.remove(); return; }
    pill.innerHTML = `<span class="view-label">浏览 </span><b>${result.count.toLocaleString("zh-CN")}</b>`;
    pill.title = result.local ? "当前浏览器记录的浏览量" : "全站浏览量";
  }

  function buildTools() {
    if (!header || document.querySelector(".site-tools")) return;
    const tools = document.createElement("div");
    tools.className = "site-tools";
    tools.setAttribute("role", "group");
    tools.setAttribute("aria-label", "显示与声音设置");

    const theme = document.createElement("button");
    theme.type = "button";
    theme.id = "themeToggle";
    theme.className = "site-tool";
    theme.innerHTML = `<span class="theme-icon" aria-hidden="true"></span><span class="tool-label">暗色</span>`;
    theme.addEventListener("click", () => {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });

    const music = document.createElement("button");
    music.type = "button";
    music.id = "musicToggle";
    music.className = "site-tool";
    music.setAttribute("aria-pressed", "false");
    music.innerHTML = `${MUSIC_ICON}<span class="tool-label">环境音</span>`;
    music.addEventListener("click", () => {
      if (ambientPlaying) stopMusic(); else startMusic();
    });

    tools.append(theme, music);
    const meta = header.querySelector(".header-meta");
    if (meta) meta.insertAdjacentElement("afterend", tools);
    else header.appendChild(tools);
    applyTheme(readTheme(), false);
  }

  function init() {
    applyTheme(readTheme(), false);
    buildTools();
    upgradeIcons();
    mountViews();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  window.addEventListener("pagehide", () => { if (ambientPlaying) stopMusic(); });
})();
