document.addEventListener("DOMContentLoaded", function () {
    const sprites = new Image();
    sprites.src = "./assets/imgs/sprites.png";

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
                object.newPositionX,
                object.y,
                object.width,
                object.height
            );
        }
    };

    function doCollision(flappyBird, ground) {
        return flappyBird.y <= ground.y - flappyBird.height;
    }

    const flappyBird = {
        sourceX: 0,
        sourceY: 0,
        width: 34,
        height: 24,
        x: 10,
        y: 50,
        gravity: 0.25,
        speed: 0,
        pulo: 4.6,
        jump() {
            console.log("pulo");
            this.speed = -this.pulo;
        },
        tick() {
            if (doCollision(this, ground)) {
                console.log("piru");
            }

            this.speed += this.gravity;
            this.y += this.speed;
        },
        draw() {
            draw(this);
        },
    };

    const ground = {
        sourceX: 0,
        sourceY: 609,
        width: 224,
        height: 113,
        x: 0,
        y: canvas.height - 113,
        isDouble: true,
        newPositionX: 224,
        draw() {
            draw(this);
        },
    };

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

    screens.start = {
        draw() {
            background.draw();
            ground.draw();
            flappyBird.draw();
            startMessage.draw();
        },
        click() {
            switchScreen(screens.game);
        },
        tick() {},
    };

    screens.game = {
        draw() {
            background.draw();
            ground.draw();
            flappyBird.draw();
        },
        click() {
            flappyBird.jump();
        },
        tick() {
            flappyBird.tick();
        },
    };

    let activeScreen = {};

    const switchScreen = (newScreen) => {
        activeScreen = newScreen;
    };

    function gameLoop() {
        activeScreen.draw();
        activeScreen.tick();

        requestAnimationFrame(gameLoop);
    }

    window.addEventListener("click", function () {
        if (!activeScreen.click) return;
        activeScreen.click();
    });

    switchScreen(screens.start);
    gameLoop();
});
