import { Component, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';
// import * as jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector   : 'documentazione',
    templateUrl: './documentazione.component.html',
    styleUrls  : ['./documentazione.component.scss']
})

export class DocumentazioneComponent implements OnInit
{
    urlCM;
    urlIscr;
    urlRicevute;

    htmlString;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private http: HttpClient,
      private apiService: ApiService,
      public sanitizer: DomSanitizer,
      public variabiliGlobali: VariabiliGlobali,
    ) {
    }
  
    ngOnInit(): void {
        this.leggeIdGiocatore();
        this.leggeRicevuteGiocatore();
    }

    leggeRicevuteGiocatore() {
        this.apiService.RitornaRicevuteGiocatore(
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
                this.urlRicevute = new Array();
                let q = 1;
                let vecchioUtente = '';
                let appoggio = new Array();
                righe.forEach(element => {
                    if (element) {
                        const righe2 = element.split(';');
                        const idGiocatore = righe2[0];
                        if (idGiocatore !== vecchioUtente) {
                            vecchioUtente = idGiocatore;
                            if (appoggio.length > 0) {
                                this.urlRicevute.push(appoggio);
                            }
                            appoggio = new Array();
                        }

                        if (righe2[1]) {
                            const nome = righe2[1].replace('.pdf', '').replace('_', ' ');
                            appoggio.push( { 
                                id: q,
                                idGiocatore: idGiocatore,
                                Nome: nome,
                                Url: this.variabiliGlobali.urlWS + 'Allegati/' + this.variabiliGlobali.CodAnnoSquadra + '/' +
                                    'Ricevute/Anno' + this.variabiliGlobali.Anno + '/' + idGiocatore + '/' + righe2[1] 
                            });
                            q++;
                        }
                    }
                });
                this.urlRicevute.push(appoggio);
                // console.log('Ricevute: ', this.urlRicevute);
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

    leggeIdGiocatore() {
        this.apiService.ritornaIdGiocatore(
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
                this.urlCM = new Array();
                this.urlIscr = new Array();
                righe.forEach(element => {
                    if (element) {
                        const righe2 = element.split(';');
                        const idGiocatore = righe2[0];
        
                        this.urlIscr.push(this.variabiliGlobali.urlWS + '/Allegati/' + this.variabiliGlobali.CodAnnoSquadra + '/' +
                            'Firme/iscrizione_' + this.variabiliGlobali.Anno + '_' + idGiocatore + '.pdf');
                        if (righe2[1]) {
                            this.urlCM.push(this.variabiliGlobali.urlWS + '/' + this.variabiliGlobali.CodAnnoSquadra + '/' +
                                'Certificati/Anno' + this.variabiliGlobali.Anno + '/' + idGiocatore + '/' + righe[1]);
                        } else {
                            this.urlCM.push('');
                        }
                    }
                });
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

    scaricaRicevuta(e) {
        window.open(e, '_blank');
    }

    scaricaIscrizione() {
        window.open(this.urlIscr[this.variabiliGlobali.idFiglioScelto], '_blank');

        /* const urlIscr = this.variabiliGlobali.urlWS + '/Allegati/' + this.variabiliGlobali.CodAnnoSquadra + '/' +
            'Firme/iscrizione_' + this.variabiliGlobali.Anno + '_' + this.idGiocatore + '.html';

        this.http.get(urlIscr, 
            {responseType: 'text'}).subscribe(res => {
              this.urlIscr = this.sanitizer.bypassSecurityTrustHtml(res);
        });

        setTimeout(() => {
            const data = document.getElementById('content');
            html2canvas(data).then(canvas => {
                const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
            
                const imgData  = canvas.toDataURL('image/png', 1.0);
                pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
                pdf.save('iscrizione.pdf');

                this.urlIscr = '';
            });
        }, 2000); */
    }
}
