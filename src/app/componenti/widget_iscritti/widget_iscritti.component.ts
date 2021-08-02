import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector: 'widget_iscritti-component',
    templateUrl: 'widget_iscritti.component.html',
    styleUrls: ['widget_iscritti.style.css']
})

export class WidgetIscrittiComponent implements OnInit, OnChanges {
    visualizzaWidgetSeCiSonoPermessi = false;
    caricamentoInCorso = 'CARICAMENTO';

    constructor(
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit() {
        const w = this.variabiliGlobali.WidgetSelezionati.split('-');
        if (w[1] === '0') {
            return;
        }
        // CONTROLLO PERMESSI
        // console.log(this.variabiliGlobali.Permessi);

        this.visualizzaWidgetSeCiSonoPermessi = false;
        switch (this.variabiliGlobali.Tipologia.toUpperCase()) {
            case 'GENITORE':
            case 'DIRIGENTE GENITORE':
            case 'ALLENATORE GENITORE':
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
            case 'SUPER USER':
                if (this.variabiliGlobali.CodAnnoSquadra !== '') {
                    this.visualizzaWidgetSeCiSonoPermessi = true;
                    this.caricaDatiWidget();
                } else {
                    this.visualizzaWidgetSeCiSonoPermessi = false;
                }
                break;
            case 'UTENTE':
                if (this.variabiliGlobali.Permessi && this.variabiliGlobali.Permessi.SEGRETERIA !== undefined &&
                    this.variabiliGlobali.Permessi.SEGRETERIA === true) {
                        this.visualizzaWidgetSeCiSonoPermessi = true;
                        this.caricaDatiWidget();
                }
                break;
            case 'AMMINISTRATORE':
                this.visualizzaWidgetSeCiSonoPermessi = true;
                this.caricaDatiWidget();
                break;
            default:
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
        }
    }

    ngOnChanges(c) {

    }

    caricaDatiWidget() {
        this.caricamentoInCorso = 'CARICAMENTO';
        const params = {
            Squadra: this.variabiliGlobali.CodAnnoSquadra
        };
        this.apiService.RitornaIscritti(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                // console.log(data2);
                const righe = data2.split('§');
                const dp = new Array();
                let totale = 0;
                righe.forEach(element => {
                  if (element !== '' && element !== '0;0') {
                    const campi = element.split(';');
                    // console.log(campi);
                    const c = { label: campi[1], y: +campi[2], yy: +campi[2] };
                    totale += (+campi[2]);
                    dp.push(c);
                  }
                });
                // console.log('Dati widget iscritti:', dp);

                this.caricamentoInCorso = 'OK';
                setTimeout(() => {
                    this.variabiliGlobali.riempieGrafico('chartVideoIscritti', dp, '', 'column', 'Totale: ' + totale, '', 'Numero Iscritti', false, false);
                }, 1000);
              } else {
                this.variabiliGlobali.mostraMessaggio(data2, false);
                this.caricamentoInCorso = 'OK';
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
                this.variabiliGlobali.mostraMessaggio(error, false);
                this.caricamentoInCorso = 'OK';
            }
          }
        );  
    }
}
