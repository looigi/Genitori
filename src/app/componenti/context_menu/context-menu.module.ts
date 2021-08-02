import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { ContextMenuComponent } from '../context_menu/context-menu.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        ContextMenuComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,

        TranslateModule,
        FuseSharedModule,
        MatIconModule,
        NgxDatatableModule,
    ],
    exports     : [
        ContextMenuComponent
    ]
})

export class ContextMenuModule
{
}
