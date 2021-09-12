import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector: 'widget_scadenze-component',
    templateUrl: 'widget_scadenze.component.html',
    styleUrls: ['widget_scadenze.style.css']
})

export class WidgetScadenzeComponent implements OnInit, OnChanges {
    visualizzaWidgetSeCiSonoPermessi = false;
    eventi;
    mascheraFirme = false;
    tipologia;

    constructor(
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit() {
        const w = this.variabiliGlobali.WidgetSelezionati.split('-');
        if (w[3] === '0') {
            return;
        }
        // CONTROLLO PERMESSI
        // console.log(this.variabiliGlobali.Permessi);

        switch (this.variabiliGlobali.Tipologia.toUpperCase()) {
            case 'GENITORE':
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
            case 'DIRIGENTE GENITORE':
            case 'DIRIGENTE':
                this.tipologia = 'DIRIGENTE';
                this.visualizzaWidgetSeCiSonoPermessi = true;
                this.caricaDatiWidget('5');
                break;
            case 'ALLENATORE GENITORE':
            case 'ALLENATORE':
                this.tipologia = 'ALLENATORE';
                this.visualizzaWidgetSeCiSonoPermessi = true;
                this.caricaDatiWidget('5');
                break;
            case 'SUPER USER':
                if (this.variabiliGlobali.CodAnnoSquadra !== '') {
                    this.tipologia = 'SUPER USER';
                    this.visualizzaWidgetSeCiSonoPermessi = true;
                    this.caricaDatiWidget('5');
                } else {
                    this.visualizzaWidgetSeCiSonoPermessi = false;
                }
                break;
            case 'UTENTE':
                if (this.variabiliGlobali.Permessi && this.variabiliGlobali.Permessi.SEGRETERIA !== undefined &&
                    this.variabiliGlobali.Permessi.SEGRETERIA === true) {
                        this.tipologia = 'UTENTE';
                        this.visualizzaWidgetSeCiSonoPermessi = true;
                        this.caricaDatiWidget('5');
                }
                break;
            case 'AMMINISTRATORE':
                this.tipologia = 'AMMINISTRATORE';
                this.visualizzaWidgetSeCiSonoPermessi = true;
                this.caricaDatiWidget('5');
                break;
            default:
                this.visualizzaWidgetSeCiSonoPermessi = false;
                break;
        }
    }

    ngOnChanges(c) {

    }

    caricaDatiWidget(limite) {
        const params = {
            Squadra: this.variabiliGlobali.CodAnnoSquadra,
            Limite: limite,
            Utente: this.variabiliGlobali.EMail
        };
        this.apiService.RitornaProssimiEventiUtenti(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const righe = data2.split('§');
                const eventi = new Array();
                righe.forEach(element => {
                    if (element) {
                        const campi = element.split(';');
                        const e = {
                            Cosa: campi[0],
                            Id: +campi[1],
                            PrimoCampo: campi[2],
                            SecondoCampo: campi[3],
                            Data: campi[4]
                        };
                        let ok = false;
                        switch (this.tipologia) {
                            case 'AMMINISTRATORE':
                            case 'SUPER USER':
                                case 'UTENTE':
                                ok = true;
                                break;
                            case 'DIRIGENTE':
                                if (e.Cosa === 'Partita') {
                                    ok = true;
                                }
                                break;
                            case 'ALLENATORE':
                                ok = true;
                                break;
                        }
                        if (ok) {
                            eventi.push(e);
                        }
                    }
                });
                // console.log('Eventi', eventi);

                this.eventi = eventi;
              } else {
                // this.variabiliGlobali.mostraMessaggio(data2, false);
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

    visualizzaTutto() {
        this.mascheraFirme = true;
        this.caricaDatiWidget('');
    }
}
