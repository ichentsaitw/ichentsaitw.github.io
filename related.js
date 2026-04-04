/**
 * related.js — IC 的個人研究室 · 相關網頁推薦
 * 用法：在任意子站底部加上
 *   <div id="related-pages" data-site="your-site-id"></div>
 *   <script src="https://ichentsaitw.github.io/related.js"></script>
 */
(function () {
  'use strict';

  const MANIFEST = 'https://ichentsaitw.github.io/projects.json';

  function init() {
    var el = document.getElementById('related-pages');
    if (!el) return;
    var currentSite = el.getAttribute('data-site');
    if (!currentSite) return;

    fetch(MANIFEST)
      .then(function (r) { return r.json(); })
      .then(function (projects) { render(el, currentSite, projects); })
      .catch(function () {});
  }

  function score(kwA, kwB) {
    var s = 0;
    for (var i = 0; i < kwA.length; i++) {
      for (var j = 0; j < kwB.length; j++) {
        if (kwA[i] === kwB[j]) s += 2;
        else if (kwA[i].indexOf(kwB[j]) !== -1 || kwB[j].indexOf(kwA[i]) !== -1) s += 1;
      }
    }
    return s;
  }

  function render(el, currentSite, projects) {
    var current = null;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].site_id === currentSite) { current = projects[i]; break; }
    }
    if (!current || !current.keywords || !current.keywords.length) return;

    var candidates = projects.filter(function (p) {
      return p.site_id !== currentSite && p.image && p.url;
    });

    candidates.sort(function (a, b) {
      var sa = score(current.keywords, a.keywords || []);
      var sb = score(current.keywords, b.keywords || []);
      if (sb !== sa) return sb - sa;
      return (b.date > a.date) ? 1 : -1;
    });

    var top = candidates.slice(0, 3);
    if (!top.length) return;

    injectStyles();

    el.innerHTML =
      '<div class="rp-wrap">' +
        '<div class="rp-heading">你可能也想看</div>' +
        '<div class="rp-grid">' +
          top.map(function (p) {
            var tag = p.tag ? '<span class="rp-tag">' + esc(p.tag) + '</span>' : '';
            return (
              '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" class="rp-card">' +
                '<div class="rp-thumb"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>' +
                '<div class="rp-body">' +
                  tag +
                  '<div class="rp-title">' + esc(p.title) + '</div>' +
                  '<div class="rp-desc">' + esc(p.desc) + '</div>' +
                '</div>' +
              '</a>'
            );
          }).join('') +
        '</div>' +
      '</div>';
  }

  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var stylesInjected = false;
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    var style = document.createElement('style');
    style.textContent = [
      '.rp-wrap{max-width:800px;margin:0 auto;padding:36px 20px 48px;border-top:1px solid rgba(0,0,0,.07);}',
      '.rp-heading{font-size:.75em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#A69E97;margin-bottom:16px;}',
      '.rp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}',
      '.rp-card{display:flex;flex-direction:column;background:#fff;border-radius:14px;overflow:hidden;',
        'border:1px solid #EDE6DD;box-shadow:0 2px 8px rgba(44,40,37,.05);',
        'text-decoration:none;color:inherit;transition:transform .2s,box-shadow .2s;}',
      '.rp-card:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(44,40,37,.1);}',
      '.rp-thumb{width:100%;height:130px;overflow:hidden;flex-shrink:0;}',
      '.rp-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .4s;display:block;}',
      '.rp-card:hover .rp-thumb img{transform:scale(1.06);}',
      '.rp-body{padding:12px 14px 14px;flex:1;display:flex;flex-direction:column;}',
      '.rp-tag{font-size:.68em;font-weight:700;color:#B8A99A;margin-bottom:4px;}',
      '.rp-title{font-size:.9em;font-weight:700;line-height:1.4;color:#2C2825;margin-bottom:5px;}',
      '.rp-desc{font-size:.78em;color:#6B6460;line-height:1.5;flex:1;}',
      '@media(max-width:560px){.rp-grid{grid-template-columns:1fr;}}'
    ].join('');
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
