import { Scene, Sound } from 'babylonjs';

export class LnrAudioEngine {

    // The sound currently being played
    private static currentSound: Sound;

    /**
     * Plays the sound at the given filepath
     * 
     * @param url The path to the audio file
     * @param scene The scene
     * 
     * @returns void
     */
    public static playSound(url: string, scene: Scene): void {
        this.stopSound();

        this.currentSound = new Sound('music', url, scene, () => this.currentSound.play());
    }

    /**
     * Stops any sound currently being played
     * 
     * @returns void
     */
    public static stopSound(): void {
        if (this.currentSound) {
            this.currentSound.stop();
            this.currentSound = null;
        }
    }
}