import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VariabiliGlobali } from 'app/global.component';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';

@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss']
})

export class ProfiloComponent implements OnInit
{
    action: string;
    dialogTitle: string;
    contactForm;
    immUtente;
    datiCorretti = false;
    ConfermaPassword;
    variabiliGlobaliNome;
    variabiliGlobaliCognome;
    variabiliGlobaliEMail;
    variabiliGlobaliPassword;
    variabiliGlobaliTelefono;
    variabiliGlobaliMail;
    variabiliGlobaliPWD;
    visualizzaFirmaElettronica = false;
    nomeImmagineFirma = '';
    permessiContabilita = false;

    constructor(
        public variabiliGlobali: VariabiliGlobali,
        private apiService: ApiService,
        private router: Router,
     )
    {
        this.variabiliGlobaliNome = this.variabiliGlobali.Nome;
        this.variabiliGlobaliCognome = this.variabiliGlobali.Cognome;
        this.variabiliGlobaliEMail = this.variabiliGlobali.EMail;
        this.variabiliGlobaliPassword = this.variabiliGlobali.Password;
        this.variabiliGlobaliTelefono = this.variabiliGlobali.Telefono;
        this.variabiliGlobaliMail = this.variabiliGlobali.mailComunicazioni;
        this.variabiliGlobaliPWD = this.variabiliGlobali.pwdComunicazioni;
    }

    ngOnInit() {
        switch (this.variabiliGlobali.Tipologia.toUpperCase()) {
            case 'GENITORE':
                break;
            case 'SUPER USER':
                this.permessiContabilita = true;
                break;
            case 'UTENTE':
                if (this.variabiliGlobali.Permessi && this.variabiliGlobali.Permessi.CONTABILITA !== undefined &&
                    this.variabiliGlobali.Permessi.CONTABILITA === true) {
                        this.permessiContabilita = true;
                }
                break;
            case 'AMMINISTRATORE':
                this.permessiContabilita = true;
                break;
            default:
                break;
        }

        if (this.variabiliGlobali.Anno && this.variabiliGlobali.Anno !== '') {
            this.immUtente = this.variabiliGlobali.prendeImmUtente();
            // this.caricaImpostazioniGenerali();
            setTimeout(() => {
                this.controlloValiditaCampi();
            }, 1000);
        }
    }

    checkImage(e): void {
        // console.log(e);
        this.immUtente = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png?a=' + new Date().toString();
    }

    salvaDati(): void {
        const strutturaDati = {
            Squadra: this.variabiliGlobali.Squadra,
            idAnno: this.variabiliGlobali.Anno,
            Utente: this.variabiliGlobali.EMail,
            Cognome: this.variabiliGlobaliCognome,
            Nome: this.variabiliGlobaliNome,
            EMail: this.variabiliGlobaliEMail,
            Password: this.variabiliGlobaliPassword,
            idCategoria: this.variabiliGlobali.idCategoria,
            idTipologia: this.variabiliGlobali.idTipologiaPermessi,
            idUtente: this.variabiliGlobali.idUtente,
            Telefono: this.variabiliGlobali.Telefono,
            Mail: this.variabiliGlobaliMail,
            PWD: this.variabiliGlobaliPWD,
        };
        console.log(strutturaDati);
        // return;

        this.apiService.salvaUtente(
          this.variabiliGlobali.CodAnnoSquadra,
          this.variabiliGlobali.Anno,
          strutturaDati,
          'MODIFICA'
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
                this.variabiliGlobali.Nome = this.variabiliGlobaliNome;
                this.variabiliGlobali.Cognome = this.variabiliGlobaliCognome;
                this.variabiliGlobali.EMail = this.variabiliGlobaliEMail;
                this.variabiliGlobali.Password = this.variabiliGlobaliPassword;
                this.variabiliGlobali.Telefono = this.variabiliGlobaliTelefono;
                this.variabiliGlobali.mailComunicazioni = this.variabiliGlobaliMail;
                this.variabiliGlobali.pwdComunicazioni = this.variabiliGlobaliPWD;

                this.chiude();
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

    chiude(): void {
        const dove = 'home';
        this.router.navigate([dove]);
    }

    controlloValiditaCampi(): void {
        if (
            this.variabiliGlobaliNome !== '' &&
            this.variabiliGlobaliCognome !== '' &&
            this.variabiliGlobaliEMail !== '' &&
            this.variabiliGlobaliPassword !== '' &&
            this.variabiliGlobaliMail !== '' &&
            this.variabiliGlobaliPWD !== '' &&
            this.variabiliGlobaliTelefono !== ''
        ) {
            if (this.variabiliGlobaliPassword === this.ConfermaPassword) {
                if (this.variabiliGlobali.controllaPassword(this.variabiliGlobaliPassword) === true) {
                    this.datiCorretti = true;
                } else {
                    this.datiCorretti = false;
                    this.variabiliGlobali.mostraMessaggio('Password non valida.\nDeve essere composta da almeno:\n\n' +
                        '8 caratteri\n2 lettere minuscole\n1 lettera maiuscola\n3 numeri\n1 carattere speciale', false);
                }
            } else {
                this.datiCorretti = true;
            }
        } else {
            this.datiCorretti = false;
        }
    }

    richiedeFirma() {
        if (!this.variabiliGlobali.EMail || this.variabiliGlobali.EMail === '') {
            this.variabiliGlobali.mostraMessaggio('Mail utente mancante', false);
            return;
        }
        this.apiService.richiedeFirmaSegreteria(
            this.variabiliGlobali.Squadra,
            this.variabiliGlobali.EMail,
            this.variabiliGlobali.MittenteMail
        )
        .map(response => response.text())
        .subscribe(
            data => {
                if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                    if (data2.indexOf('ERROR') === -1) {
                        this.variabiliGlobali.mostraMessaggio('Mail di avviso inviata', false);
                    } else {
                        this.variabiliGlobali.mostraMessaggio(data2, false);
                    }
                }
            }
        );
    }

    visualizzaFirma() {
        // let nome = this.variabiliGlobali.Anno + '.kgb';
        // nome = this.variabiliGlobali.urlWS + 'Multimedia/' + this.variabiliGlobali.Squadra + '/Utenti/' + nome;
        // console.log(nome);
        this.nomeImmagineFirma = this.variabiliGlobali.urlFirmaUtente;
        this.visualizzaFirmaElettronica = true;
    }

    chiudeMascheraFirma() {
        this.nomeImmagineFirma = '';
        this.visualizzaFirmaElettronica = false;
    }
}
