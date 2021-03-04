class Mouse{
    constructor(x, y, ){
        this.x = x;
        this.y = y;
    }
}

function updateText(value){
    document.getElementById("lblWidth").innerHTML = "Line Width: " + value;
    lineWidth = value;
}

function clearCanvas(){
    const canvas = document.getElementById("paintCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function changeColor(color){
    const canvas = document.getElementById("paintCanvas");
    const context = canvas.getContext("2d");
    context.fillStyle = color;
}

function update(context, canvas, cursor){
    requestAnimationFrame(() => update(context, canvas, cursor))

    if(mouseDown){
        context.beginPath();
        context.arc(cursor.x - 167, cursor.y - 7, lineWidth, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }
}

let mouseDown = false;
let lineWidth = 5;

function main(){
    const canvas = document.getElementById("paintCanvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "black";

    const cursor = new Mouse(0,0);

    document.addEventListener("mouseup", event => mouseDown = false);
    document.addEventListener("mousedown", event => mouseDown = true);
    document.addEventListener("mousemove", event => {
        cursor.x = event.clientX; 
        cursor.y = event.clientY
    });

    update(context, canvas, cursor)
}