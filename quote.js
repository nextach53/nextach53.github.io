// NEXTACH website quotation (23-11-2026). The customer chooses products + requirement + details; Super Admin makes the
// quotation PDF in our format and sends it to the customer's WhatsApp (POST checkin.nextach.in/api/quote).
// The estimate shown here uses quote.json (written by Super Admin -> Publish from the Price List) and the SAME rules as
// Super Admin (_quote_wanted in sa_app.py) - change both together.
(function () {
  var API = "https://checkin.nextach.in/api/quote";
  var WA = "919109955733";
  var HOME = "Madhya Pradesh", GST = 18;
  var STATES = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
    "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Outside India"];
  // product -> its requirement fields (key, label, default, min, max)
  var PRODUCTS = [
    { p: "BOOK", name: "NEXTACH BOOK", what: "Accounts, billing, GST & stock", img: "product_book.png",
      fields: [["users", "Users (including Admin)", 3, 1, 500], ["branches", "Companies / branches", 1, 1, 100],
               ["locations", "Stock locations (godowns / stores) in total", 1, 1, 200]] },
    { p: "PUNCH", name: "NEXTACH PUNCH", what: "Staff attendance & payroll (Android)", img: "product_punch.png",
      fields: [["users", "Users (including Admin)", 3, 1, 500], ["employees", "Employees", 5, 1, 10000]] },
    { p: "FEE", name: "NEXTACH FEE", what: "Coaching & tutorial institutes", img: "product_fee.png",
      fields: [["users", "Users (including Admin)", 3, 1, 500], ["branches", "Branches", 1, 1, 100]] },
    { p: "DORMA", name: "NEXTACH DORMA", what: "Hostels & PGs", img: "product_dorma.png",
      fields: [["users", "Users (including Admin)", 3, 1, 500], ["branches", "Branches / hostels", 1, 1, 100]] }
  ];
  var PRICE = {}, chosen = {}, req = {};
  var $ = function (id) { return document.getElementById(id); };
  var form = $("q-form");

  function inr(n) {
    var s = String(Math.round(n || 0)), head = s.slice(0, -3), tail = s.slice(-3);
    return "₹" + (head ? head.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + tail : tail);
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function clamp(v, lo, hi, d) { v = parseInt(v, 10); return isNaN(v) ? d : Math.max(lo, Math.min(hi, v)); }

  // ---- the same rules as Super Admin
  function wanted() {
    var out = [], idx = {};
    function add(code, qty) { if (qty > 0) { if (code in idx) out[idx[code]].qty += qty; else { idx[code] = out.length; out.push({ code: code, qty: qty }); } } }
    PRODUCTS.forEach(function (d) {
      var p = d.p; if (!chosen[p]) return;
      var r = req[p] || {}, pair = p === "PUNCH" && chosen.BOOK;
      add("NX-" + p, 1);
      if (!pair) add("NX-BCMS", 1);
      // 23-11-2026: NEXTACH ACCESS = support & consultancy only; every login, company / branch and PUNCH employee is charged
      add("NX-AUSS", clamp(r.users, 1, 500, 1));
      var br = p === "PUNCH" ? 1 : clamp(r.branches, 1, 100, 1);
      add("NX-ABRS", pair ? 0 : br);
      if (p === "BOOK") add("NX-ALCS", clamp(r.locations, 1, 200, 1) - br);
      if (p === "PUNCH") add("NX-AEMS", clamp(r.employees, 1, 10000, 5));
      if (r.remote) add("NX-ONSP", 1);
    });
    return out;
  }

  function drawProducts() {
    $("q-prods").innerHTML = PRODUCTS.map(function (d) {
      return '<label class="q-prod"><input type="checkbox" value="' + d.p + '"><img src="' + d.img + '" alt=""><span><b>' + d.name +
        "</b><small>" + d.what + "</small></span></label>";
    }).join("");
    $("q-prods").querySelectorAll("input").forEach(function (cb) {
      cb.addEventListener("change", function () { chosen[cb.value] = cb.checked; cb.closest(".q-prod").classList.toggle("on", cb.checked); drawReqs(); calc(); });
    });
    var ref = (location.search.match(/[?&]ref=([A-Za-z0-9-]{4,20})/) || [])[1];    // quote.html?ref=NX-AB12CD fills the referral code
    if (ref) form.ref_code.value = ref.toUpperCase();
    var want = (location.hash.match(/(book|punch|fee|dorma)/gi) || []);           // quote.html#book+punch preselects
    want.forEach(function (w) { var cb = $("q-prods").querySelector('input[value="' + w.toUpperCase() + '"]'); if (cb) { cb.checked = true; cb.dispatchEvent(new Event("change")); } });
  }

  function drawReqs() {
    var any = false;
    $("q-reqs").innerHTML = PRODUCTS.filter(function (d) { return chosen[d.p]; }).map(function (d) {
      any = true;
      var r = req[d.p] = req[d.p] || {};
      return '<div class="q-req"><h4><img src="' + d.img + '" alt="">' + d.name + "</h4><div class=\"q-grid\">" +
        d.fields.map(function (f) {
          if (r[f[0]] == null) r[f[0]] = f[2];
          return "<label>" + f[1] + '<input type="number" min="' + f[3] + '" max="' + f[4] + '" value="' + r[f[0]] + '" data-p="' + d.p + '" data-k="' + f[0] + '"></label>';
        }).join("") +
        '<label class="q-check"><input type="checkbox" data-p="' + d.p + '" data-k="remote"' + (r.remote ? " checked" : "") + "> " +
        // 25-11-2026: for PUNCH the online service = location punching (staff at other sites punch by GPS in PUNCH Wave)
        (d.p === "PUNCH" ? "Location punching (staff at branches / sites punch by GPS in PUNCH Wave; face and Bluetooth punching are free)"
                         : "Remote login (use it from a browser / mobile outside your office)") + "</label></div></div>";
    }).join("") || '<p class="q-hint">Choose a product above.</p>';
    $("q-reqs").querySelectorAll("input").forEach(function (i) {
      i.addEventListener("input", function () { req[i.dataset.p][i.dataset.k] = i.type === "checkbox" ? i.checked : i.value; calc(); });
    });
    $("q-pair").hidden = !(chosen.BOOK && chosen.PUNCH);
    if (!any) $("q-lines").innerHTML = '<p class="q-hint">Choose a product to see the price.</p>';
  }

  function calc() {
    var lines = wanted();
    if (!lines.length) return;
    if (!Object.keys(PRICE).length) { $("q-lines").innerHTML = '<p class="q-hint">Your quotation will show the prices.</p>'; return; }
    var net = 0, rows = lines.map(function (l) {
      var it = PRICE[l.code]; if (!it) return "";
      var amt = l.qty * it.offer; net += amt;
      return "<tr><td>" + esc(it.details.replace(/ \(Free Software\)$/, "")) + (l.qty > 1 ? " × " + l.qty : "") + "</td><td class=\"r\">" +
        (amt ? inr(amt) : (it.price ? "<s>" + inr(it.price * l.qty) + "</s> " : "") + "<b>Free</b>") + "</td></tr>";
    }).join("");
    var st = form.state.value, gstin = (form.gstin.value || "").toUpperCase();
    var rate = st === "Outside India" ? 0 : GST, intra = st === HOME || gstin.slice(0, 2) === "23";
    var tax = rate ? (intra ? 2 * Math.round(net * rate / 200) : Math.round(net * rate / 100)) : 0;
    $("q-lines").innerHTML = '<table class="q-tab">' + rows + '<tr class="q-net"><td>Net amount (per year)</td><td class="r">' + inr(net) + "</td></tr>" +
      "<tr><td>" + (rate ? (st ? (intra ? "CGST 9% + SGST 9%" : "IGST 18%") : "GST 18%") : "GST - not applicable") + '</td><td class="r">' + inr(tax) + "</td></tr>" +
      '<tr class="q-total"><td>Grand total</td><td class="r">' + inr(net + tax) + "</td></tr></table>";
  }

  function msg(html, ok) { var m = $("q-msg"); m.className = "q-msg " + (ok ? "ok" : "bad"); m.innerHTML = html; }

  function waFallback() {
    var f = form, names = PRODUCTS.filter(function (d) { return chosen[d.p]; }).map(function (d) {
      var r = req[d.p] || {};
      return d.name + " (" + d.fields.map(function (x) { return x[1].split(" (")[0] + ": " + r[x[0]]; }).join(", ") + (r.remote ? (d.p === "PUNCH" ? ", location punching" : ", remote login") : "") + ")";
    });
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent("Hello NEXTACH, please send me a quotation.\n\n" + names.join("\n") +
      "\n\nCompany: " + f.name.value + "\nContact: " + f.person.value + "\nCity: " + f.city.value + ", " + f.state.value +
      (f.gstin.value ? "\nGSTIN: " + f.gstin.value : "") + (f.ref_code.value ? "\nReferral code: " + f.ref_code.value : "") +
      (f.notes.value ? "\nNeed: " + f.notes.value : ""));
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = form;
    if (!Object.keys(chosen).some(function (k) { return chosen[k]; })) return msg("Please choose at least one product.");
    if (!f.name.value.trim() || !f.person.value.trim()) return msg("Please enter the company name and the contact person.");
    if ((f.mobile.value.match(/\d/g) || []).length < 10) return msg("Please enter your WhatsApp number - the quotation is sent there.");
    if (!f.city.value.trim() || !f.state.value) return msg("Please enter your city and state.");
    var body = { products: {}, notes: f.notes.value, website: f.website.value, ref_code: f.ref_code.value,
      company: { name: f.name.value, person: f.person.value, mobile: f.mobile.value, email: f.email.value, city: f.city.value,
                 state: f.state.value, gstin: f.gstin.value } };
    PRODUCTS.forEach(function (d) { if (chosen[d.p]) body.products[d.p] = req[d.p] || {}; });
    var btn = $("q-send"); btn.disabled = true; msg("Making your quotation…", true);
    fetch(API, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        btn.disabled = false;
        if (!x.ok) return msg(esc(x.d.error || "Sorry, something went wrong.") + ' <a href="' + waFallback() + '" target="_blank" rel="noopener">Send your request on WhatsApp instead</a>.');
        msg("✅ <b>Thank you!</b> Your quotation <b>" + esc(x.d.no) + "</b> (grand total <b>" + inr(x.d.total) + "</b>) is on its way to WhatsApp <b>" +
          esc(x.d.mobile) + "</b> - usually within a few minutes. Reply there to go ahead or to change anything.", true);      })
      .catch(function () {
        btn.disabled = false;
        msg('Our quotation service is busy right now. <a href="' + waFallback() + '" target="_blank" rel="noopener"><b>Send your request on WhatsApp</b></a> - we reply the same day.');
      });
  });

  $("q-state").innerHTML += STATES.map(function (s) { return '<option>' + s + "</option>"; }).join("");
  form.state.addEventListener("change", calc);
  form.gstin.addEventListener("input", calc);
  drawProducts();
  fetch("quote.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (d) {
    (d.items || []).forEach(function (it) { PRICE[it.code] = it; });
    if (d.home_state) HOME = d.home_state;
    if (d.gst_rate != null) GST = d.gst_rate;
    calc();
  }).catch(function () {});
})();
