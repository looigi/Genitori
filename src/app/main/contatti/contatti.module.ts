import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';
import { ContattiComponent } from './contatti.component';
import { Griglia2Module } from 'app/componenti/griglia2/griglia2.module';
import { SceltaCategoriaModule } from 'app/componenti/scelta_categoria/scelta_categoria.module';

const routes = [
    {
        path     : 'contatti',
        component: ContattiComponent
    }
];

@NgModule({
    declarations: [
        ContattiComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
        Griglia2Module,
        SceltaCategoriaModule
    ],
    exports     : [
        ContattiComponent
    ]
})

export class ContattiModule
{
}
