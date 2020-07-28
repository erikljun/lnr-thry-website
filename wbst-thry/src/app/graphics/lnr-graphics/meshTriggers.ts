import * as Babylon from 'babylonjs';

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
                () => {
                    highlightLayer.addMesh(mesh, color);
                }
            )
        );

        // OnPointerOutTrigger use for hover off
        mesh.actionManager.registerAction(
            new Babylon.ExecuteCodeAction(
                Babylon.ActionManager.OnPointerOutTrigger,
                () => {
                    highlightLayer.removeMesh(mesh);
                }
            )
        );
    }
}