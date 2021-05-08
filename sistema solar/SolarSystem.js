
class SolarSystem {
    constructor(){

        this.createSun = function(){
            let material = this.getMaterial("./assets/sunmap.jpg");

            let geometry = new THREE.SphereGeometry(6, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);
            sphereTextured.visible = true;

            return sphereTextured;
        }

        this.createMercury = function(){
            let material = this.getMatnBump("./assets/mercurymap.jpg", "./assets/mercurybump.jpg");

            let geometry = new THREE.SphereGeometry(0.5, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createVenus = function(){
            let material = this.getMatnBump("./assets/venusmap.jpg", "./assets/venusbump.jpg");

            let geometry = new THREE.SphereGeometry(0.6, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createEarth = function(){
            let material = this.getNormal("./assets/earthmap.jpg", "./assets/earthnormal.jpg", "./assets/earthspecular.jpg");

            let geometry = new THREE.SphereGeometry(0.8, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createMoon = function(){
            let material = this.getMatnBump("./assets/moonmap.jpg", "./assets/moonbump.jpg");

            let geometry = new THREE.SphereGeometry(0.35, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createMars = function(){
            let material = this.getNormal("./assets/marscolor.jpg", "./assets/marsbump.jpg", "./assets/marsnormal.jpg");

            let geometry = new THREE.SphereGeometry(0.4, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createPhobos = function(){
            let material = this.getMaterial("./assets/phobosbump.jpg");

            let geometry = new THREE.SphereGeometry(0.133, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        
        this.createDeimos = function(){
            let material = this.getMaterial("./assets/deimosbump.jpg");

            let geometry = new THREE.SphereGeometry(0.06, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createJupiter = function(){
            let material = this.getMaterial("./assets/jupiter.jpg");

            let geometry = new THREE.SphereGeometry(4.4, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createSaturn = function(){
            let material = this.getMaterial("./assets/saturnmap.jpg");

            let geometry = new THREE.SphereGeometry(7.2, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createUranus = function(){
            let material = this.getMaterial("./assets/uranusmap.jpg");

            let geometry = new THREE.SphereGeometry(3.2, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createNeptune = function(){
            let material = this.getMaterial("./assets/neptunemap.jpg");

            let geometry = new THREE.SphereGeometry(3, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.createPluto = function(){
            let material = this.getMatnBump("./assets/plutomap.jpg", "./assets/plutobump.jpg");

            let geometry = new THREE.SphereGeometry(0.4, 20, 20);
            
            let sphereTextured = new  THREE.Mesh(geometry, material);

            return sphereTextured;
        }

        this.getMaterial = function(mapURL){
            let textureMap = new THREE.TextureLoader().load(mapURL);
            let material = new THREE.MeshPhongMaterial({map: textureMap});

            return material;
        }

        this.getMatnBump = function(mapURL, bumpURL){
            let textureMap = new THREE.TextureLoader().load(mapURL);
            let bumpMap = new THREE.TextureLoader().load(bumpURL);

            let material = new THREE.MeshPhongMaterial({map: textureMap, bumpMap: bumpMap, bumpScale: 0.06});

            return material;
        }

        this.getNormal = function(mapURL, normalURL, specularURL){
            let map = new THREE.TextureLoader().load(mapURL);
            let normalMap = new THREE.TextureLoader().load(normalURL);
            let specularMap = new THREE.TextureLoader().load(specularURL);

            let material = new THREE.MeshPhongMaterial({ map: map, normalMap: normalMap, specularMap: specularMap });

            return material;
        }


    }


}

export {SolarSystem}