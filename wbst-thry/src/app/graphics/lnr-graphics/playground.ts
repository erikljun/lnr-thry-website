import * as Babylon from 'babylonjs';

export class Playground {
    public static CreateScene(engine: Babylon.Engine, canvas: HTMLCanvasElement): Babylon.Scene {
        let scene = new Babylon.Scene(engine);
        let camera = new Babylon.FreeCamera('camera1', new Babylon.Vector3(0, 5, -10), scene);
        camera.setTarget(Babylon.Vector3.Zero());
        camera.attachControl(canvas, true);

        let light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        let sphere = Babylon.MeshBuilder.CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);
        sphere.position.y = 1;
        sphere.scaling.y =3;

        let ground = Babylon.MeshBuilder.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2}, scene);
        return scene;
    }
}