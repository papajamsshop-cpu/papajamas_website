/* =============================================================
   PAPA JAMS — app
   (i18n, grilles produits, panier, búsqueda, newsletter)
   ============================================================= */
(function () {
  "use strict";

  var CATALOG = window.PAPA_CATALOG || [];
  var DICT = window.PAPA_I18N || {};
  var LANG_LOCALE = { en: "en-IE", es: "es-ES", fr: "fr-FR" };
  var INITIALS = { novedades: 5, "segunda-mano": 10, preventas: 5, distribucion: 5, merch: 5 };

  var HUES = {
    green: "#2bf04b",
    yellow: "#ffcc00",
    magenta: "#ff2bd1",
    cyan: "#22d3ff",
    white: "#f0efea",
    grey: "#c9c9c9"
  };
  var INK = "#101010";

  var lang = "en";
  var expanded = {};      /* secciones desplegadas con "Ver más" */
  var cart = [];          /* [{ id, size, qty }] */

  /* ---------------------------------------------------------
     i18n
     --------------------------------------------------------- */
  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.en && DICT.en[key]) || key;
  }

  function money(v) {
    try {
      return new Intl.NumberFormat(LANG_LOCALE[lang] || "en-IE", {
        style: "currency", currency: "EUR"
      }).format(v);
    } catch (e) {
      return "€" + v.toFixed(2);
    }
  }

  function dateLabel(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    try {
      return new Intl.DateTimeFormat(LANG_LOCALE[lang] || "en-IE", {
        day: "numeric", month: "short", year: "numeric"
      }).format(d);
    } catch (e) {
      return iso;
    }
  }

  function applyI18n() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"));
      if (v) el.innerHTML = v;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });

    if (DICT[lang] && DICT[lang]["meta.title"]) document.title = DICT[lang]["meta.title"];
    var md = document.querySelector('meta[name="description"]');
    if (md && DICT[lang] && DICT[lang]["meta.desc"]) md.setAttribute("content", DICT[lang]["meta.desc"]);

    document.querySelectorAll(".lang__btn").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });

    renderGrids();
    renderCart();
    if (document.getElementById("searchOverlay").hidden === false) runSearch();
  }

  /* ---------------------------------------------------------
     Portadas generadas (SVG)
     --------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function wrap(text, max) {
    var words = String(text).split(/\s+/), lines = [], line = "";
    words.forEach(function (w) {
      if ((line + " " + w).trim().length > max && line) { lines.push(line); line = w; }
      else { line = (line ? line + " " : "") + w; }
    });
    if (line) lines.push(line);
    return lines.slice(0, 3);
  }

  function svgURI(inner) {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">' + inner + "</svg>"
    );
  }

  function coverVinyl(item) {
    var bg = HUES[item.hue] || HUES.white;
    var lines = wrap(String(item.title).toUpperCase(), 13);
    var titleSize = lines.some(function (l) { return l.length > 11; }) ? 46 : 54;
    var startY = 556 - (lines.length - 1) * (titleSize + 2);

    var s = '<rect width="600" height="600" fill="' + bg + '"/>';
    /* vinyle qui dépasse à droite */
    s += '<circle cx="478" cy="300" r="228" fill="' + INK + '"/>';
    [110, 145, 180, 210].forEach(function (r) {
      s += '<circle cx="478" cy="300" r="' + r + '" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1.5"/>';
    });
    s += '<circle cx="478" cy="300" r="70" fill="' + bg + '"/>';
    s += '<circle cx="478" cy="300" r="7" fill="' + INK + '"/>';
    /* pochette par-dessus (bord gauche) */
    s += '<rect x="0" y="0" width="290" height="600" fill="' + bg + '"/>';
    /* références */
    s += '<text x="36" y="62" font-family="ui-monospace,Menlo,monospace" font-size="23" letter-spacing="4" fill="' + INK + '">' + esc(item.cat || "") + "</text>";
    s += '<text x="36" y="96" font-family="ui-monospace,Menlo,monospace" font-size="17" letter-spacing="3" fill="rgba(16,16,16,.6)">' + esc(item.format || "") + "</text>";
    /* artiste + titre */
    s += '<text x="36" y="404" font-family="ui-monospace,Menlo,monospace" font-size="20" letter-spacing="3.5" fill="rgba(16,16,16,.75)">' + esc(String(item.artist).toUpperCase()) + "</text>";
    lines.forEach(function (l, i) {
      var y = startY + i * (titleSize + 2);
      s += '<text x="34" y="' + y + '" font-family="Georgia,\'Times New Roman\',serif" font-size="' + titleSize + '" fill="' + INK + '">' + esc(l) + "</text>";
    });
    return svgURI(s);
  }

  function coverMerch(item) {
    var bg = HUES[item.hue] || HUES.white;
    var isSticker = /sticker/i.test(item.format || "");
    var s = '<rect width="600" height="600" fill="' + bg + '"/>';

    if (isSticker) {
      s += '<rect x="150" y="150" width="300" height="300" rx="42" fill="' + INK + '" transform="rotate(-8 300 300)"/>';
      s += '<rect x="180" y="196" width="240" height="208" rx="26" fill="' + bg + '" transform="rotate(-8 300 300)"/>';
      s += '<text x="300" y="320" text-anchor="middle" font-family="Georgia,serif" font-size="58" fill="' + INK + '" transform="rotate(-8 300 300)">PAPA</text>';
      s += '<text x="300" y="378" text-anchor="middle" font-family="Georgia,serif" font-size="58" fill="' + INK + '" transform="rotate(-8 300 300)">JAMS</text>';
    } else {
      var shirt =
        "M 205 120 L 268 88 Q 300 132 332 88 L 395 120 L 470 192 L 418 246 L 392 214 L 392 508 " +
        "Q 300 528 208 508 L 208 214 L 182 246 L 130 192 Z";
      s += '<path d="' + shirt + '" fill="' + INK + '"/>';
      s += '<text x="300" y="330" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="' + bg + '">PAPA</text>';
      s += '<text x="300" y="380" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="' + bg + '">JAMS</text>';
    }

    s += '<text x="36" y="62" font-family="ui-monospace,Menlo,monospace" font-size="23" letter-spacing="4" fill="' + INK + '">' + esc(item.cat || "") + "</text>";
    return svgURI(s);
  }

  function coverOf(item) {
    return /merch|sticker|t-shirt/i.test((item.section || "") + " " + (item.format || ""))
      ? coverMerch(item)
      : coverVinyl(item);
  }

  /* ---------------------------------------------------------
     Grilles produits
     --------------------------------------------------------- */
  function badgeFor(item) {
    if (item.sold) return { cls: "sold", key: "badge.sold" };
    if (item.section === "preventas") return { cls: "preorder", key: "badge.preorder" };
    if (item.section === "segunda-mano") return { cls: "used", key: "badge.used" };
    if (item.section === "distribucion") return { cls: "dist", key: "badge.dist" };
    return { cls: "new", key: "badge.new" };
  }

  function tileHTML(item) {
    var badge = badgeFor(item);
    var isMerch = item.sizes && item.sizes.length;
    var h = '<article class="tile" data-id="' + item.id + '">';

    h += '<a class="tile__artwork" href="#' + item.section + '" aria-label="' + esc(item.artist + " — " + item.title) + '">';
    h += '<img src="' + coverOf(item) + '" alt="' + esc(item.artist + " — " + item.title) + '" loading="lazy" />';
    h += '<span class="tile__badge tile__badge--' + badge.cls + '">' + t(badge.key) + "</span></a>";

    h += '<div class="tile__row">';
    if (item.sold) {
      h += '<span class="tile__price tile__price--sold">' + t("badge.sold") + "</span>";
      h += '<button class="tile__add" type="button" disabled>' + t("card.add") + "</button>";
    } else {
      h += '<span class="tile__price">' +
        (item.oldPrice ? "<s>" + money(item.oldPrice) + "</s>" : "") + money(item.price) + "</span>";
      h += '<button class="tile__add" type="button" data-add="' + item.id + '">' + t("card.add") + "</button>";
    }
    h += "</div>";

    h += '<p class="tile__artist">' + esc(item.artist) + "</p>";
    h += '<p class="tile__title">' + esc(item.title) + "</p>";

    var meta = [];
    if (item.label) meta.push(item.label);
    if (item.cat) meta.push(item.cat);
    if (item.condition) meta.push(item.condition);
    if (item.shipDate) meta.push(t("card.ships") + " " + dateLabel(item.shipDate));
    if (meta.length) h += '<p class="tile__meta">' + esc(meta.join(" · ")) + "</p>";

    if (isMerch) {
      h += '<div class="tile__sizes" data-sizes="' + item.id + '">';
      item.sizes.forEach(function (sz) {
        h += '<button class="size" type="button" data-size="' + sz + '">' + sz + "</button>";
      });
      h += "</div>";
    }

    return h + "</article>";
  }

  function renderGrids() {
    document.querySelectorAll("[data-grid]").forEach(function (grid) {
      var section = grid.getAttribute("data-grid");
      var items = CATALOG.filter(function (i) { return i.section === section; });
      var limit = INITIALS[section] || 5;
      var isOpen = !!expanded[section];

      grid.innerHTML = items.map(tileHTML).join("");

      Array.prototype.forEach.call(grid.children, function (tile, idx) {
        if (!isOpen && idx >= limit) tile.classList.add("is-hidden");
      });

      var btn = document.querySelector('[data-more="' + section + '"]');
      if (btn) {
        var more = items.length > limit;
        btn.style.display = more ? "" : "none";
        btn.textContent = isOpen ? t("sec.less") : t("sec.more");
        btn.setAttribute("aria-expanded", String(isOpen));
      }
    });
  }

  /* ---------------------------------------------------------
     Panier
     --------------------------------------------------------- */
  function saveCart() {
    try { localStorage.setItem("papajams-cart", JSON.stringify(cart)); } catch (e) {}
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem("papajams-cart");
      if (raw) cart = JSON.parse(raw) || [];
    } catch (e) { cart = []; }
  }

  function itemById(id) {
    return CATALOG.filter(function (i) { return i.id === id; })[0];
  }

  function addToCart(id, size) {
    var item = itemById(id);
    if (!item || item.sold) return;

    if (item.sizes && item.sizes.length && !size) {
      toast(t("toast.size"), true);
      var el = document.querySelector('[data-sizes="' + id + '"]');
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var found = cart.filter(function (l) { return l.id === id && l.size === (size || null); })[0];
    if (found) found.qty += 1;
    else cart.push({ id: id, size: size || null, qty: 1 });

    saveCart();
    renderCart();
    toast("<b>" + esc(item.artist) + "</b> — " + esc(item.title) + " " + t("toast.added"));
  }

  function cartTotal() {
    return cart.reduce(function (sum, line) {
      var item = itemById(line.id);
      return sum + (item ? item.price * line.qty : 0);
    }, 0);
  }

  function renderCart() {
    var count = cart.reduce(function (n, l) { return n + l.qty; }, 0);
    document.getElementById("cartCount").textContent = count;
    document.getElementById("cartTotal").textContent = money(cartTotal());

    var box = document.getElementById("cartItems");
    if (!cart.length) {
      box.innerHTML = '<p class="cart-empty">' + t("cart.empty") + "</p>";
      return;
    }

    box.innerHTML = cart.map(function (line, idx) {
      var item = itemById(line.id);
      if (!item) return "";
      var h = '<div class="cart-item">';
      h += '<img src="' + coverOf(item) + '" alt="" />';
      h += '<div class="cart-item__info">';
      h += '<p class="cart-item__artist">' + esc(item.artist) + "</p>";
      h += '<p class="cart-item__title">' + esc(item.title) + "</p>";
      if (line.size) h += '<p class="cart-item__meta">' + t("card.sizes") + " " + esc(line.size) + "</p>";
      h += '<div class="qty"><button type="button" data-qty="-1" data-idx="' + idx + '" aria-label="-1">−</button>';
      h += "<span>" + line.qty + "</span>";
      h += '<button type="button" data-qty="1" data-idx="' + idx + '" aria-label="+1">+</button></div>';
      h += "</div>";
      h += '<div><p class="cart-item__price">' + money(item.price * line.qty) + "</p>";
      h += '<button class="tile__add" style="margin-top:10px" type="button" data-del="' + idx + '">' + t("cart.remove") + "</button></div>";
      h += "</div>";
      return h;
    }).join("");
  }

  /* ---------------------------------------------------------
     Búsqueda / recherche
     --------------------------------------------------------- */
  function runSearch() {
    var q = document.getElementById("searchInput").value.trim().toLowerCase();
    var box = document.getElementById("searchResults");

    if (!q) {
      box.innerHTML = '<p class="result__empty">' + t("search.placeholder") + "</p>";
      return;
    }

    var hits = CATALOG.filter(function (i) {
      return [i.artist, i.title, i.label, i.cat, i.genre]
        .filter(Boolean)
        .join(" ").toLowerCase().indexOf(q) > -1;
    }).slice(0, 30);

    if (!hits.length) {
      box.innerHTML = '<p class="result__empty">' + t("search.none") + "</p>";
      return;
    }

    box.innerHTML = hits.map(function (i) {
      return '<div class="result">' +
        '<img src="' + coverOf(i) + '" alt="" />' +
        '<div class="result__info"><p class="result__artist">' + esc(i.artist) + "</p>" +
        '<p class="result__title">' + esc(i.title) + " — " + esc(i.label || "") + "</p></div>" +
        '<span class="result__price">' + (i.sold ? t("badge.sold") : money(i.price)) + "</span>" +
        (i.sold ? "" : '<button class="tile__add" type="button" data-add="' + i.id + '">' + t("card.add") + "</button>") +
        "</div>";
    }).join("");
  }

  /* ---------------------------------------------------------
     Toast
     --------------------------------------------------------- */
  var toastTimer;
  function toast(html, isError) {
    var el = document.getElementById("toast");
    el.innerHTML = html;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2800);
  }

  /* ---------------------------------------------------------
     UI : menús, cajón, overlay
     --------------------------------------------------------- */
  function openDrawer(open) {
    document.getElementById("cartDrawer").classList.toggle("is-open", open);
    document.getElementById("cartDrawer").setAttribute("aria-hidden", String(!open));
    document.getElementById("cartBackdrop").hidden = !open;
  }

  function openSearch(open) {
    var ov = document.getElementById("searchOverlay");
    ov.hidden = !open;
    if (open) {
      runSearch();
      setTimeout(function () { document.getElementById("searchInput").focus(); }, 40);
    }
  }

  function closeMenu() {
    document.getElementById("menu").classList.remove("is-open");
    document.getElementById("burger").classList.remove("is-open");
    document.getElementById("burger").setAttribute("aria-expanded", "false");
  }

  function bindEvents() {
    /* langües */
    document.querySelectorAll(".lang__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        lang = b.getAttribute("data-lang");
        try { localStorage.setItem("papajams-lang", lang); } catch (e) {}
        applyI18n();
      });
    });

    /* menú móvil */
    document.getElementById("burger").addEventListener("click", function () {
      var menu = document.getElementById("menu");
      var open = menu.classList.toggle("is-open");
      this.classList.toggle("is-open", open);
      this.setAttribute("aria-expanded", String(open));
    });

    /* desplegable escritorio */
    var dd = document.getElementById("ddShop");
    dd.querySelector(".menu__toggle").addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle("is-open");
      this.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!dd.contains(e.target)) dd.classList.remove("is-open");
    });

    /* cierre del menú al navegar */
    document.querySelectorAll("#menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
        dd.classList.remove("is-open");
      });
    });

    /* "Ver más" */
    document.querySelectorAll("[data-more]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sec = btn.getAttribute("data-more");
        expanded[sec] = !expanded[sec];
        renderGrids();
      });
    });

    /* clics génériques : añadir / tallas / cantidades */
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      if (add) {
        var id = add.getAttribute("data-add");
        var sizesBox = document.querySelector('[data-sizes="' + id + '"]');
        var active = sizesBox && sizesBox.querySelector(".size.is-active");
        addToCart(id, active ? active.getAttribute("data-size") : null);
        return;
      }

      var size = e.target.closest(".size");
      if (size) {
        size.parentNode.querySelectorAll(".size").forEach(function (s) { s.classList.remove("is-active"); });
        size.classList.add("is-active");
        return;
      }

      var qty = e.target.closest("[data-qty]");
      if (qty) {
        var idx = +qty.getAttribute("data-idx");
        var delta = +qty.getAttribute("data-qty");
        if (cart[idx]) {
          cart[idx].qty += delta;
          if (cart[idx].qty <= 0) cart.splice(idx, 1);
          saveCart();
          renderCart();
        }
        return;
      }

      var del = e.target.closest("[data-del]");
      if (del) {
        cart.splice(+del.getAttribute("data-del"), 1);
        saveCart();
        renderCart();
      }
    });

    /* carrito */
    document.getElementById("cartBtn").addEventListener("click", function () { openDrawer(true); });
    document.getElementById("cartClose").addEventListener("click", function () { openDrawer(false); });
    document.getElementById("cartBackdrop").addEventListener("click", function () { openDrawer(false); });
    document.getElementById("checkoutBtn").addEventListener("click", function () {
      if (!cart.length) { toast(t("toast.cartEmpty"), true); return; }
      toast(t("toast.checkout"));
      cart = [];
      saveCart();
      renderCart();
      openDrawer(false);
    });

    /* cuenta (demo) */
    document.getElementById("accountBtn").addEventListener("click", function () { toast(t("toast.soon")); });

    /* búsqueda */
    document.getElementById("searchBtn").addEventListener("click", function () { openSearch(true); });
    document.getElementById("searchClose").addEventListener("click", function () { openSearch(false); });
    document.getElementById("searchInput").addEventListener("input", runSearch);
    document.getElementById("searchOverlay").addEventListener("click", function (e) {
      if (e.target === this) openSearch(false);
    });

    /* newsletter */
    document.getElementById("newsletter").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("email");
      var msg = document.getElementById("formMsg");
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      msg.textContent = ok ? t("news.ok") : t("news.err");
      msg.classList.toggle("is-error", !ok);
      if (ok) { input.value = ""; toast(t("news.ok")); }
    });

    /* escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { openSearch(false); openDrawer(false); closeMenu(); }
    });
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  function init() {
    var saved = null;
    try { saved = localStorage.getItem("papajams-lang"); } catch (e) {}
    if (saved && DICT[saved]) {
      lang = saved;
    } else {
      var nav = (navigator.language || "en").slice(0, 2);
      if (DICT[nav]) lang = nav;
    }

    loadCart();
    bindEvents();
    applyI18n();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
