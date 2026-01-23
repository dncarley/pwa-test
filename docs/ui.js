const lanesEl = document.getElementById("lanes");
const timerEl = document.getElementById("timer");

function updateHUD() {
  timerEl.textContent = raceRunning
    ? ((performance.now() - raceStart) / 1000).toFixed(3)
    : "0.000";

  lanesEl.innerHTML = "";
  results.forEach((time, i) => {
    const div = document.createElement("div");
    div.textContent = `Lane ${i + 1}: ${time ? time.toFixed(3) + "s" : "—"}`;
    lanesEl.appendChild(div);
  });
}

function saveRace() {
  const races = JSON.parse(localStorage.getItem("races") || "[]");
  races.push({
    date: new Date().toISOString(),
    results
  });
  localStorage.setItem("races", JSON.stringify(races));
}
