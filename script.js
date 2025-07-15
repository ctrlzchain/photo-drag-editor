document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const uploadButton = document.getElementById('uploadButton'); //Unused
    const imageCanvas = document.getElementById('imageCanvas');
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const textColor = document.getElementById('textColor');
    const addTextButton = document.getElementById('addTextButton');
    const rotationInput = document.getElementById('rotationInput');
    const rotateButton = document.getElementById('rotateButton');
    const applyAuraButton = document.getElementById('applyAuraButton');
    const downloadButton = document.getElementById('downloadButton');
    const errorMessage = document.getElementById('error-message');

    let canvas = new fabric.Canvas('imageCanvas');
    let currentText = null;

    // Function to clear error messages
    const clearError = () => {
        errorMessage.textContent = '';
    };

    // Image Upload Handler
    imageUpload.addEventListener('change', (event) => {
        clearError(); // Clear any previous errors

        const file = event.target.files[0];

        if (!file) {
            errorMessage.textContent = 'No file selected.';
            return;
        }

        if (!file.type.startsWith('image/')) {
            errorMessage.textContent = 'Please upload a valid image file.';
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            fabric.Image.fromURL(e.target.result, (img) => {
                canvas.clear();

                // Scale image to fit canvas
                const scaleX = canvas.width / img.width;
                const scaleY = canvas.height / img.height;
                const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit

                img.set({
                    scaleX: scale,
                    scaleY: scale,
                    originX: 'center',
                    originY: 'center',
                    left: canvas.width / 2,
                    top: canvas.height / 2
                });

                canvas.add(img);
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
        };

        reader.readAsDataURL(file);
    });

    // Add Text Handler
    addTextButton.addEventListener('click', () => {
        clearError();
        const text = textInput.value.trim();

        if (!text) {
            errorMessage.textContent = 'Please enter text.';
            return;
        }

        const fabricText = new fabric.Text(text, {
            left: 50,
            top: 50,
            fontFamily: fontSelect.value,
            fontSize: 30,
            fill: textColor.value,
            originX: 'left',
            originY: 'top',
            hasRotatingPoint: true,
            cornerStyle: 'circle',
            cornerColor: 'blue',
            borderColor: 'blue',
        });

        canvas.add(fabricText);
        canvas.setActiveObject(fabricText); // Select the newly added text
        currentText = fabricText;
    });

    // Rotate Handler
    rotateButton.addEventListener('click', () => {
        clearError();
        const angle = parseFloat(rotationInput.value);

        if (isNaN(angle)) {
            errorMessage.textContent = 'Please enter a valid rotation angle.';
            return;
        }

        const activeObject = canvas.getActiveObject();

        if (!activeObject) {
            errorMessage.textContent = 'Please select an object to rotate.';
            return;
        }

        activeObject.rotate(angle);
        canvas.renderAll();
    });

    // Aura Handler (Placeholder)
    applyAuraButton.addEventListener('click', () => {
        clearError();
        alert('Dragon Ball Aura effect not implemented yet. This requires advanced image processing techniques.');
    });

    // Download Handler
    downloadButton.addEventListener('click', () => {
        clearError();
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 0.8
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Canvas Object Selection Handler
    canvas.on('object:selected', (options) => {
      if (options.target && options.target.type === 'text') {
          textInput.value = options.target.text;
          fontSelect.value = options.target.fontFamily;
          textColor.value = options.target.fill;
          currentText = options.target;

      } else {
          textInput.value = "";
          currentText = null;
      }
    });

    canvas.on('object:moving', (options) => {
        clearError();
    });
    canvas.on('object:scaling', (options) => {
        clearError();
    });
    canvas.on('object:rotating', (options) => {
        clearError();
    });

    textInput.addEventListener('input', function() {
        if (currentText) {
            currentText.set('text', this.value);
            canvas.renderAll();
        }
    });

    fontSelect.addEventListener('change', function() {
        if (currentText) {
            currentText.set('fontFamily', this.value);
            canvas.renderAll();
        }
    });

    textColor.addEventListener('input', function() {
        if (currentText) {
            currentText.set('fill', this.value);
            canvas.renderAll();
        }
    });

});
