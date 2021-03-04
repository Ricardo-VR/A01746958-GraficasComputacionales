class bar{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(context){
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    moveUp(){
        this.y -= 1;
    }

    moveDown(){
        this.y += 1;
    }

    update(keysDown){
        if(keysDown['q']){
            this.moveUp();
        }

        if(keysDown['a']){
            this.moveDown();
        }
    }
}

let keysDown = {
    'q' : false,
    'a' : false
}

function update(context, canvas, leftBar, rightBar){
    requestAnimationFrame(() => update(context, canvas, leftBar, rightBar))

    context.clearRect(0, 0, canvas.width, canvas.height);

    leftBar.draw(context)
    leftBar.update(keysDown)

    rightBar.draw(context)
    rightBar.update(keysDown)
}

function main()
{
    const canvas = document.getElementById("pongCanvas");
    const context = canvas.getContext("2d");

    const leftBar = new bar(10, 10, 20, 60);
    const rightBar = new bar(570, 10, 20, 60)

    document.addEventListener("keydown", event => keysDown[event.key] = true);
    document.addEventListener("keyup", event => keysDown[event.key] = false);

    update(context, canvas, leftBar, rightBar);
}