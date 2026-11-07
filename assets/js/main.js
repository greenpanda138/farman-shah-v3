// Farman Shah v3 — vanilla JS only. No libraries, no WebGL.
// 1. Reveal on scroll (opacity + translate only, IntersectionObserver).
// 2. Signature interaction: the hero demo preview swaps per job type.
document.documentElement.classList.add("js");

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

var reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(function (el) { observer.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add("is-in"); });
}

var jobs = {
  fullstack: {
    kicker: "A complete website, front to back",
    headline: "Designed, built, and launched — and you own the code from day one.",
    detail: "Front end + back end + launch",
    cta: "Email me"
  },
  ads: {
    kicker: "Ads, reported in plain words",
    headline: "Your ads, managed monthly — spend you can follow, results you can read.",
    detail: "Monthly management · plain-word reporting",
    cta: "Ask about ads"
  }
};

var tabs = document.querySelectorAll(".demo-tab");
var screen = document.getElementById("demo-screen");
var kicker = document.getElementById("demo-kicker");
var headline = document.getElementById("demo-headline");
var detail = document.getElementById("demo-detail");
var cta = document.getElementById("demo-cta");

function showJob(key) {
  var job = jobs[key];
  if (!job) return;
  function swap() {
    kicker.textContent = job.kicker;
    headline.textContent = job.headline;
    detail.textContent = job.detail;
    cta.textContent = job.cta;
    screen.classList.remove("is-switching");
  }
  if (reduceMotion) { swap(); return; }
  screen.classList.add("is-switching");
  setTimeout(swap, 200);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (t) {
      t.classList.remove("is-active");
      t.setAttribute("aria-pressed", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-pressed", "true");
    showJob(tab.getAttribute("data-job"));
  });
});
