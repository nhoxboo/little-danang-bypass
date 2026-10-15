// ==UserScript==
// @name         Little DaNang - Play Direct Without Install (Bypass PWA Gate)
// @namespace    https://github.com/nhoxboo/
// @version      1.0.0
// @description  Chơi Little DaNang trực tiếp trên mọi trình duyệt (Comet, Chrome, Edge, Cốc Cốc, Firefox...) mà không cần cài đặt ứng dụng PWA. Tự động vượt qua màn hình chặn Install Gate.
// @author       Hermes (Beso)
// @match        https://littledanang.oryzen.cloud/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/nhoxboo/little-danang-bypass/main/little-danang-bypass.user.js
// @updateURL    https://raw.githubusercontent.com/nhoxboo/little-danang-bypass/main/little-danang-bypass.user.js
// @homepageURL  https://github.com/nhoxboo/little-danang-bypass
// ==/UserScript==

(function () {
  'use strict';

  // 1. Giả lập môi trường Standalone / PWA Installed
  try {
    // Safari standalone flag
    Object.defineProperty(navigator, 'standalone', {
      get: () => true,
      configurable: true
    });
  } catch (e) {
    console.warn('[LDN Bypass] Could not redefine navigator.standalone', e);
  }

  // 2. Hook window.matchMedia để vượt qua kiểm tra display-mode
  const originalMatchMedia = window.matchMedia;
  if (originalMatchMedia) {
    window.matchMedia = function (query) {
      if (typeof query === 'string' && /display-mode:\s*(standalone|window-controls-overlay|fullscreen|minimal-ui)/i.test(query)) {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener: function () {},
          removeListener: function () {},
          addEventListener: function () {},
          removeEventListener: function () {},
          dispatchEvent: function () { return false; }
        };
      }
      return originalMatchMedia.apply(this, arguments);
    };
  }

  // 3. Tùy biến trên trang Landing Page (trang chủ)
  if (window.location.pathname === '/' || window.location.pathname === '') {
    window.addEventListener('DOMContentLoaded', () => {
      const ctaBtn = document.getElementById('cta-install');
      const ctaNote = document.getElementById('cta-note');
      
      if (ctaBtn) {
        ctaBtn.textContent = '🚀 Vào chơi ngay (Không cần cài đặt)';
        ctaBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = '/play/';
        };
      }
      if (ctaNote) {
        ctaNote.innerHTML = '<span style="color: #4ade80; font-weight: bold;">✓ Đã kích hoạt Tampermonkey Bypass:</span> Bạn có thể chơi trực tiếp trên tab trình duyệt.';
      }
    });
  }

  // 4. Đảm bảo màn hình chặn #instgate ẩn hoàn toàn nếu trang load xong
  window.addEventListener('DOMContentLoaded', () => {
    const instGate = document.getElementById('instgate');
    if (instGate) {
      instGate.hidden = true;
      instGate.style.display = 'none';
    }
  });

  console.log('%c[Little DaNang Bypass]%c PWA Gate bypassed successfully! Chúc bạn chơi vui vẻ.', 'color: #38bdf8; font-weight: bold;', 'color: inherit;');
})();
