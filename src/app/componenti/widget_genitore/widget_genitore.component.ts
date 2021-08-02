import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector: 'widget_genitore-component',
    templateUrl: 'widget_genitore.component.html',
    styleUrls: ['widget_genitore.style.css']
})

export class WidgetGenitoreComponent implements OnInit, OnChanges {
    visualizzaWidgetSeCiSonoPermessi = false;
    immagineGiocatore = '';
    idGiocatore;
    Nominativo;
    Soprannome;
    DataDiNascita;
    CodFiscale;
    Ruolo;
    quantiFigli;

    constructor(
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit() {
        // CONTROLLO PERMESSI
        // console.log(this.variabiliGlobali.Permessi);

        switch (this.variabiliGlobali.Tipologia.toUpperCase()) {
            case 'GENITORE':
            case 'DIRIGENTE GENITORE':
            case 'ALLENATORE GENITORE':
                this.visualizzaWidgetSeCiSonoPermessi = true;
                this.caricaDatiGiocatore();
                break;
            case 'SUPER USER':
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
            case 'UTENTE':
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
            case 'AMMINISTRATORE':
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
            default:
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
        }
    }

    caricaDatiGiocatore() {
        this.apiService.RitornaDatiGiocatore(
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
                const ee = new Array();
                righe.forEach(element => {
                    if (element) {
                        const righe2 = element.split(';');
                        const e = {
                            idGiocatore: +righe2[0],
                            Nominativo: righe2[1] + ' ' + righe2[2],
                            Soprannome: righe2[3],
                            DataDiNascita: righe2[4],
                            CodFiscale: righe2[5],
                            Ruolo: righe2[6],
                            immagineGiocatore: this.variabiliGlobali.urlWS + 'MultiMedia/' + this.variabiliGlobali.Squadra + '/Giocatori/' +
                                this.variabiliGlobali.Anno + '_' + righe2[0] + '.kgb', // jpg'                 
                        };
                        ee.push(e);
                    }
                });
                this.quantiFigli = ee.length - 1;
                this.variabiliGlobali.listaFigli = JSON.parse(JSON.stringify(ee));
                // this.variabiliGlobali.idFiglioScelto = 0;
                // console.log(ee);
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

    ngOnChanges(r) {

    }

    checkImage(e): void {
        // console.log(e);
        e.srcElement.src = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png?a=' + new Date().toString();
    }

    spostaFiglio(e) {
        if (e === 1) {
            this.variabiliGlobali.idFiglioScelto++;
            if (this.variabiliGlobali.idFiglioScelto > this.quantiFigli) {
                this.variabiliGlobali.idFiglioScelto = 0;
            }
        } else {
            this.variabiliGlobali.idFiglioScelto--;
            if (this.variabiliGlobali.idFiglioScelto < 0) {
                this.variabiliGlobali.idFiglioScelto = this.quantiFigli;
            }
        }
    }
}
