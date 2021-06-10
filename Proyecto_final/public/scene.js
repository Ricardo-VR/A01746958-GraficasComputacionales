import * as THREE from './three/build/three.module.js';
import { FBXLoader } from './three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from './three/examples/jsm/controls/DragControls.js';


let renderer = null, scene = null, camera = null, root = null, group = null, orbitControls = null, dragControls = null, 
skyboxGeo = null, skybox = null;

let warriors = [];
let soldiers = [];
let archers = [];
let mutants = [];

let mutantsDirect= [];

let currentTime = Date.now();

let spotLight = null, ambientLight = null;
let directionalLight = null;
let mapUrl = './public/assets/Skybox/flame/flame_dn.jpg';
let isDragging = false;
let enableSelection = false;

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

let modelUrls = ["./public/assets/fwarrior_defeated.fbx", "./public/assets/soldier_taunt.fbx", "./public/assets/erika_archer.fbx", "./public/assets/mutant_walking.fbx"];
let archerAnimations = ["./public/assets/standing idle 01"];


let assetsUrls = ["./public/assets/rock_1/Rock_7.fbx", "./public/assets/rock_2/Rock_5.fbx"];
let skyboxes = ["flame", "coulee", "forestrytwo"]
let skyboxLight = [0xa20900, 0xE0B64A, 0x17620e];
let skyboxIntense = [0.25,0.25, 0.10];
let skyboxAmbient = [0.3, 0.8, 0.3]

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

function main() 
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    for(let i = 0; i < 4; i++){
        let button = document.getElementById("char_" + i);
        button.addEventListener('click', (event) => { addNewObject(i); });
    }

    for(let i = 0; i < 3; i++){
        let button = document.getElementById("skybox_" + i);
        button.addEventListener('click', (event) => { changeSkybox(i); });
    }
    
    update();

}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );

    if(!isDragging){
        orbitControls.update();
    }

    animate();
}

function animate(){
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    warriors.forEach((object) => {
        object.animations[1].getMixer().update(deltat * 0.001);
    });

    soldiers.forEach((object) => {
        object.animations[0].getMixer().update(deltat * 0.001);
    });

    archers.forEach((object) => {
        object.animations[1].getMixer().update(deltat * 0.001);
    });

    mutants.forEach((object, index) => {

        let worldPosition = object.getWorldPosition();

        if(worldPosition.z >= 60){
            mutantsDirect[index] = -1;

            object.rotateY(Math.PI)
        }
        else if(worldPosition.z <= -60){
            mutantsDirect[index] = 1

            object.rotateY(Math.PI)
        }

        object.position.z += mutantsDirect[index] * 0.01 * deltat;

        object.animations[0].getMixer().update(deltat * 0.001);
    });
}

function createPasthStrings(skybox){
    const strPath = "./public/assets/Skybox/" + skybox + "/";
    const strFileType = ".jpg"
    const arrSides = ["ft", "bk", "up", "dn", "rt", "lf",]

    let arrSkyboxpath = arrSides.map(side => {
        return strPath + skybox + "_" + side + strFileType;
    });

    return arrSkyboxpath;
}

function createSkybox(skybox){

    const arrSkyboxPaths = createPasthStrings(skybox);

    let arrMaterials = arrSkyboxPaths.map(path => {
        let texture = new THREE.TextureLoader().load(path);

        return new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide})
    });

    return arrMaterials;
}

async function loadModels(){
    const fbxloader = new FBXLoader();

    let x = -40;

    try{
        modelUrls.forEach((url, index )=> {         
            fbxloader.load(url, function (object){
                if(index == 0){
                    object.scale.set(0.03, 0.03, 0.03)
                    
                }
                else
                {
                    object.scale.set(0.1, 0.1, 0.1)
                }
                
                object.traverse( function (child){

                    object.position.x = x;
                    object.position.y = -100;
                    
                    if(child.isMesh){
                        child.castShadow = true;
						child.receiveShadow = true;
                    }
                });

                scene.add(object);

                switch(index){
                    case 0:
                        object.animations[1] = new THREE.AnimationMixer( scene ).clipAction(object.animations[1] , object);
                        object.animations[1].play();
                        warriors.push(object);
                        break;
    
                    case 1:
                        object.animations[0] = new THREE.AnimationMixer( scene ).clipAction(object.animations[0] , object);
                        object.animations[0].play();
                        soldiers.push(object);
                        break;
                    
                    case 2:
                        object.animations[1] = new THREE.AnimationMixer( scene ).clipAction(object.animations[1] , object);
                        object.animations[1].play();

                        archers.push(object);
                        break;
                    
                    case 3:
                        object.animations[0] = new THREE.AnimationMixer( scene ).clipAction(object.animations[0] , object);
                        object.animations[0].play();

                        mutantsDirect.push(1)

                        mutants.push(object);
                        break;
                }

                x += 40;
            });
            
        });
    }
    catch(error){
        console.error(error);
    }
}

async function loadAssets(){
    const fbxloader = new FBXLoader();

    try{
        assetsUrls.forEach((url, index) => {
            fbxloader.load(url, function (object){
                object.traverse( function (child){
    
                    let x = Math.floor((Math.random() * 90) + 1) * (Math.round(Math.random()) ? 1 : -1);
                    let z = Math.floor((Math.random() * 90) + 1) * (Math.round(Math.random()) ? 1 : -1);
                    let scl = 0.015
                    let rotation = (Math.random() * 2 / Math.random() * 2) * Math.PI;
    
                    object.scale.set(scl, scl, scl);
                    object.position.x = x;
                    object.position.z = z;
                    object.position.y = -100;
                    object.rotation.y = rotation;
                    
                    if(child.isMesh){
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
    
                    scene.add(object);
                });
            });
        });
    }
    catch(error){
        console.error(error);
    }
}

async function addNewObject(model){
    try{
        const fbxloader = new FBXLoader();
        console.log(model);

        fbxloader.load(modelUrls[model], function (object){
            if(model == 0){
                object.scale.set(0.03, 0.03, 0.03)
            }
            else
            {
                object.scale.set(0.1, 0.1, 0.1)
            }

            console.log(object);

            object.traverse( function (child){

                let x = Math.floor((Math.random() * 70) + 1) * (Math.round(Math.random()) ? 1 : -1);
                let z = Math.floor((Math.random() * 70) + 1) * (Math.round(Math.random()) ? 1 : -1);

                object.position.x = x;
                object.position.z = z;
                object.position.y = -100;
                
                if(child.isMesh){
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(object);

            switch(model){
                case 0:
                    object.animations[1] = new THREE.AnimationMixer( scene ).clipAction(object.animations[1] , object);
                    object.animations[1].play();
                    
                    warriors.push(object);
                    break;

                case 1:
                    object.animations[0] = new THREE.AnimationMixer( scene ).clipAction(object.animations[0] , object);
                    object.animations[0].play();

                    soldiers.push(object);
                    break;
                
                case 2:
                    object.animations[1] = new THREE.AnimationMixer( scene ).clipAction(object.animations[1] , object);
                    object.animations[1].play();

                    archers.push(object);
                    break;
                
                case 3:
                    object.animations[0] = new THREE.AnimationMixer( scene ).clipAction(object.animations[0] , object);
                    object.animations[0].play();

                    mutantsDirect.push(1);

                    mutants.push(object);
                    break;
            }
        });
    }
    catch(error){
        console.error(error)
    }
}

function changeSkybox(skyboxId){
    let skyboxName = skyboxes[skyboxId];
    const arrMaterials = createSkybox(skyboxName);

    group.remove(skybox);
    scene.remove(skybox)
    root.remove(directionalLight);
    root.remove(spotLight);
    root.remove(ambientLight);

    skybox = new THREE.Mesh(skyboxGeo, arrMaterials);
    group.add(skybox);
    scene.add(skybox)

    directionalLight = new THREE.DirectionalLight( skyboxLight[skyboxId], skyboxIntense[skyboxId]);

    directionalLight.position.set(.5, 1, -3);
    directionalLight.target.position.set(0,0,0);
    directionalLight.castShadow = true;
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0xaaaaaa);
    spotLight.position.set(2, 30, 90);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( skyboxLight[skyboxId], skyboxAmbient[skyboxId]);
    root.add(ambientLight);
    
    mapUrl = "./public/assets/Skybox/" + skyboxName + "/"+ skyboxName + "_dn.jpg"

    let map = new THREE.TextureLoader().load(mapUrl);

    let geometry = new THREE.PlaneGeometry(250, 250, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -100.02;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add( mesh );
}

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.BasicShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xa20900, 0.25);

    // Create and add all the lights
    directionalLight.position.set(.5, 1, -3);
    directionalLight.target.position.set(0,0,0);
    directionalLight.castShadow = true;
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0xaaaaaa);
    spotLight.position.set(2, 30, 90);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0xa20900, 0.3);
    root.add(ambientLight);

    for (let i = 0; i < 15; i++) {
        loadAssets();
    }

    loadModels();
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    let map = new THREE.TextureLoader().load(mapUrl);

    // Put in a ground plane to show off the lighting
    let geometry = new THREE.PlaneGeometry(250, 250, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -100.02;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    group.add( mesh );

    const arrMaterials = createSkybox("flame")

    skyboxGeo = new THREE.BoxGeometry(500, 500, 500);
    skybox = new THREE.Mesh(skyboxGeo, arrMaterials);

    group.add(skybox);
    
    scene.add( root );

    dragControls = new DragControls([... warriors], camera, renderer.domElement);
    dragControls.addEventListener('drag', update)

    document.addEventListener( 'click', onClick );
	window.addEventListener( 'keydown', onKeyDown );
	window.addEventListener( 'keyup', onKeyUp );

    update();
}

function onKeyDown( event ) {

    enableSelection = ( event.keyCode === 16 ) ? true : false;

}

function onKeyUp() {

    enableSelection = false;

}


function onClick( event ) {

    event.preventDefault();

    if ( enableSelection === true ) {

        const draggableObjects = dragControls.getObjects();
        draggableObjects.length = 0;

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        const intersections = raycaster.intersectObjects( warriors, true );

        if ( intersections.length > 0 ) {

            const object = intersections[ 0 ].object;

            if ( group.children.includes( object ) === true ) {

                object.material.emissive.set( 0x000000 );
                scene.attach( object );

            } else {

                object.material.emissive.set( 0xaaaaaa );
                group.attach( object );

            }

            dragControls.transformGroup = true;
            draggableObjects.push( group );

        }

        if ( group.children.length === 0 ) {

            dragControls.transformGroup = false;
            draggableObjects.push( ...warriors );

        }

    }

    update();

}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main()
    resize(); 
};

window.addEventListener('resize', resize, false);