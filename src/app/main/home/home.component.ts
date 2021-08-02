import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as italiano } from './i18n/it';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
    selector   : 'home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})

export class HomeComponent implements OnInit
{
    DataDiNascita;
    aggiornatiDati = false;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private apiService: ApiService,
        private variabiliGlobali: VariabiliGlobali,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, italiano);
    }

    ngOnInit() {
      const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
      };
      this.apiService.AggiornaDati(params)
      .map(response => response.text())
      .subscribe(
        data => {
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            this.aggiornatiDati = true;
          }
        });
    }
}
