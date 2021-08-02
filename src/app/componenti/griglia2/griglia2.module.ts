import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';
import { Griglia2Component } from './griglia2.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { ContextMenuModule } from '../context_menu/context-menu.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImmagineGrigliaModule } from '../immagine_griglia/immagine_griglia.module';
import { CampoTestoModule } from '../campo_testo/campo_testo.module';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
        Griglia2Component,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,

        TranslateModule,
        FuseSharedModule,
        MatIconModule,
        NgxDatatableModule,
        ContextMenuModule,
        ClickOutsideModule,
        MatCheckboxModule,

        MatFormFieldModule,
        ImmagineGrigliaModule,
        CampoTestoModule
    ],
    exports     : [
        Griglia2Component
    ]
})

export class Griglia2Module
{
}

