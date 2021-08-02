import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector: 'widget_indicatori-component',
    templateUrl: 'widget_indicatori.component.html',
    styleUrls: ['widget_indicatori.style.css']
})

export class WidgetIndicatoriComponent implements OnInit, OnChanges {
    visualizzaFirmaElettronica = false;
    nomeImmagineFirma;
    visualizzaFESeCiSonoPermessi = false;
    mascheraFirme = false;
    dati;
    ris;
    Dettaglio = [ '', 'Quota assente', 'Certificato scaduto o assente', 'Firma genitore assente', 'Kit assente o da consegnare' ];

    constructor(
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit() {
        const w = this.variabiliGlobali.WidgetSelezionati.split('-');
        if (w[4] === '0') {
            return;
        }
        // CONTROLLO PERMESSI
        // console.log(this.variabiliGlobali.Permessi);

        switch (this.variabiliGlobali.Tipologia.toUpperCase()) {
            case 'GENITORE':
                break;
            case 'SUPER USER':
                /* if (this.variabiliGlobali.AccedeASquadra !== '') {
                    this.visualizzaFESeCiSonoPermessi = true;
                    this.caricaDati('N');
                } else {
                    this.visualizzaFESeCiSonoPermessi = false;
                } */
                if (this.variabiliGlobali.CodAnnoSquadra !== '') {
                    this.visualizzaFESeCiSonoPermessi = true;
                    this.caricaDati('N');
                } else {
                    this.visualizzaFESeCiSonoPermessi = false;
                }
                break;
            case 'UTENTE':
                if (this.variabiliGlobali.Permessi && this.variabiliGlobali.Permessi.SEGRETERIA !== undefined &&
                    this.variabiliGlobali.Permessi.SEGRETERIA === true) {
                    this.visualizzaFESeCiSonoPermessi = true;
                    this.caricaDati('N');
                }
                break;
            case 'AMMINISTRATORE':
                this.visualizzaFESeCiSonoPermessi = true;
                this.caricaDati('N');
                break;
            default:
                break;
        }
    }

    ngOnChanges(r) {

    }

    caricaDati(Tutto) {
        this.apiService.RitornaIndicatori(
            this.variabiliGlobali.CodAnnoSquadra)
        .map(response => response.text())
        .subscribe(
            data => {
                if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                    if (data2.indexOf('ERROR') === -1) {
                        const righe = data2.split(';');
                        this.ris = new Array();
                        let q = 0;
                        righe.forEach(element => {
                            const e = {
                                Nome: this.Dettaglio[q + 1],
                                Valore: element
                            }
                            this.ris.push(e);
                            q++;
                        });
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
