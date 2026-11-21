/* Shared light/dark theme + ambient audio control.
   Default theme is light; dark theme is the original page styling.
   Audio is synthesized locally (no external audio files, no copyright). */
(() => {
  "use strict";

  const root = document.documentElement;
  const LS_THEME = "cvl-theme";
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
    a.master.gain.exponentialRampToValueAtTime(0.225, a.ctx.currentTime + 1.2);
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
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  window.addEventListener("pagehide", () => { if (ambientPlaying) stopMusic(); });
})();
