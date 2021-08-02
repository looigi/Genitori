import { Component, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector   : 'scelta_mails',
    templateUrl: './scelta_mails.component.html',
    styleUrls  : ['./scelta_mails.component.scss']
})

export class SceltaMailsComponent implements OnInit
{
    nomePadre;
    nomeMadre;
    nomeGiocatore;
    mail1;
    mail2;
    mail3;
    attiva1;
    attiva2;
    attiva3;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private apiService: ApiService,
      public variabiliGlobali: VariabiliGlobali,
    ) {
    }
  
    ngOnInit(): void {
        this.leggeMails();
    }

    leggeMails() {
        this.apiService.ritornaMails(
            this.variabiliGlobali.CodAnnoSquadra,
            this.variabiliGlobali.idUtente
        )
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                // console.log(data2);
                const righe = data2.split('§');
                
                this.nomePadre = new Array();
                this.mail1 = new Array();
                this.attiva1 = new Array();

                this.nomeMadre = new Array();
                this.mail2 = new Array();
                this.attiva2 = new Array();

                this.nomeGiocatore = new Array();
                this.mail3 = new Array();
                this.attiva3 = new Array();

                righe.forEach(element2 => {
                    if (element2) {
                        const element = element2.split(';');

                        this.nomePadre.push(element[0]);
                        this.mail1.push(element[1]);
                        this.attiva1.push(element[2]);
                        
                        this.nomeMadre.push(element[3]);
                        this.mail2.push(element[4]);
                        this.attiva2.push(element[5]);
                        
                        this.nomeGiocatore.push(element[6]);
                        this.mail3.push(element[7]);
                        this.attiva3.push(element[8]);
                    }
                });
                // console.log('Lettura valori');
                // console.log(this.attiva1);
                // console.log(this.attiva2);
                // console.log(this.attiva3);
                // console.log(this.nomePadre);
              } else {
                // console.log(data2);
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
            }
          }
        );  
    }

    cambioStato(n, e) {
        // console.log(n, e.source._checked);
        const c = e.source._checked;
        switch (n) {
            case 1:
                this.attiva1[this.variabiliGlobali.idFiglioScelto] = (c === true ? 'S' : 'N');
                break;
            case 2:
                this.attiva2[this.variabiliGlobali.idFiglioScelto] = (c === true ? 'S' : 'N');
                break;
            case 3:
                this.attiva3[this.variabiliGlobali.idFiglioScelto] = (c === true ? 'S' : 'N');
                break;
        }
        // console.log('Impostazione Valori');
        // console.log(this.attiva1);
        // console.log(this.attiva2);
        // console.log(this.attiva3);
    }

    salvaDati() {
        let sAttiva1 = '';
        this.attiva1.forEach(element => {
            if (element) {
                sAttiva1 += element + ';';
            } else {
                sAttiva1 += ';';
            }
        });
        let sAttiva2 = '';
        this.attiva2.forEach(element => {
            if (element) {
                sAttiva2 += element + ';';
            } else {
                sAttiva2 += ';';
            }
        });
        let sAttiva3 = '';
        this.attiva3.forEach(element => {
            if (element) {
                sAttiva3 += element + ';';
            } else {
                sAttiva3 += ';';
            }
        });

        this.apiService.salvaMails(
            this.variabiliGlobali.CodAnnoSquadra,
            this.variabiliGlobali.idUtente,
            sAttiva1,
            sAttiva2,
            sAttiva3,
        )
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                // console.log(data2);
                this.variabiliGlobali.mostraMessaggio('Mails impostate', false);
              } else {
                // console.log(data2);
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
            }
          }
        );  
    }
}

