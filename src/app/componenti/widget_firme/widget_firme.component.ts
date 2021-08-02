import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector: 'widget_firme-component',
    templateUrl: 'widget_firme.component.html',
    styleUrls: ['widget_firme.style.css']
})

export class WidgetFirmeComponent implements OnInit, OnChanges {
    gridUltimeFirme;
    gridTutteFirme;
    visualizzaFirmaElettronica = false;
    nomeImmagineFirma;
    visualizzaFESeCiSonoPermessi = false;
    mascheraFirme = false;

    constructor(
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit() {
        const w = this.variabiliGlobali.WidgetSelezionati.split('-');
        if (w[0] === '0') {
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
                    this.caricaUltimeFirme('N');
                } else {
                    this.visualizzaFESeCiSonoPermessi = false;
                } */
                if (this.variabiliGlobali.CodAnnoSquadra !== '') {
                    this.visualizzaFESeCiSonoPermessi = true;
                    this.caricaUltimeFirme('N');
                } else {
                    this.visualizzaFESeCiSonoPermessi = false;
                }
                break;
            case 'UTENTE':
                if (this.variabiliGlobali.Permessi && this.variabiliGlobali.Permessi.SEGRETERIA !== undefined &&
                    this.variabiliGlobali.Permessi.SEGRETERIA === true) {
                    this.visualizzaFESeCiSonoPermessi = true;
                    this.caricaUltimeFirme('N');
                }
                break;
            case 'AMMINISTRATORE':
                this.visualizzaFESeCiSonoPermessi = true;
                this.caricaUltimeFirme('N');
                break;
            default:
                break;
        }
    }

    ngOnChanges(r) {

    }

    caricaUltimeFirme(Tutto) {
        this.apiService.ritornaUltimeFirme(
            this.variabiliGlobali.CodAnnoSquadra,
            Tutto)
        .map(response => response.text())
        .subscribe(
            data => {
                if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                    if (data2.indexOf('ERROR') === -1) {
                        const righe = data2.split('§');
    
                        interface Tabella {
                            idRiga: number;
                            Immagine: string;
                            idGiocatore: number;
                            idGenitore: number;
                            Genitore: string;
                            Datella: string;
                            DataFirma: string;
                            NomeGiocatore: string;
                            NomeGenitore: string;
                        }
                        const d: Tabella[] = new Array();
                        let conta = 0;
                        righe.forEach(element => {
                            if (element && element !== '') {
                                const campi = element.split(';');
                                const t: Tabella = {
                                    idRiga: conta,
                                    Immagine: this.variabiliGlobali.urlWS + 'MultiMedia/' + this.variabiliGlobali.Squadra + '/Firme/' +
                                        this.variabiliGlobali.Anno + '_' + campi[0] + '_' + campi[1] + '.kgb',
                                    idGiocatore: +campi[0],
                                    idGenitore: +campi[1],
                                    Genitore: this.prendeGenitore(+campi[1]),
                                    Datella: campi[2],
                                    DataFirma: campi[3],
                                    NomeGiocatore: campi [4],
                                    NomeGenitore: campi [5]
                                };
                                d.push(t);
                                conta++;
                            }
                        });
          
                        if (conta > 0) {
                            if (Tutto === 'S') {
                                this.gridTutteFirme = d;
                            } else {
                                this.gridUltimeFirme = d;
                            }
                        } else {
                            this.gridUltimeFirme = undefined;
                            this.gridTutteFirme = undefined;
                        }
                        // console.log(d);
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

    prendeGenitore(n) {
        switch (n) {
            case 1:
                return 'Padre';
            case 2:
                return 'Madre';
            case 3:
                return 'Giocatore';
        }
    }

    visualizzaFirma(e) {
        this.visualizzaFirmaElettronica = true;
        this.nomeImmagineFirma = e.Immagine;
        console.log(e);
    }

    eliminaFirma(e) {
        this.apiService.eliminaFirma(
            this.variabiliGlobali.CodAnnoSquadra,
            e.idGiocatore,
            e.idGenitore
        )
        .map(response => response.text())
        .subscribe(
            data => {
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    this.chiudeMascheraFirma();
                    this.caricaUltimeFirme('N');
                    this.variabiliGlobali.mostraMessaggio('Firma eliminata', false);
                } else {
                    this.variabiliGlobali.mostraMessaggio(data2, false);
                }
            }
            }
        );
    }

    convalidaFirma(e) {
        this.apiService.convalidaFirma(
            this.variabiliGlobali.Anno,
            this.variabiliGlobali.CodAnnoSquadra,
            e.idGiocatore,
            e.idGenitore
        )
        .map(response => response.text())
        .subscribe(
            data => {
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    this.aggiornaSemafori(e.idGiocatore);
                } else {
                    this.variabiliGlobali.mostraMessaggio(data2, false);
                }
            }
            }
        );
    }

    aggiornaSemafori(id) {
        this.apiService.AggiornaSemafori(
            this.variabiliGlobali.CodAnnoSquadra,
            id)
        .map(response => response.text())
        .subscribe(
            data => {
                if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                    // console.log('Salva dati 3/2:', data2);
                    if (data2.indexOf('ERROR') === -1) {
                        this.chiudeMascheraFirma();
                        this.caricaUltimeFirme('N');
                        
                        this.variabiliGlobali.mostraMessaggio('Firma convalidata', false);
                    } else {
                        this.variabiliGlobali.mostraMessaggio(data2, false);
                    }
                }
            },
            (error) => {
                if (error instanceof Error) {
                    this.variabiliGlobali.mostraMessaggio('Errore: ' + error, false);
                }
            }
        );
    }
    
    chiudeMascheraFirma() {
        this.visualizzaFirmaElettronica = false;
        this.nomeImmagineFirma = '';
    }

    visualizzaTutto() {
        this.mascheraFirme = true;
        this.caricaUltimeFirme('S');
    }
}
