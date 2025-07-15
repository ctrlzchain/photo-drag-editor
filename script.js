const uploadInput = document.getElementById('upload');
const mainImage = document.getElementById('main-image');
const overlay = document.getElementById('overlay');
const accessories = document.querySelectorAll('.accessory');

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    mainImage.src = event.target.result;
    overlay.innerHTML = '';
  };
  reader.readAsDataURL(file);
});

// Clone accessory and add to overlay
accessories.forEach(item => {
  item.addEventListener('click', () => {
    const clone = item.cloneNode(true);
    clone.classList.add('draggable', 'resizable');
    clone.style.left = '50px';
    clone.style.top = '50px';
    overlay.appendChild(clone);
    makeInteractive(clone);
  });
});

// Enable dragging + resizing + rotating
function makeInteractive(el) {
  interact(el)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px) rotate(${target.getAttribute('data-rot') || 0}deg)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      preserveAspectRatio: true,
    })
    .on('resizemove', function (event) {
      const target = event.target;
      let width = event.rect.width;
      let height = event.rect.height;

      target.style.width = width + 'px';
      target.style.height = height + 'px';
    })
    .gesturable({
      listeners: {
        move(event) {
          const target = event.target;
          let current = parseFloat(target.getAttribute('data-rot')) || 0;
          const rotation = current + event.da;
          target.setAttribute('data-rot', rotation);
          const x = parseFloat(target.getAttribute('data-x')) || 0;
          const y = parseFloat(target.getAttribute('data-y')) || 0;
          target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        }
      }
    });
}

// Download final result as image
document.getElementById('download').addEventListener('click', () => {
  const wrapper = document.getElementById('canvas-wrapper');

  html2canvas(wrapper).then(canvas => {
    const link = document.createElement('a');
    link.download = 'photo-edited.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});
