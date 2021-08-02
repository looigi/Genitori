import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { ImmagineGrigliaModule } from '../immagine_griglia/immagine_griglia.module';
import { WidgetIndicatoriComponent } from './widget_indicatori.component';

@NgModule({
    declarations: [
        WidgetIndicatoriComponent
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
        WidgetIndicatoriComponent
    ]
})

export class WidgetIndicatoriModule
{
}
