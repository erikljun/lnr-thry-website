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
        // set up pyramid
        this.buildPyramid(scene, highlightLayer);

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

    private static buildPyramid(scene: Babylon.Scene, highlightLayer: Babylon.HighlightLayer): void {
        let pyramid;

        Babylon.SceneLoader.Append('../../assets/objects/pyramid.obj', '', scene, (scene) => {
            pyramid = <Babylon.Mesh>scene.getMeshByName('Pyramid.001');

            let radius = 25;
            let orbitTilt = -.2;
            let orbitSpeed = .0015;

            let rotationAxis = new Babylon.Vector3(0, 1, 0);
            let rotationSpeed = .02;

            pyramid.renderingGroupId = 1;

            let pyramidMaterial = new Babylon.StandardMaterial('pyramidMaterial', scene);
            pyramidMaterial.diffuseTexture = new Babylon.Texture('../../assets/textures/pyramid texture.png', scene);
            pyramidMaterial.emissiveTexture = new Babylon.Texture('../../assets/textures/pyramid emissive.png', scene);
            pyramidMaterial.bumpTexture = new Babylon.Texture('../../assets/textures/pyramid bump.png', scene);

            pyramid.material = pyramidMaterial;

            let glowLayer = new Babylon.HighlightLayer('glowLayer', scene);
            glowLayer.addMesh(pyramid, new Babylon.Color3(.8, .1, .7), true);
            glowLayer.innerGlow = true;

            var tick = 0;
            scene.registerBeforeRender(() => {
                pyramid.position.x = -radius*Math.sin(orbitSpeed*tick)*Math.cos(orbitTilt);
                pyramid.position.y = -radius*Math.sin(orbitSpeed*tick)*Math.sin(orbitTilt);
                pyramid.position.z = radius*Math.cos(orbitSpeed*tick);

                pyramid.rotationQuaternion = Babylon.Quaternion.RotationAxis(rotationAxis, tick*rotationSpeed);

                tick++;
            });

            pyramid.actionManager = new Babylon.ActionManager(scene);
            MeshTriggers.highlightOnHover(pyramid, highlightLayer, Babylon.Color3.Purple());
            MeshTriggers.zoomOnClick(pyramid, scene);
        });
    }
}