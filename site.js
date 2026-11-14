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
