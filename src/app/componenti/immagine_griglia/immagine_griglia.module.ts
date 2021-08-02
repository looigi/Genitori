import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { ImmagineGrigliaComponent } from './immagine_griglia.component';

@NgModule({
    declarations: [
        ImmagineGrigliaComponent
    ],
    imports     : [
        AngularSplitModule.forRoot(),

        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule
    ],
    exports     : [
        ImmagineGrigliaComponent
    ]
})

export class ImmagineGrigliaModule
{
}
