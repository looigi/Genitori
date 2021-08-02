import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatIconModule } from '@angular/material/icon';
import { DatePickerComponent } from './datepicker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

@NgModule({
    declarations: [
        DatePickerComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        TranslateModule,
        FuseSharedModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    providers: [
        {provide: OWL_DATE_TIME_LOCALE, useValue: 'it'},
    ],
    exports: [
        DatePickerComponent
    ]
})


export class DatePickerModule {
}
