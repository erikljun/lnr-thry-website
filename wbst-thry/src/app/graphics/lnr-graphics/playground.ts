import * as Babylon from 'babylonjs';
import MeshTriggers from './meshTriggers';
import 'babylonjs-loaders';

export class Playground {
    public static createScene(engine: Babylon.Engine, canvas: HTMLCanvasElement): Babylon.Scene {
        // set up scene and camera
        let scene = new Babylon.Scene(engine);
        let camera = new Babylon.FlyCamera('camera1', new Babylon.Vector3(0, 5, -50), scene);
        let highlightLayer = new Babylon.HighlightLayer("hl", scene);
        scene.activeCamera = camera

        camera.setTarget(Babylon.Vector3.Zero());
        camera.attachControl(true);

        // set up lighting
        let light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // set up space background
        this.buildSky(scene);
        // set up central planet
        this.buildCentralPlanet(scene, highlightLayer);
        // set up moon
        this.buildMoon(scene, highlightLayer);
        // set up obj
        this.buildObj(scene, highlightLayer);

        return scene;
    }

    private static buildSky(scene: Babylon.Scene): void {
        var skyBox = Babylon.Mesh.CreateBox('skyBox', 100, scene);
        var skyBoxMaterial = new Babylon.StandardMaterial('skyBox', scene);
        skyBoxMaterial.backFaceCulling = false;
        skyBoxMaterial.disableLighting = true;
        skyBox.material = skyBoxMaterial;
        skyBox.infiniteDistance = true;
        skyBoxMaterial.reflectionTexture = new Babylon.CubeTexture('../../assets/blue/blue', scene);
        skyBoxMaterial.reflectionTexture.coordinatesMode = Babylon.Texture.SKYBOX_MODE;
        skyBox.renderingGroupId = 0;
    }

    private static buildCentralPlanet(scene: Babylon.Scene, highlightLayer: Babylon.HighlightLayer): void {
        let planet = Babylon.MeshBuilder.CreateSphere('planet', { segments: 16, diameter: 4 }, scene);
        planet.renderingGroupId = 1;
        let planetMaterial = new Babylon.StandardMaterial('planetMaterial', scene);
        planetMaterial.diffuseTexture = new Babylon.Texture('../../assets/textures/planet1.jpg', scene);
        planet.material = planetMaterial;
        planet.actionManager = new Babylon.ActionManager(scene);
        
        MeshTriggers.highlightOnHover(planet, highlightLayer, Babylon.Color3.Purple());
    }

    private static buildMoon(scene: Babylon.Scene, highlightLayer: Babylon.HighlightLayer): void {
        // orbit parameters
        let radius = 30;
        let orbitTilt = -.2;
        let orbitSpeed = .001;

        // rotation parameters
        let rotationAxis = new Babylon.Vector3(.5, 1, 0);
        let rotationSpeed = .02;

        let moon = Babylon.MeshBuilder.CreateSphere('moon', { segments: 16, diameter: 1}, scene);
        moon.renderingGroupId = 1;
        let moonMaterial = new Babylon.StandardMaterial('moonMaterial', scene);
        moonMaterial.diffuseTexture = new Babylon.Texture('../../assets/textures/moon.jpg', scene);
        moon.material = moonMaterial;
        
        moon.position.z = -radius;
                
        var tick = 0;
        scene.registerBeforeRender(() => {

            moon.position.x = radius*Math.sin(orbitSpeed*tick)*Math.cos(orbitTilt);
            moon.position.y = radius*Math.sin(orbitSpeed*tick)*Math.sin(orbitTilt);
            moon.position.z = -radius*Math.cos(orbitSpeed*tick);

            moon.rotationQuaternion = Babylon.Quaternion.RotationAxis(rotationAxis, tick*rotationSpeed);

            tick++;
        });

        moon.actionManager = new Babylon.ActionManager(scene);
        MeshTriggers.highlightOnHover(moon, highlightLayer, Babylon.Color3.Purple());
        MeshTriggers.zoomOnClick(moon, scene);
    }

    private static buildObj(scene: Babylon.Scene, highlightLayer: Babylon.HighlightLayer): void {
        let cone;

        Babylon.SceneLoader.Append('../../assets/objects/y2.obj', '', scene, (scene) => {
            cone = <Babylon.Mesh>scene.getMeshByName('Cone.001');

            // cone.material = scene.getMaterialByName('Greebles');
            // console.log(cone.material);

            let radius = 25;
            let orbitTilt = -.2;
            let orbitSpeed = .0015;

            let rotationAxis = new Babylon.Vector3(0, 1, 0);
            let rotationSpeed = .02;

            cone.renderingGroupId = 1;

            let coneMaterial = new Babylon.StandardMaterial('coneMaterial', scene);
            coneMaterial.diffuseTexture = new Babylon.Texture('../../assets/textures/greeble3.png', scene);
            coneMaterial.emissiveTexture = new Babylon.Texture('../../assets/textures/greeble emit.png', scene);
            coneMaterial.bumpTexture = new Babylon.Texture('../../assets/textures/greeble bump.png', scene);
            // coneMaterial.specularTexture = new Babylon.Texture('../../assets/textures/greeble emit.png', scene);
            // coneMaterial.specularPower = 100000;

            cone.material = coneMaterial;

            let glow = new Babylon.HighlightLayer('hl1', scene);
            glow.addMesh(cone, new Babylon.Color3(.8, .1, .7), true);
            glow.innerGlow = true;

            console.log(cone);

            var tick = 0;
            scene.registerBeforeRender(() => {
                cone.position.x = -radius*Math.sin(orbitSpeed*tick)*Math.cos(orbitTilt);
                cone.position.y = -radius*Math.sin(orbitSpeed*tick)*Math.sin(orbitTilt);
                cone.position.z = radius*Math.cos(orbitSpeed*tick);

                cone.rotationQuaternion = Babylon.Quaternion.RotationAxis(rotationAxis, tick*rotationSpeed);

                tick++;
            });

            cone.actionManager = new Babylon.ActionManager(scene);
            MeshTriggers.highlightOnHover(cone, highlightLayer, Babylon.Color3.Purple());
            MeshTriggers.zoomOnClick(cone, scene);

        });
    }
}