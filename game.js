var canvas, cc;
window.onload = function() {
  canvas = document.getElementById('canvas');
  cc = canvas.getContex('2d');
  setInterval(function() {
      resizeCanvas(), drawCanvas()
  }, 1000 / fps);
}
