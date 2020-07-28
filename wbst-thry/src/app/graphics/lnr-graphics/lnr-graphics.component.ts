import { Component, OnInit } from '@angular/core';
import {Playground} from './playground';
import * as Babylon from 'babylonjs';

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
    
    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    // const canvas = new Canvas(canvasElement);
    // // const canvas = document.querySelector('#multiframe');
    // console.log('canvas: ', canvas);
    // const gl: Context = canvas.context;

    // if (gl === null) {
    //   alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    //   return;
    // }

    // gl.about
    // // const gl = canvas.getContext('webgl');
  }

}
