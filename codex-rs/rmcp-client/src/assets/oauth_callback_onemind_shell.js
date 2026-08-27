(function () {
  const copy = {
    en: { language: "Language", display: "Display mode", auto: "Automatic", light: "Light", dark: "Dark", title: "Authorize Codex", successTitle: "Codex authorized", successAppBody: "Return to Codex. The app will continue automatically.", successBrowserBody: "Authentication complete. You may close this tab and return to Codex.", errorTitle: "Authorization not completed", errorBody: "Return to Codex and try connecting OneMind again.", returnToCodex: "Return to Codex", enterMatrix: "Enter Matrix" },
    "zh-SG": { language: "语言", display: "显示模式", auto: "自动", light: "浅色", dark: "深色", title: "授权 Codex", successTitle: "Codex 已授权", successAppBody: "请返回 Codex，App 会自动继续。", successBrowserBody: "认证已完成。你可以关闭此标签页并返回 Codex。", errorTitle: "授权未完成", errorBody: "请返回 Codex，然后再次尝试连接 OneMind。", returnToCodex: "返回 Codex", enterMatrix: "进入 Matrix" },
    "zh-HK": { language: "語言", display: "顯示模式", auto: "自動", light: "淺色", dark: "深色", title: "授權 Codex", successTitle: "Codex 已授權", successAppBody: "請返回 Codex，App 會自動繼續。", successBrowserBody: "認證已完成。你可以關閉此分頁並返回 Codex。", errorTitle: "授權未完成", errorBody: "請返回 Codex，然後再次嘗試連接 OneMind。", returnToCodex: "返回 Codex", enterMatrix: "進入 Matrix" },
    ja: { language: "言語", display: "表示モード", auto: "自動", light: "ライト", dark: "ダーク", title: "Codex を認証", successTitle: "Codex を認証しました", successAppBody: "Codex に戻ってください。App が自動的に続行します。", successBrowserBody: "認証が完了しました。このタブを閉じて Codex に戻れます。", errorTitle: "認証が完了しませんでした", errorBody: "Codex に戻り、OneMind への接続をもう一度お試しください。", returnToCodex: "Codex に戻る", enterMatrix: "Matrix に入る" },
    ko: { language: "언어", display: "화면 모드", auto: "자동", light: "라이트", dark: "다크", title: "Codex 인증", successTitle: "Codex 인증 완료", successAppBody: "Codex로 돌아가세요. App이 자동으로 계속합니다.", successBrowserBody: "인증이 완료되었습니다. 이 탭을 닫고 Codex로 돌아가세요.", errorTitle: "인증이 완료되지 않았습니다", errorBody: "Codex로 돌아가 OneMind 연결을 다시 시도하세요.", returnToCodex: "Codex로 돌아가기", enterMatrix: "Matrix로 이동" }
  };
  const localeNames = { en: "English", "zh-SG": "简体中文", "zh-HK": "繁體中文", ja: "日本語", ko: "한국어" };
  const tools = [
    ["chatgpt", "ChatGPT", 8, 16, -4.4, "chatgpt-on-light.png", "chatgpt-on-dark.png"],
    ["claude-code", "Claude Code", 14, 40, -2.6, "claude.png", "claude.png"],
    ["antigravity", "Antigravity", 7, 68, -5.1, "antigravity-on-light.png", "antigravity-on-dark.png"],
    ["openclaw", "OpenClaw", 19, 84, -.7, "openclaw-on-light.png", "openclaw-on-dark.png"],
    ["opencode", "OpenCode", 80, 64, -4.1, "opencode-on-light.png", "opencode-on-dark.png"],
    ["hermes-agent", "Hermes Agent", 22, 7, -3.2, "hermes-agent-on-light.png", "hermes-agent-on-dark.png"],
    ["pi", "Pi", 92, 21, -5.8, "pi-on-light.png", "pi-on-dark.png"],
    ["grok-build", "Grok Build", 50, 50, -1.8, "grok-build-on-light.png", "grok-build-on-dark.png"],
    ["deepseek", "DeepSeek", 48, 93, -3.5, "deepseek.png", "deepseek.png"],
    ["codebuddy", "CodeBuddy", 86, 35, -2.1, "codebuddy-on-light.png", "codebuddy-on-dark.png"],
    ["cursor", "Cursor", 94, 68, -4.9, "cursor-on-light.png", "cursor-on-dark.png"],
    ["qoder", "Qoder", 77, 89, -3.8, "qoder-on-light.png", "qoder-on-dark.png"],
    ["trae", "TRAE", 78, 7, -1.2, "trae-on-light.png", "trae-on-dark.png"]
  ];
  const params = new URLSearchParams(window.location.search);
  const preview = params.get("preview") === "true";
  const shouldReturn = document.body.dataset.returnToApp === "true";
  const pageState = document.body.dataset.pageState;
  let locale = "en";
  let displayMode = "auto";
  let openMenu = null;

  function preferredLocale() {
    for (const language of navigator.languages || [navigator.language || "en"]) {
      const normalized = language.toLowerCase();
      if (normalized.startsWith("zh-hk") || normalized.startsWith("zh-tw")) return "zh-HK";
      if (normalized.startsWith("zh")) return "zh-SG";
      if (normalized.startsWith("ja")) return "ja";
      if (normalized.startsWith("ko")) return "ko";
    }
    return "en";
  }

  function menuButton(label, selected, value, type) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-checked", String(selected));
    button.dataset.value = value;
    button.dataset.menuChoice = type;
    const text = document.createElement("span");
    text.textContent = label;
    const check = document.createElement("span");
    check.className = "beta-signin-popup-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = selected ? "✓" : "";
    button.append(text, check);
    return button;
  }

  function renderMenus() {
    const languageMenu = document.querySelector('[data-menu="language"]');
    const displayMenu = document.querySelector('[data-menu="display"]');
    languageMenu.setAttribute("aria-label", copy[locale].language);
    displayMenu.setAttribute("aria-label", copy[locale].display);
    languageMenu.replaceChildren.apply(languageMenu, Object.keys(localeNames).map(function (value) { return menuButton(localeNames[value], value === locale, value, "language"); }));
    displayMenu.replaceChildren.apply(displayMenu, ["auto", "light", "dark"].map(function (value) { return menuButton(copy[locale][value], value === displayMode, value, "display"); }));
  }

  function translate(nextLocale) {
    locale = nextLocale;
    document.documentElement.lang = nextLocale;
    document.querySelectorAll("[data-i18n]").forEach(function (element) { element.textContent = copy[nextLocale][element.dataset.i18n]; });
    document.querySelector('[data-menu-toggle="language"]').setAttribute("aria-label", copy[nextLocale].language);
    document.querySelector('[data-menu-toggle="display"]').setAttribute("aria-label", copy[nextLocale].display);
    renderMenus();
  }

  function resolvedTheme() { return displayMode === "auto" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : displayMode; }
  function applyTheme() { document.documentElement.dataset.betaSigninTheme = resolvedTheme(); renderMenus(); }
  function closeMenus(restoreFocus) {
    const previous = openMenu;
    openMenu = null;
    document.querySelectorAll("[data-menu]").forEach(function (menu) { menu.hidden = true; });
    document.querySelectorAll("[data-menu-toggle]").forEach(function (button) { button.setAttribute("aria-expanded", "false"); });
    if (restoreFocus && previous) document.querySelector('[data-menu-toggle="' + previous + '"]').focus();
  }

  document.addEventListener("click", function (event) {
    const toggle = event.target.closest("[data-menu-toggle]");
    const choice = event.target.closest("[data-menu-choice]");
    if (choice) {
      if (choice.dataset.menuChoice === "language") translate(choice.dataset.value);
      else { displayMode = choice.dataset.value; applyTheme(); }
      closeMenus(true);
      return;
    }
    if (toggle) {
      const name = toggle.dataset.menuToggle;
      const opening = openMenu !== name;
      closeMenus(false);
      if (opening) {
        openMenu = name;
        document.querySelector('[data-menu="' + name + '"]').hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        document.querySelector('[data-menu="' + name + '"] button').focus();
      }
      return;
    }
    if (!event.target.closest("[data-menu]")) closeMenus(false);
  });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape" && openMenu) { event.preventDefault(); closeMenus(true); } });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { if (displayMode === "auto") applyTheme(); });

  const halo = document.querySelector(".one-mind-beta-sign-in-tool-halo");
  tools.forEach(function (tool) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "one-mind-beta-sign-in-tool-halo__item";
    button.setAttribute("aria-label", tool[1]);
    button.dataset.dragState = "idle";
    button.dataset.toolId = tool[0];
    button.style.setProperty("--one-mind-beta-sign-in-logo-x", tool[2] + "%");
    button.style.setProperty("--one-mind-beta-sign-in-logo-y", tool[3] + "%");
    button.style.setProperty("--one-mind-beta-sign-in-logo-delay", tool[4] + "s");
    const surface = document.createElement("span");
    surface.className = "one-mind-beta-sign-in-tool-halo__surface";
    [tool[5], tool[6]].forEach(function (file, index) {
      const image = document.createElement("img");
      image.alt = "";
      image.draggable = false;
      image.decoding = "async";
      image.className = index ? "one-mind-beta-theme-asset--on-dark" : "one-mind-beta-theme-asset--on-light";
      image.src = "https://onemind.team/assets/ai-tools/squares/" + file;
      surface.appendChild(image);
    });
    button.appendChild(surface);
    halo.appendChild(button);
  });

  let drag = null;
  const clamp = function (value, minimum, maximum) { return Math.min(Math.max(value, minimum), Math.max(minimum, maximum)); };
  function positionTool(button, x, y, phase) {
    const rect = halo.getBoundingClientRect();
    const boundedX = clamp(x, 32, rect.width - 32);
    const boundedY = clamp(y, 32, rect.height - 32);
    button.style.setProperty("--one-mind-beta-sign-in-logo-drag-x", boundedX + "px");
    button.style.setProperty("--one-mind-beta-sign-in-logo-drag-y", boundedY + "px");
    button.dataset.dragState = phase;
  }
  halo.addEventListener("pointerdown", function (event) {
    const button = event.target.closest("button");
    if (!button || event.button !== 0) return;
    const rect = button.getBoundingClientRect();
    const haloRect = halo.getBoundingClientRect();
    drag = { button: button, offsetX: event.clientX - rect.left - rect.width / 2, offsetY: event.clientY - rect.top - rect.height / 2 };
    positionTool(button, rect.left + rect.width / 2 - haloRect.left, rect.top + rect.height / 2 - haloRect.top, "dragging");
    event.preventDefault();
  });
  window.addEventListener("pointermove", function (event) { if (drag) { const rect = halo.getBoundingClientRect(); positionTool(drag.button, event.clientX - rect.left - drag.offsetX, event.clientY - rect.top - drag.offsetY, "dragging"); event.preventDefault(); } }, { passive: false });
  window.addEventListener("pointerup", function () { if (drag) { drag.button.dataset.dragState = "placed"; drag = null; } });
  halo.addEventListener("keydown", function (event) {
    const deltas = { ArrowDown: [0, 16], ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16] };
    if (!deltas[event.key]) return;
    const button = event.target.closest("button");
    const rect = button.getBoundingClientRect();
    const haloRect = halo.getBoundingClientRect();
    positionTool(button, rect.left + rect.width / 2 - haloRect.left + deltas[event.key][0], rect.top + rect.height / 2 - haloRect.top + deltas[event.key][1], "placed");
    event.preventDefault();
  });

  const canvas = document.querySelector(".one-mind-square-dot-sea canvas");
  const context = canvas.getContext("2d");
  const colors = [[16,163,127],[217,119,87],[66,133,244],[255,77,77],[101,88,245],[42,219,92],[0,233,155],[45,46,47]];
  let canvasWidth = 0;
  let canvasHeight = 0;
  let animationFrame = 0;
  let startedAt = performance.now();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function interpolate(position) {
    const wrapped = ((position % 1) + 1) % 1;
    const scaled = wrapped * colors.length;
    const left = colors[Math.floor(scaled) % colors.length];
    const right = colors[(Math.floor(scaled) + 1) % colors.length];
    const amount = scaled - Math.floor(scaled);
    return "rgb(" + left.map(function (value, index) { return Math.round(value + (right[index] - value) * amount); }).join(" ") + ")";
  }
  function renderSea(timestamp) {
    if (!canvasWidth || !canvasHeight) return;
    const motionTime = (reducedMotion.matches ? 0 : (timestamp - startedAt) / 1000) * 1.75;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const columnSpacing = canvasWidth / 36;
    const rowSpacing = canvasHeight / 31;
    const baseSize = Math.max(2.8, Math.min(4.8, Math.sqrt(canvasWidth * canvasHeight) * .00425));
    for (let row = 0; row < 30; row += 1) {
      for (let column = 0; column < 35; column += 1) {
        const normalizedX = (column + 1) / 36;
        const normalizedY = (row + 1) / 31;
        const phase = (column - 17) * .58 + row * .43;
        const large = Math.sin(normalizedX * Math.PI * 1.55 + normalizedY * Math.PI * .85 - motionTime * .48);
        const medium = Math.sin(normalizedX * Math.PI * 3.4 - normalizedY * Math.PI * 1.7 + motionTime * .78 + 1.2);
        const small = Math.sin(normalizedX * Math.PI * 6.8 + normalizedY * Math.PI * 3.2 - motionTime * 1.15 + 2.4);
        const wave = Math.tanh((large * .62 + medium * .27 + small * .11) * 1.35);
        const height = (wave + 1) / 2;
        const size = Math.max(1.35, baseSize * (.28 + Math.pow(height, 2) * 2.5));
        const x = (column + 1) * columnSpacing + Math.cos((row - 14.5) * .36 + column * .23 + motionTime * .78) * columnSpacing * .045;
        const y = (row + 1) * rowSpacing + wave * rowSpacing * .055;
        context.globalAlpha = Math.min(.99, .16 + Math.pow(height, 1.65) * .82);
        context.fillStyle = interpolate(phase * .038 + motionTime * .065 + wave * .055);
        context.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
    context.globalAlpha = 1;
  }
  function resizeSea() {
    const bounds = canvas.getBoundingClientRect();
    canvasWidth = Math.max(1, bounds.width);
    canvasHeight = Math.max(1, bounds.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvasWidth * ratio);
    canvas.height = Math.round(canvasHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    renderSea(performance.now());
  }
  function tick(timestamp) { renderSea(timestamp); if (!reducedMotion.matches) animationFrame = requestAnimationFrame(tick); }
  window.addEventListener("resize", resizeSea);
  reducedMotion.addEventListener("change", function () { cancelAnimationFrame(animationFrame); startedAt = performance.now(); resizeSea(); if (!reducedMotion.matches) animationFrame = requestAnimationFrame(tick); });

  translate(preferredLocale());
  applyTheme();
  resizeSea();
  if (!reducedMotion.matches) animationFrame = requestAnimationFrame(tick);
  window.history.replaceState(null, "", window.location.pathname);
  const returnButton = document.getElementById("return-to-codex") || document.querySelector('.one-mind-auth-submit[href^="codex:"]');
  if (returnButton) returnButton.addEventListener("click", function () { setTimeout(function () { window.close(); }, 1200); });
  if (pageState === "success" && shouldReturn && !preview && returnButton) setTimeout(function () { window.location.href = returnButton.href; setTimeout(function () { window.close(); }, 1200); }, 350);
})();
