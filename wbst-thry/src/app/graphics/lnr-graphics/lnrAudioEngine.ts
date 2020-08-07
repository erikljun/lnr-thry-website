import { Analyser, AudioEngine, Engine, ParticleSystem, Scene, Sound, Texture, Mesh } from 'babylonjs';

export class LnrAudioEngine {

    private static currentSound: Sound;

    private static registeredParticleUpdater: () => void;

    private static particleSystem: ParticleSystem;

    public static playSound(url: string, scene: Scene, mesh: Mesh): void {
        this.stopSound();

        this.currentSound = new Sound('music', url, scene, () => this.currentSound.play());

        let analyser = new Analyser(scene);

        (<AudioEngine>Engine.audioEngine).connectToAnalyser(analyser);
        
        if (!this.particleSystem) {
            this.particleSystem = new ParticleSystem('particles', 2000, scene);
            this.particleSystem.particleTexture = new Texture('../../assets/favicon.jpg', scene);
            this.particleSystem.emitter = mesh;
            this.particleSystem.minSize = .01;
            this.particleSystem.maxSize = .1;
        }

        this.particleSystem.start();

        this.registeredParticleUpdater = () => {
            let bins = analyser.getFrequencyBinCount();
            let magnitude = analyser.getByteFrequencyData().reduce((sum, currentValue, index) => sum + currentValue*(bins - index)/bins);
            let avg = magnitude / analyser.getFrequencyBinCount();
            console.log('avg:', avg);
            let rate = 2000 / (1 + 2**(-(avg-50) + 11)) //(avg - 60)**4;
            this.particleSystem.emitRate = rate
            console.log('rate:', rate);
        };

        scene.registerBeforeRender(this.registeredParticleUpdater);

    }

    public static stopSound(): void {
        if (this.currentSound) {
            this.currentSound.stop();
            this.currentSound = null;
        }
        if (this.particleSystem) {
            this.particleSystem.stop();
        }
    }
}