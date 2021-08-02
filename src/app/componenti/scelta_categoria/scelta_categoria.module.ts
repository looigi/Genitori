import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SceltaCategoriaComponent } from './scelta_categoria.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        SceltaCategoriaComponent
    ],
    imports     : [
        ReactiveFormsModule,
        CommonModule,
        FormsModule,

        MatSelectModule,
        MatIconModule
    ],
    exports     : [
        SceltaCategoriaComponent
    ]
})

export class SceltaCategoriaModule
{
}
