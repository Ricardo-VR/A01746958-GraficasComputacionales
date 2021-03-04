class Triangle{
    constructor(x, y, len){
        this.x= x;
        this.y = y;
        this.len = len;
    }

    draw(context){
        context.fillStyle = "white";

        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.len / 2, this.y - this.len * Math.sin(Math.PI/3));
        context.lineTo(this.x + this.len, this.y);
        context.lineTo(this.x, this.y);
        context.closePath();
        context.fill();
    }
}

function sierpinskiTriangle(triangle, depth, context){
    if(depth == 0){
        triangle.draw(context)
    }
    else{
        let newLen = triangle.len / 2;
        let newTriangles = []

        let triangleA = new Triangle(triangle.x, triangle.y, newLen)
        let triangleB = new Triangle(triangle.x + newLen / 2, triangle.y - newLen * Math.sin(Math.PI/3), newLen)
        let triangleC = new Triangle(triangle.x + newLen, triangle.y, newLen)

        newTriangles.push(triangleA)
        newTriangles.push(triangleB)
        newTriangles.push(triangleC)
        newTriangles.forEach((newTriangle) => {
            sierpinskiTriangle(newTriangle, depth - 1, context)
        });
    }
}

function changeDepth(){
    
    const canvas = document.getElementById("triCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    depth = document.getElementById("sierpDepth").value;
    document.getElementById("lblWidth").innerHTML = "Depth: " + depth;

    sierpinskiTriangle(mainTriangle, depth, context)
}

const mainTriangle = new Triangle(150, 280, 300);
let depth;

function main(){
    changeDepth()
}