import { AfterViewInit, Component, Input } from '@angular/core';
import { babylonInit } from 'babylonjs-typescript-webpack-template';

@Component({
    selector: 'app-babylon',
    standalone: true,
    template: '',
    styleUrls: ['./babylon.component.css'],
    
})

export class BabylonComponent implements AfterViewInit {
    @Input() public viewContainer!: HTMLDivElement;

    public ngAfterViewInit(){
        babylonInit();
    }
}