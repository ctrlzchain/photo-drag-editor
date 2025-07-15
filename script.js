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

    let canvas = new fabric.Canvas('imageCanvas');
    let currentText = null;
    let zoomLevel = 1; // Initialize zoom level

    // Function to clear error messages
    const clearError = () => {
        errorMessage.textContent = '';
    };

    // Image Upload Handler
    imageUpload.addEventListener('change', (event) => {
        clearError();

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

                const scaleX = canvas.width / img.width;
                const scaleY = canvas.height / img.height;
                const scale = Math.min(scaleX, scaleY);

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
            borderColor: 'blue'
        });

        canvas.add(fabricText);
        canvas.setActiveObject(fabricText);
        currentText = fabricText;
    });

    // Add Asset Handler
    addAssetButton.addEventListener('click', () => {
        clearError();
        const asset = assetSelect.value;

        if (!asset && !userAssetUpload.files[0]) {
            return; // No asset selected and no user asset uploaded
        }

        const loadAsset = (assetSource) => {
            fabric.Image.fromURL(assetSource, (img) => {
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

        if (asset) {
            // Load from predefined assets
            loadAsset(`assets/\${asset}.png`);
        } else if (userAssetUpload.files[0]) {
            // Load from
