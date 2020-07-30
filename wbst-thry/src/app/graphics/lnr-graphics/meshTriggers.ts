// import * as Babylon from 'babylonjs';
import { ActionManager, Color3, ExecuteCodeAction, FlyCamera, HighlightLayer, Mesh, Scene, Vector3 } from 'babylonjs';

// Makes use of actions https://doc.babylonjs.com/how_to/how_to_use_actions
export default class MeshTriggers {

    // method registered to update the camera. Need to save it in order to unregister it
    private static registeredCameraUpdater: () => void;
    
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
    public static highlightOnHover(mesh: Mesh, highlightLayer: HighlightLayer, 
                                       color: Color3): void {
        // OnPointerOverTrigger use for hover over
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger,
                () => {
                    highlightLayer.addMesh(mesh, color);
                }
            )
        );

        // OnPointerOutTrigger use for hover off
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger,
                () => {
                    highlightLayer.removeMesh(mesh);
                }
            )
        );
    }

    /**
     * Registers a click trigger on the given mesh to trigger the camera to follow the mesh. Clicking
     * on the mesh again will reset the camera back to it's original position
     * 
     * @param mesh - Object the camera is to follow
     * @param scene - The scene
     * 
     * @returns void
     */
    public static zoomOnClick(mesh: Mesh, scene: Scene): void {
        mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger,
                () => {
                    if (this.registeredCameraUpdater) {
                        this.resetCamera(scene);
                    } else {
                        this.followMesh(mesh, scene);
                    }
                }
            )
        );
    }

    /**
     * Registers a method called before each rendered frame to update the camera to follow the given mesh
     * 
     * @param mesh - The object the camera is to follow
     * @param scene - The scene
     * @param desiredDistance - The distance from the mesh the camera should follow. Default is 5
     * @param maxSpeed - The maximum distance per frame the camera should travel when moving towards the mesh
     */
    private static followMesh(mesh: Mesh, scene: Scene, desiredDistance = 5, maxSpeed = .2): void {
        // unregister any existing update callbacks
        this.unregister(scene);

        this.registeredCameraUpdater = () => {
            this.updateCamera(mesh, <FlyCamera>scene.activeCamera, desiredDistance, maxSpeed);
        }
        scene.registerBeforeRender(this.registeredCameraUpdater);
    }

    /**
     * Registers a method called before each rendered frame to update the camera position to return to it's original position
     * 
     * @param scene The scene
     */
    private static resetCamera(scene: Scene): void {
        this.unregister(scene);

        this.registeredCameraUpdater = () => {
            this.moveCameraToPosition(<FlyCamera>scene.activeCamera);
        }
        scene.registerBeforeRender(this.registeredCameraUpdater);
    }

    /**
     * Unregisters any existing camera update callback
     * 
     * @param scene The scene
     */
    private static unregister(scene: Scene): void {
        if (this.registeredCameraUpdater) {
            scene.unregisterBeforeRender(this.registeredCameraUpdater);
            this.registeredCameraUpdater = null;
        }
    }

    /**
     * Updates the camera position and target towards the given mesh for a single frame
     * 
     * @param mesh - The object the camera is to follow
     * @param camera - The camera to be updated
     * @param desiredDistance - The distance from the mesh the camera should follow. Default is 5
     * @param maxSpeed - The maximum distance per frame the camera should travel when moving towards the mesh
     */
    private static updateCamera(mesh: Mesh, camera: FlyCamera, desiredDistance = 5, maxSpeed = .2): void {
        // update camera position
        let currentDistance = this.distance(mesh.position, camera.position);
        let distanceFromTargetPosition = currentDistance - desiredDistance;
        let speed = distanceFromTargetPosition > 0 ? Math.min(maxSpeed, distanceFromTargetPosition) : Math.max(-maxSpeed, distanceFromTargetPosition);
        let direction = mesh.position.subtract(camera.position).normalize().multiplyByFloats(speed, speed, speed);
        camera.position = camera.position.add(direction);

        // update camera direction
        let cameraDirection = mesh.position.subtract(camera.getTarget()).normalize().multiplyByFloats(maxSpeed, maxSpeed, maxSpeed);
        camera.setTarget(camera.getTarget().add(cameraDirection));
    }

    /**
     * Updates the camera position and target towards the given position and direction for a single frame
     * 
     * @param camera - The camera to be updated
     * @param desiredPosition - The position the camera should be moved to
     * @param desiredDirection - The direction the camera should be pointing towards
     * @param maxSpeed - The maximum distance per frame the camera should travel when moving towards desiredPosition
     */
    private static moveCameraToPosition(camera: FlyCamera, desiredPosition = new Vector3(0, 5, -50), desiredDirection = Vector3.Zero(), maxSpeed = .2) {
        // update camera position
        let currentDistance = this.distance(camera.position, desiredPosition);
        let distanceToTravelInCurrentFrame = Math.min(maxSpeed, currentDistance);
        let dp = desiredPosition.subtract(camera.position).normalize().multiplyByFloats(distanceToTravelInCurrentFrame, distanceToTravelInCurrentFrame, distanceToTravelInCurrentFrame);
        camera.position = camera.position.add(dp);

        // update camera direction
        let cameraTargetDistance = this.distance(camera.getTarget(), desiredDirection);
        let targetChangeRatio = distanceToTravelInCurrentFrame / currentDistance;
        let targetDistanceToTravelInCurrentFrame = targetChangeRatio * cameraTargetDistance;
        let targetDP = desiredDirection.subtract(camera.getTarget()).normalize().multiplyByFloats(targetDistanceToTravelInCurrentFrame, targetDistanceToTravelInCurrentFrame, targetDistanceToTravelInCurrentFrame);
        camera.setTarget(camera.getTarget().add(targetDP));

        // because of floating points we can't really check if it's at the desired position so when it's close enough
        // just set it exactly and unregister the animation
        if (currentDistance < .001) {
            camera.setTarget(Vector3.Zero());
            camera.position = desiredPosition;
            this.unregister(camera.getScene());
        }
    }

    /**
     * Calculates the distance between two vectors
     * 
     * @param vec1 - vector 1
     * @param vec2 - vector 2
     * 
     * @returns - the distance between the two vectors
     */
    private static distance(vec1: Vector3, vec2: Vector3): number {
        return vec1.subtract(vec2).length();
    }
}