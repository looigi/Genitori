import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { WidgetIscrittiComponent } from './widget_iscritti.component';

@NgModule({
    declarations: [
        WidgetIscrittiComponent
    ],
    imports     : [
        AngularSplitModule.forRoot(),

        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule
    ],
    exports     : [
        WidgetIscrittiComponent
    ]
})

export class WidgetIscrittiModule
{
}
