import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var width = window.innerWidth;
  var height = window.innerHeight;

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
  });

    var layer = new Konva.Layer();

    var textpath = new Konva.TextPath({
      x: 0,
      y: 50,
      fill: '#333',
      fontSize: 16,
      fontFamily: 'Arial',
      text: 'All the world\'s a stage, and all the men and women merely players.',
      data: 'M10,10 C0,0 10,150 100,100 S300,150 400,50'
    });

    layer.add(textpath);

    // add the layer to the stage
    stage.add(layer);
  }

}