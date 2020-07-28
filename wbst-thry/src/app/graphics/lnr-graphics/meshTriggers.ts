import * as Babylon from 'babylonjs';
import { FlyCamera } from 'babylonjs';

// Makes use of actions https://doc.babylonjs.com/how_to/how_to_use_actions
export default class MeshTriggers {
    /**
    * Registers actions to a given mesh to enable highlighting the object with a given color
    * 
    * @param mesh - Object to highlight on hover
    * @param highlightLayer - The Babylon EffectLayer associated with the given scene of the mesh
    * @param color - Babylon rgb color used for the highlight
    * 
    * @returns void
    * 
    */
    public static highlightOnHover(mesh: Babylon.Mesh, highlightLayer: Babylon.HighlightLayer, 
                                       color: Babylon.Color3): void {
        // OnPointerOverTrigger use for hover over
        mesh.actionManager.registerAction(
            new Babylon.ExecuteCodeAction(
                Babylon.ActionManager.OnPointerOverTrigger,
                function() {
                    highlightLayer.addMesh(mesh, color);
                }
            )
        );

        // OnPointerOutTrigger use for hover off
        mesh.actionManager.registerAction(
            new Babylon.ExecuteCodeAction(
                Babylon.ActionManager.OnPointerOutTrigger,
                function() {
                    highlightLayer.removeMesh(mesh);
                }
            )
        );
    }

    public static zoomOnClick(mesh: Babylon.Mesh, scene: Babylon.Scene): void {
        mesh.actionManager.registerAction(
            new Babylon.ExecuteCodeAction(
                Babylon.ActionManager.OnPickTrigger,
                () => {
                    this.followMesh(mesh, scene);
                }
            )
        );
    }

    private static followMesh(mesh: Babylon.Mesh, scene: Babylon.Scene, desiredDistance = 5, maxSpeed = .2): void {
        scene.registerBeforeRender(() => {
            let currentDistance = this.distance(mesh.position, scene.activeCamera.position);
            let distanceFromTargetPosition = currentDistance - desiredDistance;
            let speed = distanceFromTargetPosition > 0 ? Math.min(maxSpeed, distanceFromTargetPosition) : Math.max(-maxSpeed, distanceFromTargetPosition);
            let direction = mesh.position.subtract(scene.activeCamera.position).normalize().multiplyByFloats(speed, speed, speed);
            scene.activeCamera.position = scene.activeCamera.position.add(direction);

            let cameraDirection = mesh.position.subtract((<FlyCamera>scene.activeCamera).getTarget()).normalize().multiplyByFloats(maxSpeed, maxSpeed, maxSpeed);
            (<FlyCamera>scene.activeCamera).setTarget((<FlyCamera>scene.activeCamera).getTarget().add(cameraDirection));
        });
    }

    private static distance(vec1: Babylon.Vector3, vec2: Babylon.Vector3): number {
        return vec1.subtract(vec2).length();
    }
}