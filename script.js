document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imageCanvas = document.getElementById('imageCanvas');
    const downloadButton = document.getElementById('downloadButton');
    const errorMessage = document.getElementById('error-message');
    const addLaserEyes = document.getElementById('addLaserEyes');
    const addFartCloud = document.getElementById('addFartCloud');
    const pixiCanvasOverlay = document.getElementById('pixi-canvas-overlay');

    let canvas = new fabric.Canvas('imageCanvas');
    let pixiApp;
    let uploadedImage;

    // Function to clear error messages
    const clearError = () => {
        errorMessage.textContent = '';
    };

    // Initialize PixiJS Application
    const initPixi = () => {
        pixiApp = new PIXI.Application({
            view: pixiCanvasOverlay,
            width: 600,
            height: 400,
            transparent: true,
            autoDensity: true
        });
        pixiApp.stage.sortableChildren = true; //Important to ensure layering
    };

    initPixi(); // Initialize PixiJS

    //Load Image Assets
    let laserEyesTexture = PIXI.Texture.from('assets/laserEyes.png');
    let fartCloudTexture = PIXI.Texture.from('assets/fartCloud.png');

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
                uploadedImage = img; //Store uploaded Image
                canvas.renderAll();
                clearPixiStage();
            }, { crossOrigin: 'anonymous' });
        };

        reader.readAsDataURL(file);
    });

    //Download Handlers
    downloadButton.addEventListener('click', () => {
        clearError();

        //Ensure that Fabric.js and PixiJS are layered correctly
        canvas.lowerCanvas(); //Brings fabric JS to bottom Layer so PIXI is properly on top
        //Render PIXI to base64
        const pixiBase64 = pixiApp.renderer.plugins.extract.base64();

        //Render Fabric to base64
        const fabricBase64 = imageCanvas.toDataURL({format:'png'});

        //Combine the 2
        let combinedImage = new Image();
        combinedImage.onload = function() {
            //Create Canvas the size of fabric
            let newCanvas = document.createElement('canvas');
            newCanvas.width = imageCanvas.width;
            newCanvas.height = imageCanvas.height;

            let ctx = newCanvas.getContext('2d');
            //Draw Background Fabric image
            ctx.drawImage(this, 0, 0);

            //Draw over with Pixi Canvas
            let pixiImage = new Image();
            pixiImage.onload = function() {
                ctx.drawImage(this, 0, 0);

                //Convert Image and Download
                let link = document.createElement('a');
                link.href = newCanvas.toDataURL("image/png");
                link.download = "meme.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                canvas.upperCanvas(); //Moves Fabric canvas back to Top
            }
            pixiImage.src = pixiBase64;

        };
        combinedImage.src = fabricBase64; //Load Fabric


    });

    function clearPixiStage() {
        pixiApp.stage.removeChildren();
    }

    //Laser Eyes Button function
    addLaserEyes.addEventListener('click', () => {
        clearError();
        if(uploadedImage) {
            clearPixiStage();
            let laserEyesSprite1 = PIXI.Sprite.from(laserEyesTexture);
            let laserEyesSprite2 = PIXI.Sprite.from(laserEyesTexture);

            //Set Anchor
            laserEyesSprite1.anchor.set(0.5);
            laserEyesSprite2.anchor.set(0.5);
            //Set position (adjust these values)
            laserEyesSprite1.x = canvas.width / 4;   //Position eyes
            laserEyesSprite1.y = canvas.height / 4;
            laserEyesSprite1.zIndex = 1;  //Ensure that it is properly layered on Canvas

            laserEyesSprite2.x = canvas.width / 1.25;
            laserEyesSprite2.y = canvas.height / 4;
            laserEyesSprite2.zIndex = 1;  //Ensure that it is properly layered on Canvas

            //Add to stage
            pixiApp.stage.addChild(laserEyesSprite1);
            pixiApp.stage.addChild(laserEyesSprite2);

        } else {
            errorMessage.textContent = "Upload an Image First"
        }
    });

    //Add Fart Cloud
    addFartCloud.addEventListener('click', () => {
        clearError();
        if(uploadedImage) {
            clearPixiStage();
            let fartCloudSprite = PIXI.Sprite.from(fartCloudTexture);

            //Set Anchor
            fartCloudSprite.anchor.set(0.5);

            //Scale Sprite
            fartCloudSprite.scale.set(0.5);

            //Set position (adjust these values)
            fartCloudSprite.x = canvas.width / 2;   //Position eyes
            fartCloudSprite.y = canvas.height / 1.25;
            fartCloudSprite.zIndex = 1;  //Ensure that it is properly layered on Canvas

            //Add to stage
            pixiApp.stage.addChild(fartCloudSprite);

        } else {
            errorMessage.textContent = "Upload an Image First"
        }
    });

});
