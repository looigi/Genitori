import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as italiano } from './i18n/it';

@Component({
    selector   : 'genitori',
    templateUrl: './genitori.component.html',
    styleUrls  : ['./genitori.component.scss']
})

export class GenitoriComponent
{
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, italiano);
    }
}
