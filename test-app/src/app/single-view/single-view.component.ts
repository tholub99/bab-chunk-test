import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BabylonComponent } from '../babylon-component/babylon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BabylonComponent],
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.css', '../sandbox-styles.css']
})

export class SingleViewComponent {
  title = 'babylon-view';
  @ViewChild(BabylonComponent, {static: true}) babylonComponent: BabylonComponent | undefined;
}
