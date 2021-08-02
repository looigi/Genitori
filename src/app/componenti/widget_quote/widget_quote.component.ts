import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector: 'widget_quote-component',
    templateUrl: 'widget_quote.component.html',
    styleUrls: ['widget_quote.style.css']
})

export class WidgetQuoteComponent implements OnInit, OnChanges {
    visualizzaWidgetSeCiSonoPermessi = false;
    caricamentoInCorso = 'CARICAMENTO';
    tot2;
    tot2Q;
    
    constructor(
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit() {
        const w = this.variabiliGlobali.WidgetSelezionati.split('-');
        if (w[2] === '0') {
            return;
        }
        // CONTROLLO PERMESSI
        // console.log(this.variabiliGlobali.Permessi);

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
        this.apiService.RitornaQuote(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              let tot = 0;
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                // console.log(data2);
                const camponi = data2.split('|');
                const righe = camponi[1].split('§');
                const dp = new Array();
                righe.forEach(element => {
                  if (element !== '' && element !== '0;0') {
                    const campi = element.split(';');
                    // console.log(campi);

                    const y = +(campi[2].replace(',', '.'));
                    let yy = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(y);
                    yy = '€ ' + yy.replace('€', '').trim();
                    const c = { label: campi[1], y: +(campi[2].replace(',', '.')), yy: yy };
                    tot += +(campi[2].replace(',', '.'));
                    dp.push(c);
                  }
                });
                // console.log('Dati widget quote:', dp);

                this.caricamentoInCorso = 'OK';
                this.tot2 = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(tot);
                this.tot2 = '€ ' + this.tot2.replace('€', '').trim();
                
                this.tot2Q = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(+camponi[0]);
                this.tot2Q = '€ ' + this.tot2Q.replace('€', '').trim();

                setTimeout(() => {
                    this.variabiliGlobali.riempieGrafico('chartVideoQuote', dp, '', 'column', '', '', 'Totale', false, true);
                }, 1000);
              } else {
                this.variabiliGlobali.mostraMessaggio(data2, false);
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
                this.variabiliGlobali.mostraMessaggio(error, false);
            }
          }
        );  
    }
}
