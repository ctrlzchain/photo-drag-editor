const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = null;
let elements = [];

document.getElementById('upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      redraw();
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.querySelectorAll('.draggable').forEach((icon) => {
  icon.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.src);
  });
});

canvas.addEventListener('dragover', (e) => e.preventDefault());

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const src = e.dataTransfer.getData('text/plain');
  const img = new Image();
  img.onload = () => {
    const rect = canvas.getBoundingClientRect();
    elements.push({ img, x: e.clientX - rect.left, y: e.clientY - rect.top });
    redraw();
  };
  img.src = src;
});

function redraw() {
  if (!image) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  elements.forEach(({ img, x, y }) => {
    ctx.drawImage(img, x - img.width / 2, y - img.height / 2, img.width, img.height);
  });
}

document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL();
  link.click();
});
