import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from './file_upload.component';
import { WebcamModule } from 'ngx-webcam';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        FileUploadComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        WebcamModule,
    ],
    exports     : [
        FileUploadComponent
    ]
})

export class FileUploadModule
{
}
