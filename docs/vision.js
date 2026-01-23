const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let prevFrame = null;
let finishLineY = 0.7; // % of height

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => {
  video.srcObject = stream;
});

function resetVision() {
  prevFrame = null;
}

function processFrame() {
  if (video.videoWidth === 0) {
    requestAnimationFrame(processFrame);
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);
  const curr = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (prevFrame) {
    detectMotion(prevFrame, curr);
  }

  prevFrame = curr;
  drawFinishLine();
  requestAnimationFrame(processFrame);
}

function detectMotion(prev, curr) {
  let laneHits = new Array(lanes).fill(false);
  const laneWidth = canvas.width / lanes;

  for (let i = 0; i < curr.data.length; i += 16) {
    const diff =
      Math.abs(curr.data[i] - prev.data[i]) +
      Math.abs(curr.data[i+1] - prev.data[i+1]) +
      Math.abs(curr.data[i+2] - prev.data[i+2]);

    if (diff > 120) {
      const px = (i / 4) % canvas.width;
      const py = Math.floor((i / 4) / canvas.width);

      if (py > canvas.height * finishLineY) {
        const lane = Math.floor(px / laneWidth);
        laneHits[lane] = true;
      }
    }
  }

  laneHits.forEach((hit, lane) => {
    if (hit) recordFinish(lane);
  });
}

function drawFinishLine() {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * finishLineY);
  ctx.lineTo(canvas.width, canvas.height * finishLineY);
  ctx.stroke();
}

processFrame();
