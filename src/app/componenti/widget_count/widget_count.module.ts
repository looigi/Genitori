import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { WidgetCountComponent } from './widget_count.component';
import { ImmagineGrigliaModule } from '../immagine_griglia/immagine_griglia.module';

@NgModule({
    declarations: [
        WidgetCountComponent
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
        WidgetCountComponent
    ]
})

export class WidgetCountModule
{
}
