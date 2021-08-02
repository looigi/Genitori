import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { VariabiliGlobali } from 'app/global.component';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';

@Component({
    selector   : 'fuse-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls  : ['./shortcuts.component.scss']
})
export class FuseShortcutsComponent implements OnInit, AfterViewInit, OnDestroy
{
    // datiAnni;
    idAnno;

    shortcutItems: any[];
    navigationItems: any[];
    filteredNavigationItems: any[];
    searching: boolean;
    mobileShortcutsPanelActive: boolean;

    @Input()
    navigation: any;

    @ViewChild('searchInput')
    searchInputField;

    @ViewChild('shortcuts')
    shortcutsEl: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CookieService} _cookieService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {MediaObserver} _mediaObserver
     * @param {Renderer2} _renderer
     */
    constructor(
        private apiService: ApiService,
        private router: Router,
        public variabiliGlobali: VariabiliGlobali,
        private _cookieService: CookieService,
        private _fuseMatchMediaService: FuseMatchMediaService,
        private _fuseNavigationService: FuseNavigationService,
        private _mediaObserver: MediaObserver,
        private _renderer: Renderer2
    )
    {
        // Set the defaults
        this.shortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the navigation items and flatten them
        if (!this.variabiliGlobali.navigation2) {
            return;
        }
        
        this.navigation = this.variabiliGlobali.navigation2;
        this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(this.navigation);

        // this.variabiliGlobali.navigation2 = this.variabiliGlobali.ridisegnaMenu(this.navigation);

        if ( this._cookieService.check('inCalcio.' + this.variabiliGlobali.EMail + '.shortcuts') )
        {
            this.shortcutItems = JSON.parse(this._cookieService.get('inCalcio.' + this.variabiliGlobali.EMail + '.shortcuts'));
        }
        else
        {
            // User's shortcut items
            this.shortcutItems = [
                /* {
                    title: 'Calendar',
                    type : 'item',
                    icon : 'today',
                    url  : '/apps/calendar'
                }, */
            ];
        }

        if (this.variabiliGlobali.Anno && this.variabiliGlobali.Anno !== '') {
            // this.immUtente = this.variabiliGlobali.prendeImmUtente();
            this.caricaImpostazioniGenerali();
        }      

    }

    ngAfterViewInit(): void
    {
        // Subscribe to media changes
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if ( this._mediaObserver.isActive('gt-sm') )
                {
                    this.hideMobileShortcutsPanel();
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Search
     *
     * @param event
     */
    search(event): void
    {
        const value = event.target.value.toLowerCase();

        if ( value === '' )
        {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;

            return;
        }

        this.searching = true;

        this.filteredNavigationItems = this.navigationItems.filter((navigationItem) => {
            return navigationItem.title.toLowerCase().includes(value);
        });
    }

    /**
     * Toggle shortcut
     *
     * @param event
     * @param itemToToggle
     */
    toggleShortcut(event, itemToToggle): void
    {
        event.stopPropagation();

        for ( let i = 0; i < this.shortcutItems.length; i++ )
        {
            if ( this.shortcutItems[i].url === itemToToggle.url )
            {
                this.shortcutItems.splice(i, 1);

                // Save to the cookies
                this._cookieService.set('inCalcio.' + this.variabiliGlobali.EMail + '.shortcuts', JSON.stringify(this.shortcutItems));

                return;
            }
        }

        this.shortcutItems.push(itemToToggle);

        // Save to the cookies
        this._cookieService.set('inCalcio.' + this.variabiliGlobali.EMail + '.shortcuts', JSON.stringify(this.shortcutItems));
    }

    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    isInShortcuts(navigationItem): any
    {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }

    /**
     * On menu open
     */
    onMenuOpen(): void
    {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }

    /**
     * Show mobile shortcuts
     */
    showMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }

    /**
     * Hide mobile shortcuts
     */    
    hideMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }

    caricaImpostazioniGenerali(): void {
        this.apiService.ritornaImpostazioni(this.variabiliGlobali.CodAnnoSquadra, this.variabiliGlobali.idUtente)
        .map(response => response.text())
        .subscribe(
          data => {
            // this.requestInProgress = false;
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                // console.log(data2);
                const righe = data2.split('§');
                const da = new Array();
                righe.forEach(element => {
                  const element2 = element.split(';');
                  // campi.forEach(element2 => {
                  // console.log(element2);
                  const a = {
                    idAnno: element2[0],
                    Descrizione: element2[1],
                    NomeSquadra: element2[2],
                    Coordinate: element2[3] + ';' + element2[4],
                    Indirizzo: element2[5],
                    CampoSquadra: element2[6],
                    NomePolisportiva: element2[7]
                  };
                  da.push(a);
                });
                // });
                this.idAnno = this.variabiliGlobali.Anno;
                // this.impostazioniCaricate = true;
                setTimeout(() => {
                  this.variabiliGlobali.datiAnni = JSON.parse(JSON.stringify(da));
                  // console.log(this.datiAnni, this.idAnno);
                }, 100);
              } else {
                this.variabiliGlobali.mostraMessaggio('Problema nella lettura delle impostazioni:<br /><br />' + data2, false);
              }
            }
          }
        );
      }
    
      selezioneAnno(ee): void {
        // alert(ee);
        if (ee) {
            let e = null;
            this.variabiliGlobali.datiAnni.forEach(element => {
                if (e === null && element.idAnno === ee) {
                    e = element;
                }
            });
            this.variabiliGlobali.Anno = e.idAnno;
            this.variabiliGlobali.Squadra = e.NomeSquadra;
            while (this.variabiliGlobali.Squadra.indexOf(' ') > -1) {
            this.variabiliGlobali.Squadra = this.variabiliGlobali.Squadra.replace(' ', '_');
            }
            this.variabiliGlobali.DescrizioneAnno = e.Descrizione;
            this.variabiliGlobali.Coordinate = e.Coordinate;
            this.variabiliGlobali.Indirizzo = e.Indirizzo;
            this.variabiliGlobali.CampoSquadra = e.CampoSquadra;
            this.variabiliGlobali.NomePolisportiva = e.NomePolisportiva;

            this.idAnno = e.idAnno;

            while (this.variabiliGlobali.Squadra.indexOf(' ') > -1) {
                this.variabiliGlobali.Squadra = this.variabiliGlobali.Squadra.replace(' ', '_');
            }
            let anno = this.variabiliGlobali.Anno;
            if (anno !== '') {
                for (let i = anno.length + 1; i <= 4; i++) {
                    anno = '0' + anno;
                }
            }
            for (let i = this.variabiliGlobali.CodiceSquadra.length + 1; i <= 5; i++) {
                this.variabiliGlobali.CodiceSquadra = '0' + this.variabiliGlobali.CodiceSquadra;
            }
            this.variabiliGlobali.CodAnnoSquadra = anno + '_' + this.variabiliGlobali.CodiceSquadra;

            localStorage.setItem('GC_Anno', this.idAnno.toString());

            this.variabiliGlobali.mostraMessaggio('Nuovo anno impostato: ' + e.idAnno, false);

            // this.router.navigate(['home']);
        }
    }    
}
