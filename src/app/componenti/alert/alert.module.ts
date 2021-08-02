import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertComponent } from './alert.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AlertComponent
    ],
    imports: [
        CommonModule,
        
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        AlertComponent
    ],
})
export class AlertModule
{
}
