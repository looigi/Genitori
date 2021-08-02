import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as italiano } from './i18n/it';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';
import { ContattiModule } from './contatti.module';
import { DatePipe } from '@angular/common';

@Component({
    selector   : 'contatti',
    templateUrl: './contatti.component.html',
    styleUrls  : ['./contatti.component.scss']
})

export class ContattiComponent implements OnInit
{
    categoriaSelezionata;
    datiContatti;
    userName;
    columns;
    tipiCampi;
    titoloGriglia = 'Contatti Categoria';
    caricamentoDatiInCorso = 'OK';

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private apiService: ApiService,
        private datepipe: DatePipe,
        public variabiliGlobali: VariabiliGlobali,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this.userName = variabiliGlobali.Utente;
        this._fuseTranslationLoaderService.loadTranslations(english, italiano);
    }

    ngOnInit() {
        this.caricaDati();
    }
  
    premutoRefresh(e): void {
        this.caricaDati();
    }
  
    selezioneCategoria(e): void {
        if (e) {
          // console.log('Categoria selezionata:', e);
          this.categoriaSelezionata = e;
          this.caricaDati();
        }
      }  
    
    caricaDati() {
        this.caricamentoDatiInCorso = 'CARICAMENTO';
        const params = {
            Squadra: this.variabiliGlobali.CodAnnoSquadra,
            idCategoria: -1
        };
        this.apiService.ritornaDatiContatti(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const campi = data2.split('§');
                const contatti = new Array();                
                campi.forEach(element => {
                    if (element) {
                        const gg = element.split(';');
                        if (gg[2] === 'S') {
                            const g = {
                                Immagine: this.variabiliGlobali.urlWS + 'MultiMedia/' + this.variabiliGlobali.Squadra + '/Giocatori/' +
                                    this.variabiliGlobali.Anno + '_' + gg[9] + '.kgb',
                                Nominativo: gg[0] + ' ' + gg[1],
                                Cognome: gg[0],
                                Nome: gg[1],
                                Genitore1: '',
                                EMail1: gg[3],
                                Telefono1: gg[4],
                                Genitore2: '',
                                EMail2: '',
                                Telefono2: '',
                                DataDiNascita: gg[10], // ? this.datepipe.transform(gg[10], 'dd-MM-yyyy') : '',
                            };
                            contatti.push(g);
                        } else {
                            const g = {
                                Immagine: this.variabiliGlobali.urlWS + 'MultiMedia/' + this.variabiliGlobali.Squadra + '/Giocatori/' +
                                    this.variabiliGlobali.Anno + '_' + gg[9] + '.kgb',
                                Nominativo: gg[0] + ' ' + gg[1],
                                Cognome: gg[0],
                                Nome: gg[1],
                                Genitore1: gg[3],
                                EMail1: gg[4],
                                Telefono1: gg[5],
                                Genitore2: gg[6],
                                EMail2: gg[7],
                                Telefono2: gg[8],
                                DataDiNascita: gg[10], // ? this.datepipe.transform(gg[10], 'dd-MM-yyyy') : '',
                            };
                            contatti.push(g);
                        }
                    }
                });
                this.datiContatti = JSON.parse(JSON.stringify(contatti));
                this.columns = ['Immagine', 'Nominativo', 'DataDiNascita', 'Genitore1', 'EMail1', 'Telefono1', 'Genitore2', 'EMail2', 'Telefono2'];
                this.tipiCampi = ['', 'Testo', 'Data', 'Testo', 'Testo', 'Numero', 'Testo', 'Testo', 'Numero'];
                // console.log(this.datiContatti);
                this.caricamentoDatiInCorso = 'OK';
            } else {
                this.datiContatti = null;
                // console.log(data2);
                this.caricamentoDatiInCorso = 'OK';
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
