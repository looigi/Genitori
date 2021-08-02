import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { LoginModule } from './main/login/login.module';
import { HomeModule } from './main/home/home.module';
import { ResetPassword2Module } from './main/reset-password-2/reset-password-2.module';
import { Griglia2Module } from './componenti/griglia2/griglia2.module';

import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { ContextMenuModule } from './componenti/context_menu/context-menu.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { CampoTestoModule } from './componenti/campo_testo/campo_testo.module';
import { ProfiloModule } from './main/profilo/contact-form.module';
import { SignaturePadModule } from 'angular2-signature-pad';
import { DatePickerModule } from './componenti/datepicker/DatePickerModule';

import localeIt from '@angular/common/locales/it';
import { registerLocaleData, CurrencyPipe, DatePipe } from '@angular/common';
import { AlertModule } from './componenti/alert/alert.module';
import { GenitoriModule } from './main/genitori/genitori.module';
import { CookieService } from 'ngx-cookie-service';
import { WidgetFirmeModule } from './componenti/widget_firme/widget_firme.module';
import { SceltaMailsModule } from './main/scelta_mails/scelta_mails.module';
import { DocumentazioneModule } from './main/documentazione/documentazione.module';
import { WidgetGenitoreModule } from './componenti/widget_genitore/widget_genitore.module';
import { DocumentazioneGiocModule } from './main/documgioc/documgioc.module';
import { ImmagineGrigliaModule } from './componenti/immagine_griglia/immagine_griglia.module';
import { WidgetIscrittiModule } from './componenti/widget_iscritti/widget_iscritti.module';
import { WidgetQuoteModule } from './componenti/widget_quote/widget_quote.module';
import { WidgetScadenzeModule } from './componenti/widget_scadenze/widget_scadenze.module';
import { ContattiModule } from './main/contatti/contatti.module';
import { WidgetCountModule } from './componenti/widget_count/widget_count.module';
import { ApiService } from './services/api.service';
import { VariabiliGlobali } from './global.component';
import { ConfirmationDialogComponent } from './componenti/confirm/confirm.component';
import { ConfirmationDialogModule } from './componenti/confirm/confirm.module';

import { WidgetIndicatoriModule } from './componenti/widget_indicatori/widget_indicatori.module';
import { CalendarModule } from './main/calendar/calendar.module';
import { ReminderModule } from './main/reminder/reminder.module';
import { CreaPartitaModule } from './main/creapartita/creapartita.module';

registerLocaleData(localeIt);

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'login'
    },
    {
        path      : 'nuova_societa',
        redirectTo: 'nuova_societa'
    },
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),
        SignaturePadModule,

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        LoginModule,
        HomeModule,
        ResetPassword2Module,
        Griglia2Module,
        NgxDatatableModule,
        ContextMenuModule,
        ClickOutsideModule,
        CampoTestoModule,
        ProfiloModule,
        DatePickerModule,
        AlertModule,
        GenitoriModule,
        WidgetFirmeModule,
        SceltaMailsModule,
        DocumentazioneModule,
        WidgetGenitoreModule,
        DocumentazioneGiocModule,
        ImmagineGrigliaModule,
        WidgetIscrittiModule,
        WidgetQuoteModule,
        WidgetScadenzeModule,
        ContattiModule,
        WidgetCountModule,        
        ConfirmationDialogModule,
        WidgetIndicatoriModule,

        CalendarModule,
        ReminderModule,
        CreaPartitaModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'it-IT' },
        CurrencyPipe,
        VariabiliGlobali,
        ApiService,
        DatePipe
    ],
    entryComponents: [
      ConfirmationDialogComponent
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
