import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter, DateFormatterParams, CalendarNativeDateFormatter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { CampoTestoModule } from 'app/componenti/campo_testo/campo_testo.module';
import { MatSelectModule } from '@angular/material/select';
import { CreaPartitaModule } from '../creapartita/creapartita.module';
import { ReminderComponent } from './reminder.component';

const routes: Routes = [
    {
        path     : 'reminder',
        component: ReminderComponent,
        children : [],
        // resolve  : {
        //     chat: CalendarService
        // }
    }
];

class CustomDateFormatter extends CalendarNativeDateFormatter {

    public dayViewHour({date, locale}: DateFormatterParams): string {
      // change this to return a different date format
      return new Intl.DateTimeFormat(locale, {hour: 'numeric'}).format(date);
    }
}

@NgModule({
    declarations   : [
        ReminderComponent,
        CalendarEventFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSelectModule,
        CreaPartitaModule,

        AngularCalendarModule.forRoot({
            provide   : DateAdapter,
            useFactory: adapterFactory
        }),
        ColorPickerModule,

        FuseSharedModule,
        FuseConfirmDialogModule
    ],
    providers      : [
        // CalendarService
        {provide: CalendarDateFormatter, useClass: CustomDateFormatter}
    ],
    entryComponents: [
        CalendarEventFormDialogComponent
    ]
})
export class ReminderModule
{
}
