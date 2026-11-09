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
