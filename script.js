document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imageCanvas = document.getElementById('imageCanvas');
    const downloadButton = document.getElementById('downloadButton');
    const errorMessage = document.getElementById('error-message');
    const addLaserEyes = document.getElementById('addLaserEyes');
    const addFartCloud = document.getElementById('addFartCloud');
    const pixiCanvasOverlay = document.getElementById('pixi-canvas-overlay');

    let canvas;
    let pixiApp;
    let uploadedImage;

    // Function to clear error messages
    const clearError = () => {
        errorMessage.textContent = '';
    };

    // Check if Fabric.js is loaded
    if (typeof fabric === 'undefined') {
        errorMessage.textContent = 'Fabric.js failed to load. Please check your internet connection.';
        return;
    } else {
        try {
            canvas = new fabric.Canvas('imageCanvas');
        } catch (e) {
            errorMessage.textContent = 'Failed to initialize Fabric.js canvas.';
            console.error("Fabric.js Initialization Error:", e);
            return;
        }
    }

    // Initialize PixiJS Application
    const initPixi = () => {
        if (typeof PIXI === 'undefined') {
            errorMessage.textContent = 'PixiJS failed to load. Please check your internet connection.';
            return;
        }

        try {
            pixiApp = new PIXI.Application({
                view: pixiCanvasOverlay,
                width: 600,
                height: 400,
                transparent: true,
                autoDensity: true
            });
            pixiApp.stage.sortableChildren = true; //Important to ensure layering
        } catch (e) {
            errorMessage.textContent = 'Failed to initialize PixiJS application.';
            console.error("PixiJS Initialization Error:", e);
            return;
        }
    };

    initPixi(); // Initialize PixiJS

    //Load Image Assets
    let laserEyesTexture;
    let fartCloudTexture;

    try {
        laserEyesTexture = PIXI.Texture.from('assets/laserEyes.png');
        fartCloudTexture = PIXI.Texture.from('assets/fartCloud.png');
    } catch (e) {
        errorMessage.textContent = 'Failed to load assets. Ensure the assets folder exists and contains the necessary images.';
        console.error("Asset Loading Error:", e);
    }

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
            try {
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
            } catch (e) {
                errorMessage.textContent = "Error loading image to canvas.";
                console.error("Fabric.js Image Loading Error:", e);
            }

        };

        reader.readAsDataURL(file);
    });

    //Download Handlers
    downloadButton.addEventListener('click', () => {
        clearError();

        if (!uploadedImage) {
            errorMessage.textContent = 'Please upload an image before downloading.';
            return;
        }

        try {
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
        } catch (e) {
            errorMessage.textContent = "Error during download process.";
            console.error("Download Error:", e);
            canvas.upperCanvas();  //Ensure Canvas is back to top if error
        }


    });

    function clearPixiStage() {
        pixiApp.stage.removeChildren();
    }

    //Helper function to add pixi effect
    function addPixiEffect(effect) {
        clearError();
        if(uploadedImage) {
            clearPixiStage();

            effect(); //Run PIXI effect if image is uploaded
        } else {
            errorMessage.textContent = "Upload an Image First"
        }
    }

    //Laser Eyes Button function
    addLaserEyes.addEventListener('click', () => {
        addPixiEffect( () => {
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
        });
    });

    //Add Fart Cloud
    addFartCloud.addEventListener('click', () => {
        addPixiEffect(() => {
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
        });
    });

});
