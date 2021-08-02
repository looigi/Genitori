import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '../../../@fuse/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogComponent } from './confirm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        ConfirmationDialogComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule    
    ],
    exports     : [
        ConfirmationDialogComponent
    ]
})

export class ConfirmationDialogModule
{
}
