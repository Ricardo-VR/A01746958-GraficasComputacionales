import { SolarSystem } from './SolarSystem.js'; 
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';

let orbitalControls = null;

let renderer = null, 
scene = null, 
camera = null,
root = null,
group = null;

let mercuryGroup = null, venusGroup = null, earhtGroup = null, moonGroup = null,
marsGroup = null, phobosGroup = null, deimosGroup = null, jupiterGroup = null, 
saturnGroup = null, uranusGroup = null, neptuneGroup = null, plutoGroup = null;

let currentTime = Date.now();

let bodies = {};
let traslations = {};

function main()
{
    var canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);

    
    update();
}

function animate(){
    //Sun movement
    bodies['sun'].rotation.y += getAngel(10000);

    
    traslations['mercury'] -= traslate(500);
    mercuryGroup.position.x = 10 * Math.cos(traslations['mercury']);
    mercuryGroup.position.z = 10 * Math.sin(traslations['mercury']);
    bodies['mercury'].rotation.y += getAngel(1000);

    traslations['venus'] -= traslate(700);
    venusGroup.position.x = 13 * Math.cos(traslations['venus']);
    venusGroup.position.z = 13 * Math.sin(traslations['venus']);
    bodies['venus'].rotation.y += getAngel(1500);

    traslations['earth'] -= traslate(800);
    earhtGroup.position.x = 20 * Math.cos(traslations['earth']);
    earhtGroup.position.z = 20 * Math.sin(traslations['earth']);
    bodies['earth'].rotation.y += getAngel(1600);

    traslations['moon'] -= traslate(400);
    moonGroup.position.x = 4 * Math.cos(traslations['moon']);
    moonGroup.position.z = 4 * Math.sin(traslations['moon']);
    bodies['moon'].rotation.y += getAngel(100);

    traslations['mars'] -= traslate(900);
    marsGroup.position.x = 25 * Math.cos(traslations['mars']);
    marsGroup.position.z = 25 * Math.sin(traslations['mars']);
    bodies['mars'].rotation.y += getAngel(100);

    traslations['phobos'] -= traslate(200);
    phobosGroup.position.x = 0.8 * Math.cos(traslations['phobos']);
    phobosGroup.position.z = 0.8* Math.sin(traslations['phobos']);
    bodies['phobos'].rotation.y += getAngel(100);

    traslations['deimos'] -= traslate(300);
    deimosGroup.position.x = 1.6 * Math.cos(traslations['deimos']);
    deimosGroup.position.z = 1.6 * Math.sin(traslations['deimos']);
    bodies['deimos'].rotation.y += getAngel(100);

    traslations['jupiter'] -= traslate(1200);
    jupiterGroup.position.x = 40 * Math.cos(traslations['jupiter']);
    jupiterGroup.position.z = 40 * Math.sin(traslations['jupiter']);
    bodies['jupiter'].rotation.y += getAngel(100);

    traslations['saturn'] -= traslate(2100);
    saturnGroup.position.x = 60 * Math.cos(traslations['saturn']);
    saturnGroup.position.z = 60 * Math.sin(traslations['saturn']);
    bodies['saturn'].rotation.y += getAngel(100);

    traslations['uranus'] -= traslate(2800);
    uranusGroup.position.x = 75 * Math.cos(traslations['uranus']);
    uranusGroup.position.z = 75 * Math.sin(traslations['uranus']);
    bodies['uranus'].rotation.y += getAngel(100);

    traslations['neptune'] -= traslate(3800);
    neptuneGroup.position.x = 85 * Math.cos(traslations['neptune']);
    neptuneGroup.position.z = 85 * Math.sin(traslations['neptune']);
    bodies['neptune'].rotation.y += getAngel(100);

    traslations['pluto'] -= traslate(4800);
    plutoGroup.position.x = 95 * Math.cos(traslations['pluto']);
    plutoGroup.position.z = 95 * Math.sin(traslations['pluto']);
    bodies['pluto'].rotation.y += getAngel(100);
}

function getAngel(duration){
    let now = Date.now();
    let delta = now - currentTime;
    currentTime = now;

    let fract = delta /duration;
    let angle = Math.PI * 2 * fract;

    return angle;
}

function traslate(rate){
    return 2 * Math.PI / rate;
}

function update(){
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    animate();

    // Update the camera controller
    orbitalControls.update();
}

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 400 );
    camera.position.z = 100;
    scene.add(camera);

    orbitalControls = new OrbitControls(camera, renderer.domElement);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    let light = new THREE.DirectionalLight( 0xffffff, 1);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, 0, 1);
    root.add( light );

    light = new THREE.AmbientLight ( 0x222222 );
    root.add(light);
    
    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    let solarSystem = new SolarSystem();

    let sun = solarSystem.createSun();
    bodies['sun'] = sun;
    group.add(sun);

    // Creates object Mercury
    let mercury = solarSystem.createMercury();
    traslations['mercury'] = 0;
    bodies['mercury'] = mercury;
    mercuryGroup = new THREE.Object3D;
    mercuryGroup.add(mercury);
    group.add(mercuryGroup);

    let venus = solarSystem.createVenus();
    traslations['venus'] = 0;
    bodies['venus'] = venus;
    venusGroup = new THREE.Object3D;
    venusGroup.add(venus);
    group.add(venusGroup);

    let earth = solarSystem.createEarth();
    traslations['earth'] = 0;
    bodies['earth'] = earth;
    earhtGroup = new THREE.Object3D;
    earhtGroup.add(earth);
    group.add(earhtGroup);

    let moon = solarSystem.createMoon();
    traslations['moon'] = 0;
    bodies['moon'] = moon;
    moonGroup = new THREE.Object3D;
    moonGroup.add(moon);
    earhtGroup.add(moonGroup);

    let mars = solarSystem.createMars();
    traslations['mars'] = 0;
    bodies['mars'] = mars;
    marsGroup = new THREE.Object3D;
    marsGroup.add(mars);
    group.add(marsGroup);

    let phobos = solarSystem.createPhobos();
    traslations['phobos'] = 0;
    bodies['phobos'] = phobos;
    phobosGroup = new THREE.Object3D;
    phobosGroup.add(phobos);
    marsGroup.add(phobosGroup);

    let deimos = solarSystem.createDeimos();
    traslations['deimos'] = 0;
    bodies['deimos'] = deimos;
    deimosGroup = new THREE.Object3D;
    deimosGroup.add(deimos);
    marsGroup.add(deimosGroup);

    let jupiter = solarSystem.createJupiter();
    traslations['jupiter'] = 0;
    bodies['jupiter'] = jupiter;
    jupiterGroup = new THREE.Object3D;
    jupiterGroup.add(jupiter);
    group.add(jupiterGroup);

    let saturn = solarSystem.createSaturn();
    traslations['saturn'] = 0;
    bodies['saturn'] = jupiter;
    saturnGroup = new THREE.Object3D;
    saturnGroup.add(saturn);
    group.add(saturnGroup);

    let uranus = solarSystem.createUranus();
    traslations['uranus'] = 0;
    bodies['uranus'] = uranus;
    uranusGroup = new THREE.Object3D;
    uranusGroup.add(uranus);
    group.add(uranusGroup);

    let neptune = solarSystem.createNeptune();
    traslations['neptune'] = 0;
    bodies['neptune'] = neptune;
    neptuneGroup = new THREE.Object3D;
    neptuneGroup.add(neptune);
    group.add(neptuneGroup);

    let pluto = solarSystem.createPluto();
    traslations['pluto'] = 0;
    bodies['pluto'] = pluto;
    plutoGroup = new THREE.Object3D;
    plutoGroup.add(pluto);
    group.add(plutoGroup);

    // Now add the group to our scene
    scene.add( root );
}

function createLine(){
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const  geometry = new THREE.CircleGeometry( 5, 64 );
    geometry.vertices.shift();
    const line = new THREE.LineLoop( geometry, material );

    return line
}

window.onload = () => main();