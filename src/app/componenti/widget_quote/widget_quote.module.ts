import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { WidgetQuoteComponent } from './widget_quote.component';

@NgModule({
    declarations: [
        WidgetQuoteComponent
    ],
    imports     : [
        AngularSplitModule.forRoot(),

        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule
    ],
    exports     : [
        WidgetQuoteComponent
    ]
})

export class WidgetQuoteModule
{
}
