document.addEventListener("DOMContentLoaded", function () {
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
                object.newPositionX,
                object.y,
                object.width,
                object.height
            );
        }
    };

    const flappyBird = {
        sourceX: 0,
        sourceY: 0,
        width: 34,
        height: 24,
        x: 0,
        y: 0,
        gravity: 0.25,
        speed: 0,
        tick() {
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

    function gameLoop() {
        background.draw();
        ground.draw();
        flappyBird.draw();
        flappyBird.tick();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
