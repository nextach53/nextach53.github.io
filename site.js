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
  });
});

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

// 15-11-2026: "Watch the video" - the product's Hindi intro video plays in a full-screen box (loaded only when asked)
document.querySelectorAll(".vid[data-video]").forEach(function (b) {
  b.addEventListener("click", function () {
    var box = document.createElement("div");
    box.className = "zoom vbox";
    box.innerHTML = '<video controls autoplay playsinline preload="auto"></video><span role="button" aria-label="Close">×</span>';
    var v = box.firstChild;
    v.src = b.getAttribute("data-video");
    v.poster = b.getAttribute("data-poster");
    v.setAttribute("aria-label", b.getAttribute("data-title") + " intro video");
    box.addEventListener("click", function (e) { if (e.target !== v) { v.pause(); box.remove(); } });
    document.body.appendChild(box);
  });
});

// 14-11-2026: "Ask us" panel - the question goes to the developer's WhatsApp (DEV_WA), not Customer Care
var DEV_WA = "917000215253";
(function () {
  var panel = document.getElementById("ask-panel"), nudge = document.getElementById("ask-nudge"), btn = document.querySelector(".ask-btn");
  if (!panel) return;
  var topics = panel.querySelectorAll(".ask-topics button"), q = document.getElementById("ask-q"), send = document.getElementById("ask-send");
  function open(on) {
    panel.hidden = !on; nudge.hidden = true;
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
  setTimeout(function () { if (panel.hidden) nudge.hidden = false; }, 8000);
  nudge.addEventListener("click", function () { open(true); });
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
