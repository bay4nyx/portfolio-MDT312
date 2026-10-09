const tracks = [
  { title: "The Archer", artist: "Taylor Swift", src: "music/the-archer.mp3" },
  { title: "All I Want", artist: "Olivia Rodrigo", src: "music/all-i-want.mp3" },
  { title: "Legendary Lovers", artist: "Katy Perry", src: "music/legendary-lovers.mp3" },
  { title: "Ain't No Mountain High Enough", artist: "Marvin Gaye, Tammi Terrell", src: "music/aint-no-mountain-high-enough.mp3" }
];

let current = 0;
const audio = new Audio();
audio.volume = 0.5;

function fmt(s) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return m + ":" + String(r).padStart(2, "0");
}

function setupJukebox() {
  const box = document.getElementById("jukebox");
  if (!box) return;

  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const seek = document.getElementById("seek");
  const vol = document.getElementById("volume");
  const cur = document.getElementById("curtime");
  const dur = document.getElementById("durtime");
  const count = document.getElementById("trackcount");
  const title = document.getElementById("trackname");
  const artist = document.getElementById("trackartist");
  const list = document.getElementById("playlist");

  tracks.forEach(function (t, i) {
    const li = document.createElement("li");
    li.textContent = t.title;
    li.onclick = function () { load(i, true); };
    list.appendChild(li);
  });

  function load(i, autoplay) {
    current = (i + tracks.length) % tracks.length;
    audio.src = tracks[current].src;
    count.textContent = "Playing " + (current + 1) + " of " + tracks.length;
    title.textContent = tracks[current].title;
    artist.textContent = tracks[current].artist;
    Array.from(list.children).forEach(function (li, n) {
      li.classList.toggle("cur", n === current);
    });
    if (autoplay) audio.play().catch(function () {});
  }

  playBtn.onclick = function () {
    if (audio.paused) audio.play().catch(function () {});
    else audio.pause();
  };
  prevBtn.onclick = function () { load(current - 1, true); };
  nextBtn.onclick = function () { load(current + 1, true); };

  audio.onplay = function () { playBtn.textContent = "❚❚"; playBtn.setAttribute("aria-label", "Pause"); };
  audio.onpause = function () { playBtn.textContent = "▶"; playBtn.setAttribute("aria-label", "Play"); };
  audio.onended = function () { load(current + 1, true); };
  audio.onloadedmetadata = function () { dur.textContent = fmt(audio.duration); };
  audio.ontimeupdate = function () {
    cur.textContent = fmt(audio.currentTime);
    if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  };
  seek.oninput = function () {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  };
  vol.oninput = function () { audio.volume = vol.value / 100; };

  load(0, false); 
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filters button");
  const projects = document.querySelectorAll(".project");
  if (buttons.length === 0) return;

  buttons.forEach(function (btn) {
    btn.onclick = function () {
      const type = btn.dataset.filter;
      buttons.forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      projects.forEach(function (p) {
        p.hidden = !(type === "all" || p.dataset.type === type);
      });
    };
  });
}

function showPage() {
  const pages = document.querySelectorAll(".page");
  if (pages.length === 0) return; // not index.html

  let id = location.hash.replace("#", "") || "home";
  let target = document.getElementById(id);
  let page = target ? (target.classList.contains("page") ? target : target.closest(".page")) : null;
  if (!page) page = document.getElementById("home");

  pages.forEach(function (p) { p.classList.remove("active"); });
  page.classList.add("active");

  // highlight menu
  document.querySelectorAll("#directory a").forEach(function (a) {
    const h = a.getAttribute("href");
    a.classList.toggle("here", h === "index.html" + (page.id === "home" ? "" : "#" + page.id) || (page.id === "home" && h === "index.html"));
  });

  if (target && target !== page) target.scrollIntoView();
}

function setupPages() {
  showPage();
  window.addEventListener("hashchange", showPage);
}

window.onload = function () {
  setupJukebox();
  setupFilters();
  setupPages();
};
