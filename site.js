// NEXTACH website: WhatsApp buttons (Customer Care) and the scroll animation.
// Change the WhatsApp number here only.
var WA = "919109955733";

function waLink(text) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text); }
function external(a) { a.target = "_blank"; a.rel = "noopener"; }

document.querySelectorAll("[data-product]").forEach(function (box) {
  var name = box.getAttribute("data-product");
  box.querySelectorAll(".act").forEach(function (a) {
    a.href = waLink("Hello NEXTACH, I would like more information about " + name + " and its activation."
      + "\n\nCompany name: \nCity: ");
    external(a);
  });
});

// Download buttons: the setup / APK in the GitHub release "installers" (file name kept up to date by Super Admin -> Publish)
var DL = "https://github.com/nextach53/nextach53.github.io/releases/download/installers/";
document.querySelectorAll("a.dl[data-file]").forEach(function (a) {
  a.href = DL + encodeURIComponent(a.getAttribute("data-file"));
  a.setAttribute("download", "");
  // 17-11-2026: count the download in NEXTACH Super Admin (file, page; country and device are added there - no IP kept).
  // The file itself still comes straight from GitHub, so a download never waits for or depends on this count.
  a.addEventListener("click", function () {
    try {
      var body = JSON.stringify({ file: a.getAttribute("data-file"), page: location.pathname + location.search + location.hash });   // ?update=1 = update message link
      if (navigator.sendBeacon) navigator.sendBeacon("https://checkin.nextach.in/api/dl", new Blob([body], { type: "text/plain" }));
    } catch (e) {}
    installHelp(a.getAttribute("data-file"), (a.closest("[data-product]") || a).getAttribute("data-product") || "NEXTACH");
  });
});

// 19-11-2026: the download goes on; this box explains the warnings Windows / Android show for new software, so a customer
// does not think the setup is unsafe and stop. Windows steps for the .exe, Android steps for the .apk.
function installHelp(file, name) {
  var apk = /\.apk$/i.test(file || "");
  var steps = apk ? [
    ["Chrome says “File might be harmful”", "Tap <b>Download anyway</b>. Chrome says this for every app that is not from the Play Store."],
    ["“Not allowed to install unknown apps”", "Tap <b>Settings</b> → turn on <b>Allow from this source</b> → go back → tap <b>Install</b>."],
    ["Play Protect: “Unsafe app blocked” / “Scan app”", "Tap <b>More details</b> → <b>Install anyway</b> (or <b>Scan app</b>, then <b>Install</b>). Our app is new, so Google does not know it yet."],
    ["Updating the app?", "Install it over the old one - <b>do not uninstall</b> the old app first, that deletes the data on the phone."]
  ] : [
    ["Browser: “not commonly downloaded”", "Edge / Chrome: click <b>⋯</b> next to the file → <b>Keep</b> → <b>Keep anyway</b>."],
    ["Blue box: “Windows protected your PC”", "Click <b>More info</b> → <b>Run anyway</b>. Windows shows this for every new program it has not seen often yet."],
    ["“Smart App Control blocked part of this app”", "Windows 11 cannot be told to skip this one. Just WhatsApp us - we install it for you, free, by remote connection."],
    ["Your antivirus asks", "Choose <b>Allow</b> / <b>Trust</b>. Updating? Install in the <b>same folder</b> as before - your data stays."]
  ];
  var box = document.createElement("div");
  box.className = "zoom ibox";
  box.innerHTML = '<div class="ib-card" role="dialog" aria-modal="true" aria-labelledby="ib-t">'
    + '<button type="button" class="ib-x" aria-label="Close">×</button>'
    + '<p class="ib-ok">✅ Your download of <b></b> has started</p>'
    + '<h3 id="ib-t">' + (apk ? "Installing on your Android phone" : "Installing on your Windows PC") + '</h3>'
    + '<p class="ib-why">NEXTACH ' + (apk ? "apps are" : "software is") + ' new, so ' + (apk ? "Android" : "Windows")
    + ' may show a warning. <b>This is normal and safe</b> - the file comes straight from our official site nextach.in. Here is what to tap:</p>'
    + '<ol class="ib-steps">' + steps.map(function (s) { return "<li><b>" + s[0] + "</b><span>" + s[1] + "</span></li>"; }).join("") + "</ol>"
    + '<p class="ib-safe">🔒 Download NEXTACH only from <b>nextach.in</b> or from our WhatsApp. Stuck at any step? We help you install it.</p>'
    + '<div class="ib-act"><a class="btn btn-wa ib-wa">WhatsApp us for help</a><button type="button" class="btn btn-main ib-close">OK, got it</button></div></div>';
  box.querySelector(".ib-ok b").textContent = name;
  var wa = box.querySelector(".ib-wa");
  wa.href = waLink("Hello NEXTACH, I need help installing " + name + " (" + (file || "") + ").");
  external(wa);
  function close() { box.remove(); }
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  box.querySelector(".ib-x").addEventListener("click", close);
  box.querySelector(".ib-close").addEventListener("click", close);
  document.body.appendChild(box);
  box.querySelector(".ib-close").focus({ preventScroll: true });
}

document.querySelectorAll(".wa-help").forEach(function (a) {
  a.href = waLink("Hello NEXTACH, I would like to know more about your software.");
  external(a);
});

document.querySelectorAll(".wa-biz").forEach(function (a) {    // 14-11-2026: Businesses section
  a.href = waLink("Hello NEXTACH, I would like a free demo for my business."
    + "\n\nBusiness type (supermarket / wholesaler / distributor / dealer / manufacturer / other): \nCountry: \nCity: ");
  external(a);
});

document.querySelectorAll(".wa-refer").forEach(function (a) {
  a.href = waLink("Hello NEXTACH, I would like to know more about Refer & Earn.");
  external(a);
});

// 14-11-2026 / 15-11-2026: screen tour inside every product - a numbered tab shows its real screen; "View larger" opens it
document.querySelectorAll(".p-tour").forEach(function (tour) {
  var img = tour.querySelector(".tour-img"), tabs = tour.querySelectorAll(".tour-tabs button"), loaded = false;
  var name = tour.closest("[data-product]").getAttribute("data-product");
  function preload() {        // the other screens load once this tour is near, so a tab switches at once
    if (loaded) return; loaded = true;
    tabs.forEach(function (b) { new Image().src = b.getAttribute("data-img"); });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { preload(); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(tour);
  } else preload();
  tabs.forEach(function (b, k) {
    b.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.toggle("on", t === b); t.setAttribute("aria-selected", t === b); });
      img.src = b.getAttribute("data-img");
      img.alt = name + " " + b.lastChild.textContent + " screen with demonstration data";
      tour.querySelector(".tour-n").textContent = "Screen " + ("0" + (k + 1)).slice(-2);
      tour.querySelector(".tour-t").textContent = b.getAttribute("data-t");
      tour.querySelector(".tour-d").textContent = b.getAttribute("data-d");
    });
  });
  tour.querySelector(".tour-big").addEventListener("click", function () {
    var box = document.createElement("div");
    box.className = "zoom";
    box.innerHTML = '<img alt=""><span>×</span>';
    box.firstChild.src = img.src;
    box.firstChild.alt = img.alt;
    box.addEventListener("click", function () { box.remove(); });
    document.body.appendChild(box);
  });
});

// 14-11-2026: "Ask us" panel - the question goes to the developer's WhatsApp (DEV_WA), not Customer Care
var DEV_WA = "917000215253";
(function () {
  var panel = document.getElementById("ask-panel"), btn = document.querySelector(".ask-btn");
  if (!panel) return;
  var topics = panel.querySelectorAll(".ask-topics button"), q = document.getElementById("ask-q"), send = document.getElementById("ask-send");
  function open(on) {
    panel.hidden = !on;
    btn.setAttribute("aria-expanded", on);
    if (on) q.focus();
  }
  function link() {
    var topic = panel.querySelector(".ask-topics .on").textContent;
    send.href = "https://wa.me/" + DEV_WA + "?text=" + encodeURIComponent("Hello NEXTACH, I have a question about: " + topic
      + (q.value.trim() ? "\n\n" + q.value.trim() : "") + "\n\nName: \nCity: ");
  }
  topics.forEach(function (t) {
    t.addEventListener("click", function () { topics.forEach(function (x) { x.classList.toggle("on", x === t); }); link(); });
  });
  q.addEventListener("input", link);
  external(send); link();
  document.querySelectorAll(".ask-open").forEach(function (b) { b.addEventListener("click", function () { open(panel.hidden); }); });
  panel.querySelector(".ask-x").addEventListener("click", function () { open(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { open(false); var z = document.querySelector(".zoom"); if (z) z.remove(); } });
})();

// fade sections in as they scroll into view (without this script everything simply shows)
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("anim");
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); seen.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { seen.observe(el); });
}

// The real screens of every product (11-11-2026): one after the other in its phone / browser frame; a button below shows that screen
document.querySelectorAll(".shots").forEach(function (box) {
  var imgs = box.querySelectorAll("img"), art = box.closest(".p-art"), tabs = art ? art.querySelectorAll(".ph-tabs button") : [], i = 0, timer = null;
  if (imgs.length < 2) return;
  function show(n) {
    i = n % imgs.length;
    imgs.forEach(function (im, k) { im.classList.toggle("on", k === i); });
    tabs.forEach(function (t, k) { t.classList.toggle("on", k === i); });
  }
  function run() { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, 3500); }
  tabs.forEach(function (t, k) { t.addEventListener("click", function () { show(k); run(); }); });
  if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) run();
});
