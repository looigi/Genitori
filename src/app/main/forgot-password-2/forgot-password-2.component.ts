import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';
import { Router } from '@angular/router';

@Component({
    selector     : 'forgot-password-2',
    templateUrl  : './forgot-password-2.component.html',
    styleUrls    : ['./forgot-password-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPassword2Component implements OnInit
{
    forgotPasswordForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private apiService: ApiService,
        private router: Router,
        public variabiliGlobali: VariabiliGlobali,
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    inviaMail() {
        const username = this.forgotPasswordForm.value.email;

        this.apiService.inviaMailDimenticata(
            username
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
                    this.variabiliGlobali.mostraMessaggio('Mail inviata', false);
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
}
