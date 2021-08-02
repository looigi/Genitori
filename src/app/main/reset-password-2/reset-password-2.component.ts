import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { Router } from '@angular/router';
import { ResetPassword2Module } from './reset-password-2.module';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector     : 'reset-password-2',
    templateUrl  : './reset-password-2.component.html',
    styleUrls    : ['./reset-password-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResetPassword2Component implements OnInit, OnDestroy
{
    campiValidi = false;
    Password1 = '';
    Password2 = '';
    EMail = '';
    
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private variabiliGlobali: VariabiliGlobali,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    cambiaPassword(): void {
        // console.log(this.EMail, this.Password1);

        this.apiService.impostaPassword(
            this.EMail, this.Password1
          )
          .map(response => response.text())
          .subscribe(
            data => {
              if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                // console.log(data2);
                if (data2.indexOf('ERROR:') > -1) {
                    this.variabiliGlobali.mostraMessaggio(data2, false);
                } else {
                    this.variabiliGlobali.mostraMessaggio('Password impostata', false);
                    this.variabiliGlobali.pulisceCampi();
                    localStorage.setItem('GC_Password', '');

                    const dove = 'login';
                    this.router.navigate([dove]);
                }
              } else {
                this.variabiliGlobali.mostraMessaggio('Nessun valore di ritorno', false);
                // console.log(data);
              }
            },
            (error) => {
              if (error instanceof Error) {
                this.variabiliGlobali.mostraMessaggio('Errore: ' + error, false);
              }
            }
        );    
    }

    controlloValiditaCampi(): void {
        if (this.EMail !== '' && this.Password1 !== '' && this.Password2 !== '' && this.Password1 === this.Password2) {
            if (this.variabiliGlobali.controllaPassword(this.Password1) === true) {
                this.campiValidi = true;
                // console.log('Ci sono tutti i valori', this.inserimentoOModifica);
            } else {
                this.variabiliGlobali.mostraMessaggio('Password non valida.<br />Deve essere composta da almeno:<br /><br />8 caratteri' +
                    '<br />2 lettere minuscole<br />1 lettera maiuscola<br />3 numeri<br />1 carattere speciale', false);
            }
        } else {
            this.campiValidi = false;
        }
        
    }
}
