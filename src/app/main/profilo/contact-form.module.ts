import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { ProfiloComponent } from './contact-form.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { CampoTestoModule } from 'app/componenti/campo_testo/campo_testo.module';
import { ImmagineGrigliaModule } from 'app/componenti/immagine_griglia/immagine_griglia.module';

const routes = [
    {
        path     : 'profilo',
        component: ProfiloComponent
    }
];

@NgModule({
    declarations: [
        ProfiloComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        
        MatFormFieldModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatDatepickerModule,
        CampoTestoModule,
        ImmagineGrigliaModule
    ],
    exports     : [
        ProfiloComponent
    ],
})

export class ProfiloModule
{
}
