import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { WidgetGenitoreComponent } from './widget_genitore.component';
import { ImmagineGrigliaModule } from '../immagine_griglia/immagine_griglia.module';

@NgModule({
    declarations: [
        WidgetGenitoreComponent
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
        WidgetGenitoreComponent
    ]
})

export class WidgetGenitoreModule
{
}
