import { Component, OnInit } from '@angular/core';
import {Playground} from './playground';
import * as Babylon from 'babylonjs';
// import { AdvancedDynamicTexture, Image } from 'babylonjs-gui';
import MeshTriggers from './meshTriggers';


@Component({
  selector: 'app-lnr-graphics',
  templateUrl: './lnr-graphics.component.html',
  styleUrls: ['./lnr-graphics.component.scss']
})
export class LnrGraphicsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const canvasElement: HTMLCanvasElement = document.querySelector("#multiframe");
    const engine = new Babylon.Engine(canvasElement, true, { stencil: true });
    const scene = Playground.createScene(engine, canvasElement);

    // setup logo
    // let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    // let logo = new Image('logo', '../../assets/LNR THRY.png');
    // logo.autoScale = true;
    // logo.scaleX = .3;
    // logo.scaleY = .3;
    // logo.left = -advancedTexture.getSize().width/2 + 150;
    // logo.top = -advancedTexture.getSize().height/2 + 50;
    // logo.isPointerBlocker = true;

    // // add click event to reset camera
    // logo.onPointerDownObservable.add(() => {
    //   console.log('logo down');
    //   MeshTriggers.resetCamera(scene);
    // });
    
    // advancedTexture.addControl(logo);
    
    engine.runRenderLoop(() => scene.render());

    // window.addEventListener('resize', () => {
    //   engine.resize();

    //   // update position of logo
    //   logo.left = -advancedTexture.getSize().width/2 + 150;
    //   logo.top = -advancedTexture.getSize().height/2 + 50;
    // });
  }

}
