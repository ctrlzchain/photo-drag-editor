document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas
    const canvas = new fabric.Canvas('imageCanvas', {
        backgroundColor: '#ffffff'
    });

    // Error handling
    function showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
                canvas.clear();
                
                // Scale image to fit canvas
                const scale = Math.min(
                    canvas.width / img.width,
                    canvas.height / img.height
                );
                
                img.set({
                    scaleX: scale,
                    scaleY: scale,
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center'
                });
                
                canvas.add(img);
                canvas.renderAll();
            });
        };
        reader.readAsDataURL(file);
    });

    // Add text
    document.getElementById('addTextButton').addEventListener('click', function() {
        const text = document.getElementById('textInput').value.trim();
        if (!text) {
            showError('Please enter some text');
            return;
        }

        const textObj = new fabric.Text(text, {
            left: 100,
            top: 100,
            fontFamily: document.getElementById('fontSelect').value,
            fontSize: 30,
            fill: document.getElementById('textColor').value
        });
        
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.renderAll();
    });

    // Add asset (including laserEyes.png)
    document.getElementById('addAssetButton').addEventListener('click', function() {
        const assetType = document.getElementById('assetSelect').value;
        
        if (assetType === 'laserEyes') {
            // Load laserEyes.png from assets folder
            fabric.Image.fromURL('assets/laserEyes.png', function(img) {
                img.set({
                    left: 100,
                    top: 100,
                    originX: 'center',
                    originY: 'center',
                    scaleX: 0.5,
                    scaleY: 0.5
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            }, { crossOrigin: 'anonymous' });
        } else if (assetType) {
            showError('Selected asset not found');
        } else {
            showError('Please select an asset first');
        }
    });

    // Handle user asset upload
    document.getElementById('userAssetUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
                img.set({
                    left: 100,
                    top: 100,
                    originX: 'center',
                    originY: 'center',
                    scaleX: 0.5,
                    scaleY: 0.5
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
            });
        };
        reader.readAsDataURL(file);
    });

    // Download image
    document.getElementById('downloadButton').addEventListener('click', function() {
        if (canvas.isEmpty()) {
            showError('Please add an image first');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        link.click();
    });

    // Rotate object
    document.getElementById('rotateButton').addEventListener('click', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.angle = parseInt(document.getElementById('rotationInput').value) || 0;
            canvas.renderAll();
        } else {
            showError('No object selected');
        }
    });

    // Layer controls
    document.getElementById('bringToFrontButton').addEventListener('click', function() {
        const obj = canvas.getActiveObject();
        if (obj) obj.bringToFront();
        else showError('No object selected');
    });

    document.getElementById('sendToBackButton').addEventListener('click', function() {
        const obj = canvas.getActiveObject();
        if (obj) obj.sendToBack();
        else showError('No object selected');
    });

    // Zoom controls
    document.getElementById('zoomButton').addEventListener('click', function() {
        const zoom = parseInt(document.getElementById('zoomInput').value) / 100 || 1;
        canvas.setZoom(zoom);
        canvas.renderAll();
    });
});