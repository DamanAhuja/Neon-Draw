// Neon Draw: glowing strokes that slowly fade. Optional mirror mode.
const canvas = document.getElementById('pad');
const ctx = canvas.getContext('2d');
let colour = NEON[0];
let mirror = false;
let last = null;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}
addEventListener('resize', resize);
resize();

const swatches = document.getElementById('swatches');
NEON.forEach((c, i) => {
  const b = document.createElement('button');
  b.style.background = c;
  if (i === 0) b.classList.add('on');
  b.onclick = () => {
    colour = c;
    swatches.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
  };
  swatches.append(b);
});
document.getElementById('mirror').onclick = (e) => { mirror = !mirror; e.currentTarget.classList.toggle('on', mirror); };
document.getElementById('clear').onclick = () => ctx.clearRect(0, 0, innerWidth, innerHeight);

function stroke(a, b) {
  ctx.strokeStyle = colour;
  ctx.shadowColor = colour;
  ctx.shadowBlur = 16;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

canvas.addEventListener('pointerdown', (e) => { last = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointermove', (e) => {
  if (!last) return;
  const now = { x: e.clientX, y: e.clientY };
  stroke(last, now);
  if (mirror) stroke({ x: innerWidth - last.x, y: last.y }, { x: innerWidth - now.x, y: now.y });
  last = now;
});
addEventListener('pointerup', () => { last = null; });

// Fade old strokes a little every frame.
(function fade() {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,0.012)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.restore();
  requestAnimationFrame(fade);
})();
