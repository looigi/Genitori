import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { WidgetFirmeComponent } from './widget_firme.component';
import { ImmagineGrigliaModule } from '../immagine_griglia/immagine_griglia.module';

@NgModule({
    declarations: [
        WidgetFirmeComponent
    ],
    imports     : [
        AngularSplitModule.forRoot(),

        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ImmagineGrigliaModule
    ],
    exports     : [
        WidgetFirmeComponent
    ]
})

export class WidgetFirmeModule
{
}
