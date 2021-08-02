import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, Injectable, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VariabiliGlobali } from 'app/global.component';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})

export class ConfirmationDialogComponent implements OnInit {
    iconaAttenzione;
    allineamento = 'center';

    constructor(
        private variabiliGlobali: VariabiliGlobali,
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public message: string) { 
            setTimeout(() => {
                if (message.indexOf('§') > -1) {
                    const ss = message.split('§');
                    message = ss[0];
                    this.allineamento = ss[1];
                }
                this.iconaAttenzione = this.variabiliGlobali.urlWS + 'MultiMedia/Icone/icona_ATTENZIONE.png';
            }, 10);
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {          
    }
}
