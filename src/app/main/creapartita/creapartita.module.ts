import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';

import { MatTabsModule } from '@angular/material/tabs';
import { ImmaginiModule } from 'app/componenti/gestioneimmagini/gestioneimmagini.module';
import { UploadDownloadModule } from 'app/componenti/upload_download/ud.module';
import { DecimalPipe } from '@angular/common';
import { CreaPartitaComponent } from './creapartita.component';
import { SceltaCategoriaModule } from 'app/componenti/scelta_categoria/scelta_categoria.module';
import { CampoTestoModule } from 'app/componenti/campo_testo/campo_testo.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { AngularSplitModule } from 'angular-split';
import { Griglia2Module } from 'app/componenti/griglia2/griglia2.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImmagineGrigliaModule } from 'app/componenti/immagine_griglia/immagine_griglia.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes = [
    {
        path     : 'creapartita',
        component: CreaPartitaComponent
    }
];

@NgModule({
    declarations: [
        CreaPartitaComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        MatTabsModule,

        AngularSplitModule.forRoot(),
        Griglia2Module,
        FuseSharedModule,
        ImmaginiModule,
        UploadDownloadModule,
        MatTabsModule,
        SceltaCategoriaModule,
        CampoTestoModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatButtonModule,
        MatIconModule,
        ImmagineGrigliaModule,
        MatCheckboxModule
    ],
    providers: [
        DecimalPipe,
    ],
    exports     : [
        CreaPartitaComponent
    ]
})

export class CreaPartitaModule
{
}
