import { Scene, Sound } from 'babylonjs';

export class LnrAudioEngine {

    private static currentSound: Sound;

    public static playSound(url: string, scene: Scene): void {
        this.stopSound();

        this.currentSound = new Sound('music', url, scene, () => this.currentSound.play());
    }

    public static stopSound(): void {
        if (this.currentSound) {
            this.currentSound.stop();
            this.currentSound = null;
        }
    }
}