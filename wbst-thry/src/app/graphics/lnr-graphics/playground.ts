import * as Babylon from 'babylonjs';

export class Playground {
    // test comment
    public static CreateScene(engine: Babylon.Engine, canvas: HTMLCanvasElement): Babylon.Scene {
        // set up scene and camera
        let scene = new Babylon.Scene(engine);
        let camera = new Babylon.FlyCamera('camera1', new Babylon.Vector3(0, 5, -50), scene);
        camera.setTarget(Babylon.Vector3.Zero());
        camera.attachControl(canvas, true);

        // set up lighting
        let light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // set up space background
        var skyBox = Babylon.Mesh.CreateBox('skyBox', 100, scene);
        var skyBoxMaterial = new Babylon.StandardMaterial('skyBox', scene);
        skyBoxMaterial.backFaceCulling = false;
        skyBoxMaterial.disableLighting = true;
        skyBox.material = skyBoxMaterial;
        skyBox.infiniteDistance = true;
        skyBoxMaterial.reflectionTexture = new Babylon.CubeTexture('../../assets/blue/blue', scene);
        skyBoxMaterial.reflectionTexture.coordinatesMode = Babylon.Texture.SKYBOX_MODE;
        skyBox.renderingGroupId = 0;

        // set up central planet
        let planet = Babylon.MeshBuilder.CreateSphere('planet', { segments: 16, diameter: 4 }, scene);
        planet.renderingGroupId = 1;

        // orbit parameters
        let radius = 30;
        let orbitTilt = -.2;
        let speed = .001;

        // set up moon
        let moon = Babylon.MeshBuilder.CreateSphere('moon', { segments: 16, diameter: 1}, scene);
        moon.position.z = -radius;
        moon.renderingGroupId = 1;

        var tick = 0;

        scene.registerBeforeRender(() => {

            moon.position.x = radius*Math.sin(speed*tick)*Math.cos(orbitTilt);
            moon.position.y = radius*Math.sin(speed*tick)*Math.sin(orbitTilt);
            moon.position.z = -radius*Math.cos(speed*tick);

            tick++;
        });

        return scene;
    }
}