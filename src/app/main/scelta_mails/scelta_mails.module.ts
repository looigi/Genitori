import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImmaginiModule } from 'app/componenti/gestioneimmagini/gestioneimmagini.module';
import { UploadDownloadModule } from 'app/componenti/upload_download/ud.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { Griglia2Module } from 'app/componenti/griglia2/griglia2.module';
import { CampoTestoModule } from 'app/componenti/campo_testo/campo_testo.module';
import { SceltaMailsComponent } from './scelta_mails.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes = [
    {
        path     : 'scelta_mails',
        component: SceltaMailsComponent
    }
];

@NgModule({
    declarations: [
        SceltaMailsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        MatButtonModule,
        CampoTestoModule,
        MatCheckboxModule
    ],
    exports     : [
        SceltaMailsComponent
    ]
})

export class SceltaMailsModule
{
}
