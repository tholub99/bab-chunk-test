import { Routes } from '@angular/router';
import { SingleViewComponent } from './single-view/single-view.component';

export const routes: Routes = [
    { path: 'single-view', component: SingleViewComponent },
    { path: '', redirectTo: '/single-view', pathMatch: 'full'} //Default
];
