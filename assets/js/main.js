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
  screen.setAttribute("data-job", key);
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

// 3. Flashy layer (council-approved only): magnetic buttons, cursor spotlight,
//    subtle tilt on project cards. Fine-pointer devices only; off for reduced motion.
var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer && !reduceMotion) {
  // Magnetic buttons: drift toward the pointer, spring back on leave.
  document.querySelectorAll(".magnetic").forEach(function (el) {
    var tx = 0, ty = 0, pressed = false;
    function apply() {
      el.style.transform = "translate(" + tx + "px," + ty + "px)" + (pressed ? " scale(.97)" : "");
    }
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      tx = Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) * 0.25));
      ty = Math.max(-8, Math.min(8, (e.clientY - (r.top + r.height / 2)) * 0.3));
      apply();
    });
    el.addEventListener("mouseleave", function () { tx = 0; ty = 0; apply(); });
    el.addEventListener("mousedown", function () { pressed = true; apply(); });
    el.addEventListener("mouseup", function () { pressed = false; apply(); });
  });

  // Cursor spotlight: one soft glow following the pointer (rAF-throttled).
  var spot = document.querySelector(".spotlight");
  var sx = -600, sy = -600, spotOn = false, spotQueued = false;
  function paintSpot() {
    spotQueued = false;
    spot.style.transform = "translate3d(" + (sx - 240) + "px," + (sy - 240) + "px,0)";
    if (!spotOn) { spot.classList.add("is-on"); spotOn = true; }
  }
  window.addEventListener("mousemove", function (e) {
    sx = e.clientX; sy = e.clientY;
    if (!spotQueued) { spotQueued = true; requestAnimationFrame(paintSpot); }
  }, { passive: true });

  // Project cards: subtle tilt, max ~4deg, reset on leave.
  document.querySelectorAll(".project.tilt").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var rx = -((e.clientY - r.top) / r.height - 0.5) * 4;
      var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
      card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
    });
    card.addEventListener("mouseleave", function () { card.style.transform = ""; });
  });
}
