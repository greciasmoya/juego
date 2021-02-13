//DEFINIMOS CARACTERÍSTICAS

//VARIABLES
    //Definimos los tamaños de los elementos, variables y características de nuestro canvas.

        //Ponemos la referencia de myCanvas de JS y especificamos que va a ser un juego en 2d.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

    //Posicionamiento de nuestro canvas y definición de la posición de círculo.
var ballRadius = 12; //Radio del círculo.
var x = canvas.width/2; //
var y = canvas.height-30;

    //Añadimos valor a x e y para el movimiento de la bola
var dx = 2.5;
var dy = -2.5;

    //Tamaño de la base
var paddleHeight = 15;
var paddleWidth = 85;
var paddleX = (canvas.width-paddleWidth)/2;

    //Permitimos al usuario controlar la base.
var rightPressed = false;
var leftPressed = false;

    //Tamaño del ladrillo
var brickOffsetTop = 32;
var brickOffsetLeft = 32;
var brickWidth = 82;
var brickHeight = 30;
var brickPadding = 15;
var brickRowCount = 5;
var brickColumnCount = 5;

    //Vidas y puntuación máxima y mínima.
var lives = 5;
var score = 0;


//LADRILLOS

    //Instanciamos los ladrillos en filas y columnas
    var bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    

//CONTROL DE LA BASE

    //Activamos el ratón y el teclado para usar la base. 

    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    //Configuramos las variables para que almacenen la información de las teclas presionadas.
function keyDownHandler(e) {
    if(e.code  == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.code == 'ArrowLeft') {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.code == 'ArrowRight') {
        rightPressed = false;
    }
    else if(e.code == 'ArrowLeft') {
        leftPressed = false;
    }

}   
    //Agregamos movimiento al ratón.

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
        // Restringimos el movimiento al tamaño del juego.
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

        //Definimos los px que se moverá a izquiera/derecha dependiendo de si pulsamos un lado y otro.
     if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 9;
        }
    else if(leftPressed && paddleX > 0) {
            paddleX -= 9;
        }
    
//COLISIONES        
        
        //Creamos una función que recorra todos los ladrillos con las coordenadas de la bola.
            

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {

                //Almacenamos en b los ladrillos.

            var b = bricks[c][r];
            
                //El centro de la bola tiene que estar dentro del ladrillo
                    //Con el status veremos si ocurre la colisión o no.
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;

                    //Otorgamos puntuación cada vez que golpee el ladrillo y ponemos un mensaje de winner.
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("Has ganado");
                        document.location.reload();
                    }
                }
            }
        }
    }
}


////ELEMENTOS

//Recorremos los ladrillos con arrays y los visibilizamos.
        //Ponemos brickXy y brickY como coordenadas para que no se acumulen en un sólo sitio.

function drawBricks() {
    
             //Los ladrillos desaparecerán después de ser golpeados
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {

            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#6A02E9";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


//Agregamos la base y definimos su estilo.
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#1BB39A";
    ctx.fill();
    ctx.closePath();
}


//Agregamos el círculo y lo definimos.
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2); //La bola estará en la posición actual.
    ctx.fillStyle = "#E9DE02";
    ctx.fill();
    ctx.closePath();
}

//Definimos las vidas y la ponemos estilo.
function drawLives() {
    ctx.font = "20px Helvetica";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Vidas: "+lives, canvas.width-80, 20);
}

//Definimos la puntuación y la ponemos estilo.
function drawScore() {
    ctx.font = "20px Helvetica";
    ctx.fillStyle = "#2095A6";
    ctx.fillText("Puntuación: "+score, 8, 20);
}


//FUNCIONES

function draw() {
    //Eliminar el rastro que deja la bola.
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    //Instanciamos las funciones
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    

    //REBOTE DE LA BOLA EN LAS PAREDES

        //Instanciamos las variables
    x += dx;
    y += dy;

        //Rebota en las paredes de arriba(x)/abajo(y) 
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

        //Rebota en las paredes de izquierda/derecha
    if(y + dy < ballRadius) {
        dy = -dy;
    }
        //Dejamos que la pelota golpee la base.
        
        else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }

        //Dismiinuimos las vidas y ponemos mensaje de loser.
        else {
            lives--;
            if(!lives) {
                alert("Has perdido, lo siento");
                document.location.reload();}
                        
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }



    requestAnimationFrame(draw);
}

draw();