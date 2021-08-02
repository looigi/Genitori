import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { GenitoriComponent } from './genitori.component';

const routes = [
    {
        path     : 'genitori',
        component: GenitoriComponent
    }
];

@NgModule({
    declarations: [
        GenitoriComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ],
    exports     : [
        GenitoriComponent
    ]
})

export class GenitoriModule
{
}
