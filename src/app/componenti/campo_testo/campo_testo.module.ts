import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { CampoTestoComponent } from './campo_testo.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
    declarations: [
        CampoTestoComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,

        TranslateModule,
        FuseSharedModule,
        MatIconModule,
        NgxDatatableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'it'},
    ],
    exports     : [
        CampoTestoComponent
    ]
})

export class CampoTestoModule
{
}
