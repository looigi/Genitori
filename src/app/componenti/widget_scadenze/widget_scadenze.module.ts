import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { WidgetScadenzeComponent } from './widget_scadenze.component';

@NgModule({
    declarations: [
        WidgetScadenzeComponent
    ],
    imports     : [
        AngularSplitModule.forRoot(),

        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule
    ],
    exports     : [
        WidgetScadenzeComponent
    ]
})

export class WidgetScadenzeModule
{
}
