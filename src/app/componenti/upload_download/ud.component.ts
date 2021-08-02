import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';
import { ConfirmationDialogComponent } from '../confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-uploaddownload',
    templateUrl: 'ud.component.html',
    styleUrls: ['ud.style.css']
})

export class UploadDownloadComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() soloLettura;
    @Input() tipologia;
    @Input() id;
    @Input() allegato;

    @ViewChild('fileInput', { static: false }) inputEl: ElementRef;

    allegati;
    soloLettura2 = false;
    tipologia2 = '';
    id2 = '';
    attendiUpload = false;

    constructor(
      private http: Http,
      public dialog: MatDialog,
      private apiService: ApiService,
      public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tipologia) {
            this.tipologia2 = changes.tipologia.currentValue;
            // console.log('Tipologia', this.tipologia2);
            if (this.id2 !== '') {
                this.caricaAllegati();
            }
        }
        if (changes.soloLettura) {
            this.soloLettura2 = changes.soloLettura.currentValue;
        }
        if (changes.id) {
            this.id2 = changes.id.currentValue;
            // console.log('ID', this.id2);
            if (this.tipologia2 !== '') {
                this.caricaAllegati();
            }
        }
    }

    caricaAllegati() {
      const params = {
        Squadra: this.variabiliGlobali.CodAnnoSquadra,
        idAnno: this.variabiliGlobali.Anno,
        Categoria: this.tipologia2,
        ID: this.id2
      };
      // console.log('Lettura allegati:', params);
      this.apiService.ritornaAllegati(params)
      .map(response => response.text())
      .subscribe(
          data => {
          if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              // console.log(data2);
              if (data2.indexOf('ERROR:') > -1) {
                  this.variabiliGlobali.mostraMessaggio(data2, false);
              } else {
                  // console.log('Allegati :', this.tipologia2, data2, this.id2);
                  this.allegati = new Array();
                  if (data2.indexOf('Nessun') === -1) {
                    const r = data2.split('§');
                    r.forEach(element => {
                    const rr = element.split(';');
                    // console.log(rr);
                    // rr.forEach(element2 => {
                    if (rr[0] !== '') {
                        const rrr = {
                          cartella: rr[0],
                          nomeFile: rr[1],
                          path: this.variabiliGlobali.urlWS + 'Allegati/' + this.variabiliGlobali.CodAnnoSquadra + '/' +
                            this.tipologia2 + '/Anno' + this.variabiliGlobali.Anno + '/' + rr[0] + '/' + rr[1]
                        };
                        this.allegati.push(rrr);
                      }
                    // });
                    });
                    // console.log(this.allegati);
                }
              }
          } else {
              // alert('Nessun valore di ritorno');
              // console.log(data);
          }
        },
        (error) => {
        if (error instanceof Error) {
            this.variabiliGlobali.mostraMessaggio('Errore: ' + error, false);
        }
      });
    }

    apreLink(url: string) {
        // const link = this.sanitizer.bypassSecurityTrustUrl(url);
        // console.log(url);
        window.open(url, '_blank');
    }

    inviaUpload() {
      const inputEl: HTMLInputElement = this.inputEl.nativeElement;
      const fileCount: number = inputEl.files.length;
      const formData = new FormData();
      if (fileCount > 0) { // a file was selected
        let fileName = '';
        let Cartella = '';
        const Squadra = this.variabiliGlobali.Squadra;
        const Anno = false;
        this.attendiUpload = true;

        for (let i = 0; i < fileCount; i++) {
            formData.append('uploadFile', inputEl.files.item(i), inputEl.files.item(i).name);

            fileName = inputEl.files.item(i).name;

            Cartella = 'Anno' + this.variabiliGlobali.Anno + '\\' + this.id;
        }

        formData.append('tipologia', this.tipologia2);
        formData.append('cartella', Cartella);
        // formData.append('nomesquadra', Squadra);
        formData.append('arrotonda', 'NO');
        formData.append('uplodadedfile', fileName);
        formData.append('nomefile', fileName);
        formData.append('scrivelog', 'SI');
        formData.append('nomesquadra', this.variabiliGlobali.CodAnnoSquadra);
        formData.append('allegato', this.allegato);

        const headers = new Headers();
        headers.append('Accept', 'application/json');

        const options = new RequestOptions({ headers: headers });

        this.http.post(this.variabiliGlobali.urlPerUpload, formData, options)
        .subscribe(
            data => {
              this.attendiUpload = false;
              this.caricaAllegati();
              this.variabiliGlobali.mostraMessaggio('File inviato con successo', false);
            },
            error => {
              this.attendiUpload = false;
              this.variabiliGlobali.mostraMessaggio('Errore nell\'invio', false);
              // console.log(error);
            }
        );
      } else {
        this.attendiUpload = false;
        this.variabiliGlobali.mostraMessaggio('Selezionare un file', false);
      }
    }

    /* onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        let data = JSON.parse(response); //success server response
        if (data.error_code === 0) {
          alert('File inviato');
          // this.caricaAllegati();
        } else {
          alert('Errore sull\'upload:' + data.error_code + '-' + data.err_desc);
        }
    }

    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        // console.log(response);
        // let error = JSON.parse(response); //error server response
        // console.log('Errore generico nell\'invio');
    } */

    openDialog(messaggio, e): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: messaggio
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.eliminaLinkFisico(e);
            } else {
                return false;
            }
        });
    }

    eliminaLink(e) {        
      this.openDialog('Si vuole eliminare l\'allegato selezionato ?', e);
    }

    eliminaLinkFisico(e) {
      const params = {
        Squadra: this.variabiliGlobali.CodAnnoSquadra,
        idAnno: this.variabiliGlobali.Anno,
        Categoria: this.tipologia2,
        ID: this.id2,
        NomeDocumento: e
      };

      this.apiService.eliminaAllegati(params)
      .map(response => response.text())
      .subscribe(
      data => {
          if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              // // console.log(data2);
              if (data2.indexOf('ERROR:') > -1) {
                  this.variabiliGlobali.mostraMessaggio(data2, false);
              } else {
                  this.caricaAllegati();
                  this.variabiliGlobali.mostraMessaggio('L\'allegato è stato eliminato', false);
                }
          }
      },
      (error) => {
          if (error instanceof Error) {
              // console.log(error);
          }
      });
  }
}
