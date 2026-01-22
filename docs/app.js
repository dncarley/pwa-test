const PICO = "http://192.168.4.1";
const out = document.getElementById("out");

async function send(left, right) {
  await fetch(`${PICO}/cmd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ left, right })
  });
}

async function poll() {
  try {
    const r = await fetch(`${PICO}/state`);
    const j = await r.json();
    out.textContent = JSON.stringify(j, null, 2);
  } catch (e) {
    out.textContent = "Disconnected";
  }
}

setInterval(poll, 100);

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
