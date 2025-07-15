document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imageCanvas = document.getElementById('imageCanvas');
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const textColor = document.getElementById('textColor');
    const addTextButton = document.getElementById('addTextButton');
    const assetSelect = document.getElementById('assetSelect');
    const addAssetButton = document.getElementById('addAssetButton');
    const userAssetUpload = document.getElementById('userAssetUpload');
    const rotationInput = document.getElementById('rotationInput');
    const rotateButton = document.getElementById('rotateButton');
    const applyAuraButton = document.getElementById('applyAuraButton');
    const downloadButton = document.getElementById('downloadButton');
    const errorMessage = document.getElementById('error-message');
    const zoomInput = document.getElementById('zoomInput');
    const zoomButton = document.getElementById('zoomButton');
    const bringToFrontButton = document.getElementById('bringToFrontButton');
    const sendToBackButton = document.getElementById('sendToBackButton');

    // Initialize canvas
    let canvas = new fabric.Canvas('imageCanvas', {
        backgroundColor: '#ffffff'
    });

    // Function to show error messages
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    };

    // Image Upload Handler
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (!file) {
            showError('No file selected.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showError('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            fabric.Image.fromURL(e.target.result, (img) => {
                canvas.clear();

                // Scale image to fit canvas while maintaining aspect ratio
                const scale = Math.min(
                    canvas.width / img.width,
                    canvas.height / img.height
                );

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
        const text = textInput.value.trim();

        if (!text) {
            showError('Please enter text.');
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
            borderColor: 'blue'
        });

        canvas.add(fabricText);
        canvas.setActiveObject(fabricText);
        canvas.renderAll();
    });

    // Add Asset Handler
    addAssetButton.addEventListener('click', () => {
        const asset = assetSelect.value;

        if (!asset && !userAssetUpload.files[0]) {
            showError('Please select an asset or upload your own.');
            return;
        }

        if (asset) {
            // Placeholder for predefined assets
            showError('Predefined assets are not implemented yet. Please upload your own image.');
        } else if (userAssetUpload.files[0]) {
            const file = userAssetUpload.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                fabric.Image.fromURL(e.target.result, (img) => {
                    img.set({
                        left: 100,
                        top: 100,
                        originX: 'center',
                        originY: 'center',
                        hasRotatingPoint: true,
                        scaleX: 0.5,
                        scaleY: 0.5
                    });

                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                }, { crossOrigin: 'anonymous' });
            };

            reader.readAsDataURL(file);
        }
    });

    // User Asset Upload Handler
    userAssetUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            showError('No file selected.');
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            showError('Please upload a valid image file.');
            return;
        }
    });

    // Rotation Handler
    rotateButton.addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('angle', parseInt(rotationInput.value));
            canvas.renderAll();
        } else {
            showError('No object selected to rotate.');
        }
    });

    // Layer Controls
    bringToFrontButton.addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.bringToFront();
            canvas.renderAll();
        } else {
            showError('No object selected to bring to front.');
        }
    });

    sendToBackButton.addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.sendToBack();
            canvas.renderAll();
        } else {
            showError('No object selected to send to back.');
        }
    });

    // Zoom Controls
    zoomButton.addEventListener('click', () => {
        const zoomValue = parseInt(zoomInput.value) / 100;
        canvas.setZoom(zoomValue);
        canvas.renderAll();
    });

    // Download Handler
    downloadButton.addEventListener('click', () => {
        if (canvas.isEmpty()) {
            showError('Canvas is empty. Please add an image first.');
            return;
        }
        
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const link = document.createElement('a');
        link.download = 'xyz-coin-meme.png';
        link.href = dataURL;
        link.click();
    });

    // Placeholder for Aura Effect
    applyAuraButton.addEventListener('click', () => {
        showError('Aura effect is a placeholder feature. Not implemented yet.');
    });
});