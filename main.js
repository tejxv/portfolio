// Text Scramble Fx

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "~<>-_\\/[]{}—=+*^?#_______";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 50);
      const end = start + Math.floor(Math.random() * 100);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.01) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const phrases = ["Tejas", "_"];

const el = document.querySelector(".name");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 1000);
  });
  counter = (counter + 1) % phrases.length;
};

next();

// spotify activity

const trackArtist = document.querySelector("#trackartist");
const trackName = document.querySelector("#tracktitle");
const nowPlaying = document.querySelector("#nowplaying");
const trackArtwork = document.querySelector("#trackartwork");
const shadowArtwork = document.querySelector("#shadowartwork");
const timestamp = document.querySelector("#timestamp");
const lastfm = document.querySelector("#lastfm");

const track = {};

function latestTrack() {
  let api =
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=lltejasll&format=json&api_key=0d18c849abdeb5bb7df9437a19e70114&limit=1";
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      track.artist = data["recenttracks"]["track"][0]["artist"]["#text"];
      track.name = data["recenttracks"]["track"][0]["name"];
      track.artwork = data["recenttracks"]["track"][0]["image"][3]["#text"];
      if ("@attr" in data["recenttracks"]["track"][0]) {
        track.nowPlaying = true;
      } else {
        track.nowPlaying = false;
        console.log("not currently playing");
        track.time = data["recenttracks"]["track"][0]["date"]["uts"];
        console.log(track.time);
      }
    })
    .then(function () {
      displayTrack();
    });
}

function displayTrack() {
  trackArtist.innerHTML = `${track.artist}`;
  trackName.innerHTML = `${track.name}`;
  trackArtwork.src = `${track.artwork}`;
  shadowArtwork.src = `${track.artwork}`;
  track.time = `${track.time}`;

  if (track.nowPlaying) {
    nowPlaying.innerHTML = `currently listening`;
  } else {
    timestamp.innerHTML = `listened ` + moment.unix(`${track.time}`).fromNow();
    nowPlaying.style.display = "none";
  }
}

latestTrack();
setInterval(latestTrack, 5000);
