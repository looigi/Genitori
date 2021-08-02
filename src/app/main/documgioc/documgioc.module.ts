import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { DocumentazioneGiocComponent } from './documgioc.component';

const routes = [
    {
        path     : 'documgioc',
        component: DocumentazioneGiocComponent
    }
];

@NgModule({
    declarations: [
        DocumentazioneGiocComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
    ],
    exports     : [
        DocumentazioneGiocComponent
    ]
})

export class DocumentazioneGiocModule
{
}
