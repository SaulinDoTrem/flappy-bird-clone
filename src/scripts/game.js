document.addEventListener("DOMContentLoaded", function () {
    let frames = 0;

    const hitSound = new Audio("../sounds/hit.wav");

    const sprites = new Image();
    sprites.src = "../assets/imgs/sprites.png";

    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    const backgroundColor = "#70c5ce";

    const draw = (object) => {
        context.drawImage(
            sprites,
            object.sourceX,
            object.sourceY,
            object.width,
            object.height,
            object.x,
            object.y,
            object.width,
            object.height
        );

        if (object.isDouble) {
            context.drawImage(
                sprites,
                object.sourceX,
                object.sourceY,
                object.width,
                object.height,
                object.x + object.width,
                object.y,
                object.width,
                object.height
            );
        }
    };

    function doCollision(flappyBird, ground) {
        return flappyBird.y >= ground.y - flappyBird.height;
    }

    function createFlappyBird() {
        return {
            sourceX: 0,
            sourceY: 0,
            width: 34,
            height: 24,
            x: 10,
            y: 50,
            gravity: 0.25,
            speed: 0,
            pulo: 4.6,
            actualFrame: 0,
            updateActualFrame() {
                if (frames % 5 === 0) this.actualFrame = frames % 3;
            },
            sprites: [
                { spriteX: 0, spriteY: 0 }, // asa pra cima
                { spriteX: 0, spriteY: 26 }, // asa no meio
                { spriteX: 0, spriteY: 52 }, // asa pra baixo
            ],
            jump() {
                this.speed = -this.pulo;
            },
            tick() {
                if (doCollision(this, globals.ground)) {
                    hitSound.play();

                    setTimeout(() => {
                        switchScreen(screens.start);
                    }, 50);
                    return;
                }

                this.speed += this.gravity;
                this.y += this.speed;
            },
            draw() {
                this.updateActualFrame();
                const { spriteX, spriteY } = this.sprites[this.actualFrame];
                this.sourceX = spriteX;
                this.sourceY = spriteY;
                draw(this);
            },
        };
    }

    function createGround() {
        return {
            sourceX: 0,
            sourceY: 609,
            width: 224,
            height: 113,
            x: 0,
            y: canvas.height - 113,
            isDouble: true,
            tick() {
                const movement = this.x - 1;

                this.x = movement % 112;
            },
            draw() {
                draw(this);
            },
        };
    }

    const background = {
        sourceX: 390,
        sourceY: 3,
        width: 275,
        height: 204,
        x: 0,
        y: canvas.height - 200 - 113,
        isDouble: true,
        newPositionX: 275,
        draw() {
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, canvas.width, canvas.height);

            draw(this);
        },
    };

    const startMessage = {
        sourceX: 134,
        sourceY: 0,
        width: 174,
        height: 152,
        x: canvas.width / 2 - 174 / 2,
        y: 50,
        draw() {
            draw(this);
        },
    };

    const screens = {};

    const globals = {};

    screens.start = {
        start() {
            globals.flappyBird = createFlappyBird();
            globals.ground = createGround();
        },
        draw() {
            background.draw();
            globals.ground.draw();
            globals.flappyBird.draw();
            startMessage.draw();
        },
        click() {
            switchScreen(screens.game);
        },
        tick() {
            globals.ground.tick();
        },
    };

    screens.game = {
        draw() {
            background.draw();
            globals.ground.draw();
            globals.flappyBird.draw();
        },
        click() {
            globals.flappyBird.jump();
        },
        tick() {
            globals.flappyBird.tick();
            globals.ground.tick();
        },
    };

    let activeScreen = {};

    const switchScreen = (newScreen) => {
        activeScreen = newScreen;
        if (activeScreen.start) activeScreen.start();
    };

    function gameLoop() {
        activeScreen.draw();
        activeScreen.tick();

        frames++;
        requestAnimationFrame(gameLoop);
    }

    window.addEventListener("click", function () {
        if (!activeScreen.click) return;
        activeScreen.click();
    });

    switchScreen(screens.start);
    gameLoop();
});
