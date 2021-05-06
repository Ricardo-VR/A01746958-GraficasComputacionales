let renderer = null, 
scene = null, 
camera = null;
let arrShapeGroups = [], arrSatelites = [];

let duration = 5000; // ms
let currentTime = Date.now();

function main() {
                    
    const canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);
    
    // Run the run loop
    run();
}

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    arrShapeGroups.forEach(group => {
        group.rotation.x += angle;
        group.rotation.y += angle;
    });

    arrSatelites.forEach(satelite => {
        satelite.rotation.x += angle;
        satelite.rotation.y += angle;
    });
}

function run() {
    requestAnimationFrame(function() { run(); });
    
    renderer.render( scene, camera );

    animate();
}

function randomShape(){
    let rand = Math.floor((Math.random() * 5) + 1);
    let newShape;

    if(rand == 1){
        let geometry = new THREE.BoxGeometry(1, 1, 1);

        let textureUrl = "../images/companionCube.png";
        let texture = new THREE.TextureLoader().load(textureUrl);
        let material = new THREE.MeshPhongMaterial({ map: texture });

        newShape = new THREE.Mesh(geometry, material);
    }
    else if(rand == 2){
        let geometry = new THREE.DodecahedronGeometry(0.5);

        let textureUrl = "../images/ash_uvgrid01.jpg";
        let material = setSetMaterial(textureUrl);
        
        newShape = new THREE.Mesh(geometry, material);
        
    }
    else if(rand == 3){
        let geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16);

        let textureUrl = "../images/ash_uvgrid01.jpg";
        let material = setSetMaterial(textureUrl);

        newShape = new THREE.Mesh(geometry, material);
    }
    else if(rand == 4){
        let geometry = new THREE.SphereGeometry(0.5, 20, 20);

        let textureUrl = "../images/ash_uvgrid01.jpg";
        let material = setSetMaterial(textureUrl);

        newShape = new THREE.Mesh(geometry, material);
    }
    else if(rand == 5){
        let geometry = new THREE.CylinderGeometry(0, .333, .444, 20, 20);

        let textureUrl = "../images/ash_uvgrid01.jpg";
        let material = setSetMaterial(textureUrl);

        newShape = new THREE.Mesh(geometry, material);
    }
    else {
        console.log('Number: ' + rand)
    }

    return newShape;
}

function setSetMaterial(textureUrl){
    let texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.MeshPhongMaterial({ map: texture });

    return material;
}

function addShape(){
    let newShape = randomShape();
    let newGroup = new THREE.Object3D;

    newGroup.add(newShape);

    let x = Math.floor((Math.random() * 2.5) + 1) * (Math.round(Math.random()) ? 1 : -1);
    let y = Math.floor((Math.random() * 2.5) + 1) * (Math.round(Math.random()) ? 1 : -1);
    let z = Math.floor((Math.random() * 2.5) + 1) * (Math.round(Math.random()) ? 1 : -1);

    newGroup.position.set(x, y, z);
    arrShapeGroups.push(newGroup);

    scene.add(newGroup);
}

function addSatelite(){
    let newSatelite = randomShape();
    let group = arrShapeGroups.pop();
    scene.remove(group);

    let x = Math.floor((Math.random() * 1) + 1) * (Math.round(Math.random()) ? 1 : -1);
    let y = Math.floor((Math.random() * 1) + 1) * (Math.round(Math.random()) ? 1 : -1);
    let z = Math.floor((Math.random() * 1) + 1) * (Math.round(Math.random()) ? 1 : -1);

    newSatelite.position.set(x, y, z);
    group.add(newSatelite);
    arrShapeGroups.push(group);
    arrSatelites.push(newSatelite)

    scene.add(group);
}

function clearCanvas(){
    arrShapeGroups.forEach(group=>{
        scene.remove(group);
    });

    arrShapeGroups.length = 0;
    arrSatelites.length = 0;
}

function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);
    
    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);
}