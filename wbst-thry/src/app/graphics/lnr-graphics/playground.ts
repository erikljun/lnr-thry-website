import * as Babylon from 'babylonjs';
import { makeNoise3D } from 'open-simplex-noise';
import MeshTriggers from './meshTriggers';

export class Playground {

    private static planetPoints: Babylon.FloatArray;

    public static createScene(engine: Babylon.Engine, canvas: HTMLCanvasElement): Babylon.Scene {
        // set up scene and camera
        let scene = new Babylon.Scene(engine);
        let camera = new Babylon.FlyCamera('camera1', new Babylon.Vector3(0, 5, -50), scene);
        let highlightLayer = new Babylon.HighlightLayer("hl", scene);
        scene.activeCamera = camera

        camera.setTarget(Babylon.Vector3.Zero());
        camera.attachControl(canvas, true);

        // set up lighting
        let light = new Babylon.HemisphericLight('light1', new Babylon.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // set up space background
        this.buildSky(scene);
        // set up central planet
        this.buildCentralPlanet(scene, highlightLayer);
        // set up moon
        this.buildMoon(scene, highlightLayer);

        // this.buildSimplex(scene);

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
        let planet = Babylon.MeshBuilder.CreateSphere('planet', { segments: 16, diameter: 4, updatable: true }, scene);
        planet.renderingGroupId = 1;
        this.planetPoints = planet.getVerticesData(Babylon.VertexBuffer.PositionKind, true, false);
        let planetMaterial = new Babylon.StandardMaterial('planetMaterial', scene);
        planetMaterial.diffuseTexture = new Babylon.Texture('../../assets/textures/yellowstone1.JPG', scene);
        planet.material = planetMaterial;
        planet.actionManager = new Babylon.ActionManager(scene);

        scene.registerBeforeRender(() => {
            this.randomizeMesh(planet);
        });
        
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

        let moon = Babylon.MeshBuilder.CreateSphere('moon', { segments: 16, diameter: 1 }, scene);
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

    private static randomizeMesh(mesh: Babylon.Mesh): void {
        let noise3D = makeNoise3D(Date.now());
        let noisedPoints = mesh.getVerticesData(Babylon.VertexBuffer.PositionKind);

        for (var i = 0; i < mesh.getTotalVertices(); i++) {
            var fx = this.planetPoints[i * 3];
            var fy = this.planetPoints[i * 3 + 1];
            var fz = this.planetPoints[i * 3 + 2];

            let noise = noise3D(fx, fy, fz)/10;
            console.log('noise:', noise);

            noisedPoints[i * 3] = fx + (Math.random() - .5) / 50;
            noisedPoints[i * 3 + 1] = fy + (Math.random() - .5) / 50;
            noisedPoints[i * 3 + 2] = fz + (Math.random() - .5) / 50;
        }

        mesh.updateVerticesData(Babylon.VertexBuffer.PositionKind, noisedPoints);
    }

    // private static buildSimplex(scene: Babylon.Scene): void {
    //     // let simplex = new Babylon.SimplexPerlin3DBlock('simplex');
    //     // simplex.registerInput()
    //     // let nodeMaterial = new Babylon.NodeMaterial('nodeMat', scene, { emitComments: true });
        
    //     // let positionInput = new Babylon.InputBlock('position');
    //     // positionInput.setAsAttribute('position');

    //     // simplex.autoConfigure(nodeMaterial);
    //     // console.log('simplex:', simplex.outputs);

    //     let noise3D = makeNoise3D(Date.now());

    //     let noiseMesh = Babylon.MeshBuilder.CreateSphere('noiseMesh', { segments: 16, diameter: 3, updatable: true }, scene);

    //     let noisedPoints = noiseMesh.getVerticesData(Babylon.VertexBuffer.PositionKind);
    //     console.log('points:', noisedPoints.length);
    //     console.log('numPoints:', noiseMesh.getTotalVertices());

    //     for (var i = 0; i < noiseMesh.getTotalVertices(); i++) {
    //         var fx = noisedPoints[i * 3];
    //         var fy = noisedPoints[i * 3 + 1];
    //         var fz = noisedPoints[i * 3 + 2];

    //         let noise = noise3D(fx, fy, fz);

    //         noisedPoints[i * 3] = fx * noise;
    //         noisedPoints[i * 3 + 1] = fy * noise;
    //         noisedPoints[i * 3 + 2] = fz * noise;
    //     }

    //     noiseMesh.updateVerticesData(Babylon.VertexBuffer.PositionKind, noisedPoints);

    //     // let noiseTexture = new Babylon.NoiseProceduralTexture('perlin', 256, scene);
    //     // noiseTexture.is3D = true;
    //     // noiseTexture.coordinatesMode = 1;
    //     // console.log('texture:', noiseTexture);
    // }

//     private static particleStuff() {
// // let particleSystem = new Babylon.ParticleSystem('particles', 200, scene);
//         // particleSystem.particleTexture = new Babylon.Texture('../../assets/favicon.jpg', scene);

//         // let noiseTexture = new Babylon.NoiseProceduralTexture('perlin', 256, scene);
//         // noiseTexture.animationSpeedFactor = 5;
//         // noiseTexture.persistence = 2;
//         // noiseTexture.brightness = 0.5;
//         // noiseTexture.octaves = 2;

//         // particleSystem.noiseTexture = noiseTexture;
//         // particleSystem.noiseStrength = new Babylon.Vector3(100, 100, 100);
//         // particleSystem.emitRate = 1500;

//         // // Size of each particle (random between...
//         // particleSystem.minSize = 0.1;
//         // particleSystem.maxSize = 0.5;

//         // // Life time of each particle (random between...
//         // particleSystem.minLifeTime = 0.3;
//         // particleSystem.maxLifeTime = 1.5;
        
//         // // Fountain object
//         // let fountain = Babylon.Mesh.CreateBox('fountain', .01, scene);
//         // // var fountain = BABYLON.Mesh.CreateBox('box', .1, scene);
//         // particleSystem.emitter = fountain;
//         // particleSystem.particleEmitterType = new Babylon.BoxParticleEmitter();
//         // particleSystem.minEmitBox = new Vector3(0, 0, 0); // Starting all from
//         // particleSystem.maxEmitBox = new Vector3(0, 0, 0); // To...

//         // // Direction of each particle after it has been emitted
//         // particleSystem.direction1 = new Vector3(-1, 4, 1);
//         // particleSystem.direction2 = new Vector3(1, 4, -1);

//         // // Angular speed, in radians
//         // particleSystem.minAngularSpeed = 0;
//         // particleSystem.maxAngularSpeed = Math.PI;

//         // // Speed
//         // particleSystem.minEmitPower = 0;
//         // particleSystem.maxEmitPower = 0;
//         // particleSystem.updateSpeed = 0.005;

//         // particleSystem.start();
//     }
}