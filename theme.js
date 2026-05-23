/* ===== THEME TOGGLE - Light / Dark Mode ===== */
(function(){
  const KEY = 'shopTheme';

  /* --- inject dark-mode CSS overrides --- */
  const darkCSS = document.createElement('style');
  darkCSS.id = 'dark-theme-css';
  darkCSS.textContent = `
    /* ===== DARK MODE OVERRIDES ===== */
    html.dark body {
      background: #0f0e17 !important;
      color: #e4e4e7 !important;
    }

    /* header / topbar keep gradient but darken slightly */
    html.dark header,
    html.dark .topbar,
    html.dark .sidebar {
      filter: brightness(.85);
    }

    /* cards, panels, inputs */
    html.dark .card,
    html.dark .product-card,
    html.dark .cart-panel,
    html.dark .products-panel,
    html.dark .review-card,
    html.dark .response-card,
    html.dark .modal-content,
    html.dark .stepbar,
    html.dark .summary-box,
    html.dark .admin-table,
    html.dark table,
    html.dark .kpi-card,
    html.dark .chart-card,
    html.dark .progress-section,
    html.dark .section,
    html.dark .form-section {
      background: #1a1a2e !important;
      border-color: #2d2d44 !important;
      color: #e4e4e7 !important;
    }

    /* inputs, textareas, selects */
    html.dark input,
    html.dark textarea,
    html.dark select,
    html.dark .search-bar input {
      background: #252540 !important;
      border-color: #3d3d5c !important;
      color: #e4e4e7 !important;
    }
    html.dark input::placeholder,
    html.dark textarea::placeholder {
      color: #8888aa !important;
    }
    html.dark input:focus,
    html.dark textarea:focus,
    html.dark select:focus {
      border-color: #7c3aed !important;
      box-shadow: 0 0 0 3px rgba(124,58,237,.25) !important;
    }

    /* tabs & pills */
    html.dark .tab,
    html.dark .filter-btn,
    html.dark .tag-pill,
    html.dark .cat-tab {
      background: #252540 !important;
      border-color: #3d3d5c !important;
      color: #c4b5fd !important;
    }
    html.dark .tab.active,
    html.dark .tab:hover,
    html.dark .filter-btn.active,
    html.dark .cat-tab.active {
      background: #7c3aed !important;
      color: #fff !important;
    }
    html.dark .tag-pill.selected {
      background: #7c3aed !important;
      color: #fff !important;
    }

    /* product cards */
    html.dark .product-name { color: #d4d4d8 !important; }
    html.dark .product-price { color: #c4b5fd !important; }
    html.dark .product-stock { color: #8888aa !important; }

    /* cart */
    html.dark .cart-item {
      border-color: #2d2d44 !important;
    }
    html.dark .cart-item-name { color: #e4e4e7 !important; }
    html.dark .cart-total-row { border-color: #3d3d5c !important; }

    /* payment method cards */
    html.dark .method-card {
      background: #1a1a2e !important;
      border-color: #2d2d44 !important;
      color: #e4e4e7 !important;
    }
    html.dark .method-card:hover,
    html.dark .method-card.selected {
      border-color: #7c3aed !important;
    }

    /* numpad */
    html.dark .num-btn {
      background: #252540 !important;
      color: #e4e4e7 !important;
      border-color: #3d3d5c !important;
    }
    html.dark .num-btn:hover {
      background: #3d3d5c !important;
    }

    /* bank cards */
    html.dark .bank-card {
      border-color: #2d2d44 !important;
    }
    html.dark .bank-card.selected {
      border-color: #7c3aed !important;
    }

    /* tables */
    html.dark th {
      background: #252540 !important;
      color: #c4b5fd !important;
      border-color: #3d3d5c !important;
    }
    html.dark td {
      border-color: #2d2d44 !important;
      color: #d4d4d8 !important;
    }
    html.dark tr:hover td {
      background: #252540 !important;
    }

    /* buttons - keep primary colors, soften secondary */
    html.dark .btn-secondary,
    html.dark .btn-outline {
      background: #252540 !important;
      color: #c4b5fd !important;
      border-color: #3d3d5c !important;
    }

    /* order items */
    html.dark .order-item {
      border-color: #2d2d44 !important;
    }

    /* modals / overlays */
    html.dark .modal-overlay,
    html.dark .lightbox-overlay {
      background: rgba(0,0,0,.7) !important;
    }
    html.dark .modal-content {
      background: #1a1a2e !important;
    }

    /* scrollbar dark */
    html.dark ::-webkit-scrollbar { width: 8px; }
    html.dark ::-webkit-scrollbar-track { background: #0f0e17; }
    html.dark ::-webkit-scrollbar-thumb { background: #3d3d5c; border-radius: 4px; }
    html.dark ::-webkit-scrollbar-thumb:hover { background: #5a5a7a; }

    /* receipt */
    html.dark .receipt {
      background: #1a1a2e !important;
      color: #e4e4e7 !important;
      border-color: #2d2d44 !important;
    }

    /* step bar */
    html.dark .step-label { color: #8888aa !important; }
    html.dark .step.active .step-label { color: #c4b5fd !important; }
    html.dark .step.done .step-label { color: #10b981 !important; }
    html.dark .step-circle {
      background: #252540 !important;
      border-color: #3d3d5c !important;
      color: #8888aa !important;
    }
    html.dark .step.active .step-circle {
      background: #7c3aed !important;
      border-color: #7c3aed !important;
      color: #fff !important;
    }
    html.dark .step.done .step-circle {
      background: #10b981 !important;
      border-color: #10b981 !important;
      color: #fff !important;
    }

    /* stars */
    html.dark .star { color: #3d3d5c !important; }
    html.dark .star.active,
    html.dark .star.hovered { color: #f59e0b !important; }

    /* NPS buttons */
    html.dark .nps-btn {
      background: #252540 !important;
      color: #d4d4d8 !important;
      border-color: #3d3d5c !important;
    }
    html.dark .nps-btn.selected {
      color: #fff !important;
    }

    /* sidebar */
    html.dark .sidebar {
      background: #12122a !important;
    }
    html.dark .sidebar a,
    html.dark .sidebar .nav-item {
      color: #a5a5c0 !important;
    }
    html.dark .sidebar a:hover,
    html.dark .sidebar a.active,
    html.dark .sidebar .nav-item:hover,
    html.dark .sidebar .nav-item.active {
      background: #252540 !important;
      color: #c4b5fd !important;
    }

    /* misc text overrides */
    html.dark h1, html.dark h2, html.dark h3,
    html.dark h4, html.dark h5, html.dark h6 {
      color: #e4e4e7 !important;
    }
    html.dark p, html.dark span, html.dark label, html.dark div {
      color: inherit;
    }
    html.dark a { color: #c4b5fd; }

    /* card title icon bg */
    html.dark .card-title .ic,
    html.dark .kpi-icon {
      background: #252540 !important;
    }

    /* word cloud, chart cards */
    html.dark .word-cloud span {
      color: #c4b5fd !important;
    }

    /* photo upload area */
    html.dark .upload-area,
    html.dark .photo-upload-zone {
      background: #252540 !important;
      border-color: #3d3d5c !important;
      color: #8888aa !important;
    }

    /* container bg */
    html.dark .container {
      background: #0f0e17 !important;
    }

    /* rating bars */
    html.dark .bar-bg {
      background: #252540 !important;
    }

    /* progress bar bg */
    html.dark .progress-bar,
    html.dark .progress-track {
      background: #252540 !important;
    }

    /* sale history */
    html.dark .sale-item,
    html.dark .history-item {
      background: #252540 !important;
      border-color: #2d2d44 !important;
      color: #e4e4e7 !important;
    }

    /* size buttons */
    html.dark .size-btn {
      background: #252540 !important;
      border-color: #3d3d5c !important;
      color: #d4d4d8 !important;
    }
    html.dark .size-btn.active,
    html.dark .size-btn:hover {
      background: #7c3aed !important;
      color: #fff !important;
    }

    /* discount input area */
    html.dark .discount-section {
      background: #252540 !important;
      border-color: #2d2d44 !important;
    }

    /* emoji rating */
    html.dark .emoji-option {
      background: #252540 !important;
    }
    html.dark .emoji-option.selected {
      background: #7c3aed !important;
    }

    /* QR box */
    html.dark .qr-box,
    html.dark .qr-container {
      background: #fff !important;
      border-radius: 12px;
      padding: 8px;
    }

    /* credit card visual stays light for readability */
    html.dark .credit-card-visual {
      filter: brightness(.9);
    }
  `;
  document.head.appendChild(darkCSS);

  /* --- inject toggle button CSS --- */
  const btnCSS = document.createElement('style');
  btnCSS.textContent = `
    .theme-toggle-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 4px 16px rgba(0,0,0,.2);
      transition: all .3s ease;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      color: #fff;
    }
    .theme-toggle-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(124,58,237,.4);
    }
    .theme-toggle-btn:active {
      transform: scale(.95);
    }
    /* tooltip */
    .theme-toggle-btn::after {
      content: attr(data-tip);
      position: absolute;
      right: 62px;
      top: 50%;
      transform: translateY(-50%);
      background: #1a1a2e;
      color: #fff;
      font-size: .75rem;
      padding: 5px 10px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s;
    }
    .theme-toggle-btn:hover::after {
      opacity: 1;
    }
    html.dark .theme-toggle-btn {
      background: linear-gradient(135deg, #fbbf24, #f97316);
      color: #1a1a2e;
    }
    html.dark .theme-toggle-btn::after {
      background: #e4e4e7;
      color: #1a1a2e;
    }
  `;
  document.head.appendChild(btnCSS);

  /* --- create toggle button --- */
  const btn = document.createElement('button');
  btn.className = 'theme-toggle-btn';
  btn.setAttribute('aria-label', 'Toggle theme');
  document.body.appendChild(btn);

  function applyTheme(dark){
    if(dark){
      document.documentElement.classList.add('dark');
      btn.innerHTML = '☀️';
      btn.setAttribute('data-tip', 'เปลี่ยนเป็นโหมดสว่าง');
    } else {
      document.documentElement.classList.remove('dark');
      btn.innerHTML = '🌙';
      btn.setAttribute('data-tip', 'เปลี่ยนเป็นโหมดมืด');
    }
  }

  /* --- load saved preference --- */
  const saved = localStorage.getItem(KEY);
  const prefersDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  applyTheme(prefersDark);

  /* --- toggle on click --- */
  btn.addEventListener('click', function(){
    const isDark = document.documentElement.classList.contains('dark');
    const next = !isDark;
    localStorage.setItem(KEY, next ? 'dark' : 'light');
    applyTheme(next);
  });
})();
