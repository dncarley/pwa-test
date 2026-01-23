let raceStart = 0;
let raceRunning = false;
let results = [];
let lanes = 2;

// ---- Native Bridge ----
window.native = window.native || {
  openGate() {
    window.webkit?.messageHandlers?.native?.postMessage("openGate");
  },
  closeGate() {
    window.webkit?.messageHandlers?.native?.postMessage("closeGate");
  }
};

// ---- Start Race ----
document.getElementById("start").onclick = async () => {
  await countdown();
  raceStart = performance.now();
  raceRunning = true;
  results = new Array(lanes).fill(null);
  window.native.openGate();
};

// ---- Reset ----
document.getElementById("reset").onclick = () => {
  raceRunning = false;
  window.native.closeGate();
  resetVision();
  updateHUD();
};

// ---- Finish Recording ----
function recordFinish(lane) {
  if (!raceRunning || results[lane] !== null) return;

  const time = (performance.now() - raceStart) / 1000;
  results[lane] = time;
  updateHUD();

  if (results.every(r => r !== null)) {
    raceRunning = false;
    saveRace();
  }
}

// ---- Countdown ----
async function countdown() {
  for (let i = 3; i > 0; i--) {
    beep();
    await delay(1000);
  }
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function beep() {
  new Audio("beep.wav").play().catch(() => {});
}
