/* Fenêtre mini-carte : capture la zone de la mini-carte sur l'écran du jeu et l'affiche en grand.
   On ne montre que ce que le joueur voit déjà à l'écran (aucune donnée cachée du jeu). */
(() => {
  'use strict';
  const v = document.getElementById('v'), cv = document.getElementById('cv'), ctx = cv.getContext('2d'), msg = document.getElementById('msg');
  let crop = { x: 0.857, y: 0.745, w: 0.14, h: 0.25 }, stream = null, sourceId = null;

  async function startCapture(id) {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    if (!id) { msg.textContent = 'Aucun écran à capturer.'; return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: id, maxWidth: 3840, maxHeight: 2160, maxFrameRate: 30 } } });
      v.srcObject = stream; await v.play();
      msg.style.display = 'none';
    } catch (e) {
      msg.textContent = 'Impossible de capturer l\'écran du jeu : ' + e.message;
    }
  }
  function resize() { cv.width = window.innerWidth * devicePixelRatio; cv.height = window.innerHeight * devicePixelRatio; cv.style.width = window.innerWidth + 'px'; cv.style.height = window.innerHeight + 'px'; }
  window.addEventListener('resize', resize); resize();

  function draw() {
    if (v.videoWidth) {
      const sx = crop.x * v.videoWidth, sy = crop.y * v.videoHeight, sw = crop.w * v.videoWidth, sh = crop.h * v.videoHeight;
      const scale = Math.min(cv.width / sw, cv.height / sh);
      const dw = sw * scale, dh = sh * scale;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(v, sx, sy, sw, sh, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  window.noob.minimap.onConfig((c) => {
    crop = c.crop || crop;
    if (c.sourceId !== sourceId) { sourceId = c.sourceId; startCapture(sourceId); }
  });
  document.getElementById('close').onclick = () => window.noob.minimap.close();
  document.getElementById('full').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !document.fullscreenElement) window.noob.minimap.close(); });
})();
