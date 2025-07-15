const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageUpload = document.getElementById("imageUpload");
const downloadBtn = document.getElementById("downloadBtn");

let baseImage = new Image();

imageUpload.addEventListener("change", (e) => {
  const reader = new FileReader();
  reader.onload = function (event) {
    baseImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImage, 0, 0, 1080, 1080);
    };
    baseImage.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Accessory drag-and-drop using interact.js
document.querySelectorAll(".accessory").forEach((el) => {
  el.style.position = "absolute";
  el.style.left = "100px";
  el.style.top = "100px";
  document.body.appendChild(el);

  interact(el).draggable({
    onmove(event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px) rotate(${target.getAttribute("data-rotate") || 0}deg) scale(${target.getAttribute("data-scale") || 1})`;
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }
  }).gesturable({
    onmove(event) {
      const target = event.target;
      const scale = (parseFloat(target.getAttribute("data-scale")) || 1) * (1 + event.ds);
      const angle = (parseFloat(target.getAttribute("data-rotate")) || 0) + event.da;

      target.setAttribute("data-scale", scale);
      target.setAttribute("data-rotate", angle);

      const x = parseFloat(target.getAttribute("data-x")) || 0;
      const y = parseFloat(target.getAttribute("data-y")) || 0;
      target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale})`;
    }
  });
});
