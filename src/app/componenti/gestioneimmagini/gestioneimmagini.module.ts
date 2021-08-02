import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImmaginiComponent } from './gestioneimmagini.component';
import { FileUploadModule } from './file_upload.module';
import { MatIconModule } from '@angular/material/icon';
import { ImmagineGrigliaModule } from '../immagine_griglia/immagine_griglia.module';

@NgModule({
    declarations: [
        ImmaginiComponent
    ],
    imports     : [
        CommonModule,
        MatIconModule,

        FormsModule,
        FileUploadModule,
        ImmagineGrigliaModule
    ],
    exports     : [
        ImmaginiComponent
    ]
})

export class ImmaginiModule
{
}
