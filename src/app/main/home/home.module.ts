import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { HomeComponent } from './home.component';
import { DatePickerModule } from 'app/componenti/datepicker/DatePickerModule';
import { Griglia2Module } from 'app/componenti/griglia2/griglia2.module';
import { MatIconModule } from '@angular/material/icon';
import { WidgetFirmeModule } from 'app/componenti/widget_firme/widget_firme.module';
import { WidgetGenitoreModule } from 'app/componenti/widget_genitore/widget_genitore.module';
import { WidgetIscrittiModule } from 'app/componenti/widget_iscritti/widget_iscritti.module';
import { WidgetQuoteModule } from 'app/componenti/widget_quote/widget_quote.module';
import { WidgetScadenzeModule } from 'app/componenti/widget_scadenze/widget_scadenze.module';
import { WidgetCountModule } from 'app/componenti/widget_count/widget_count.module';
import { WidgetIndicatoriModule } from 'app/componenti/widget_indicatori/widget_indicatori.module';

const routes = [
    {
        path     : 'home',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        DatePickerModule,
        MatIconModule,
        WidgetFirmeModule,
        WidgetGenitoreModule,
        WidgetIscrittiModule,
        WidgetQuoteModule,
        WidgetScadenzeModule,
        WidgetCountModule,
        WidgetIndicatoriModule
    ],
    exports     : [
        HomeComponent
    ]
})

export class HomeModule
{
}
