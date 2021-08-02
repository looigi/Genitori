import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'alert-component',
    templateUrl: './alert.component.html',
    styleUrls  : ['./alert.component.scss']
})
export class AlertComponent
{
    public messaggio: string;
    public conferma: boolean;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AlertComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<AlertComponent>
    )
    {
    }

}
