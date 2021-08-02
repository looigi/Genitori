import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { DocumentazioneComponent } from './documentazione.component';

const routes = [
    {
        path     : 'documentazione',
        component: DocumentazioneComponent
    }
];

@NgModule({
    declarations: [
        DocumentazioneComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,
    ],
    exports     : [
        DocumentazioneComponent
    ]
})

export class DocumentazioneModule
{
}
