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

    function restartGame() {
        hitSound.play();

        setTimeout(() => {
            switchScreen(screens.gameOver);
        }, 50);
    }

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
                    restartGame();
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

    function createPipes() {
        return {
            width: 52,
            height: 400,
            sprites: {
                ground: {
                    sourceX: 0,
                    sourceY: 169,
                },
                sky: {
                    sourceX: 52,
                    sourceY: 169,
                },
            },
            space: 100,
            pipes: [],
            doCollision(pipe) {
                const flappyBirdHead = globals.flappyBird.y;
                const flappyBirdFoot = globals.flappyBird.y + globals.flappyBird.height;
                const flappyBirdBody = globals.flappyBird.x + globals.flappyBird.width;

                return (
                    flappyBirdBody >= pipe.x &&
                    (flappyBirdFoot >= pipe.groundPipe || flappyBirdHead <= pipe.skyPipe)
                );
            },
            draw() {
                this.pipes.forEach((pipe) => {
                    const yRandom = pipe.y;

                    this.sourceX = this.sprites.sky.sourceX;
                    this.sourceY = this.sprites.sky.sourceY;
                    this.x = pipe.x;
                    this.y = -yRandom;

                    (pipe.skyPipe = this.y + this.height), draw(this);

                    this.sourceX = this.sprites.ground.sourceX;
                    this.sourceY = this.sprites.ground.sourceY;
                    this.x = pipe.x;
                    this.y = this.height + this.space - yRandom;

                    draw(this);

                    pipe.groundPipe = this.y;
                });
            },
            tick() {
                if (frames % 100 === 0)
                    this.pipes.push({
                        x: canvas.width,
                        y: Math.round((Math.random() + 1) * 150),
                    });

                this.pipes.forEach((pipe) => {
                    pipe.x -= 2;

                    if (this.doCollision(pipe)) {
                        restartGame();
                    }

                    if (pipe.x + this.width <= 0) this.pipes.shift();
                });
            },
        };
    }

    function createScoreboard() {
        return {
            points: 0,
            draw() {
                context.font = "35px VT323";
                context.textAlign = "right";
                context.fillStyle = "white";
                context.fillText(`Pontuação: ${this.points}`, canvas.width - 10, 35);
            },
            tick() {
                if (frames % 100 === 0) this.points++;
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
        x: xMessage(174),
        y: 50,
        draw() {
            draw(this);
        },
    };

    const gameOverMessage = {
        sourceX: 134,
        sourceY: 153,
        width: 226,
        height: 200,
        x: xMessage(226),
        y: 50,
        draw() {
            draw(this);
        },
    };

    function xMessage(width) {
        return canvas.width / 2 - width / 2;
    }

    const screens = {};

    const globals = {};

    screens.start = {
        start() {
            globals.flappyBird = createFlappyBird();
            globals.ground = createGround();
            globals.pipes = createPipes();
        },
        draw() {
            background.draw();
            globals.ground.draw();
            globals.flappyBird.draw();
            startMessage.draw();
        },
        click() {
            frames = 0;
            switchScreen(screens.game);
        },
        tick() {
            globals.ground.tick();
        },
    };

    screens.game = {
        start() {
            globals.scoreboard = createScoreboard();
        },
        draw() {
            background.draw();
            globals.pipes.draw();
            globals.ground.draw();
            globals.flappyBird.draw();
            globals.scoreboard.draw();
        },
        click() {
            globals.flappyBird.jump();
        },
        tick() {
            globals.flappyBird.tick();
            globals.ground.tick();
            globals.pipes.tick();
            globals.scoreboard.tick();
        },
    };

    screens.gameOver = {
        draw() {
            background.draw();
            globals.pipes.draw();
            globals.ground.draw();
            globals.flappyBird.draw();
            globals.scoreboard.draw();
            gameOverMessage.draw();
        },
        click() {
            switchScreen(screens.start);
        },
        tick() {},
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
        if (activeScreen.click) activeScreen.click();
    });

    switchScreen(screens.start);
    gameLoop();
});
