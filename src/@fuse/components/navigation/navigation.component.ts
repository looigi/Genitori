import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { VariabiliGlobali } from 'app/global.component';
import { ApiService } from 'app/services/api.service';

@Component({
    selector       : 'fuse-navigation',
    templateUrl    : './navigation.component.html',
    styleUrls      : ['./navigation.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit
{
    @Input() layout = 'vertical';

    @Input() navigation: any;
    
    navigation2: any;
    // vecchieMails = '';

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali        
    )
    {
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
        // Load the navigation either from the input or from the service
        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();
        // if (this.navigation) {
            // console.log(this.navigation);
            // this.navigation[0].children[2].badge.title = '119';
            // console.log(this.navigation);

        this.variabiliGlobali.navigation2 = this.variabiliGlobali.ridisegnaMenu(this.navigation);
        // }

        if (this.variabiliGlobali.navigation2) {
            this.leggeMails();

            this.timerLetturaMails();
        }

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Load the navigation
                this.navigation = this._fuseNavigationService.getCurrentNavigation();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    leggeMails() {
        return;

        const params = {
            Squadra: this.variabiliGlobali.CodAnnoSquadra,
            idUtente: this.variabiliGlobali.idUtente,
            idAnno: this.variabiliGlobali.Anno,
            Folder: 'Inbox',
            Filter: '',
            Label: '',
            SoloNuove: 'S'
        };
        console.log('Controllo mailz', params);
        this.apiService.controllaMailsNuove(params)
        .map(response => response.text())
        .subscribe(
            data => {
                if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);

                    // if (data2 !== this.vecchieMails) {
                    // this.vecchieMails = data2;

                    const navigation = this.variabiliGlobali.navigation2;
                    // console.log(navigation);
                    let q = 0;
                    let qualeRiga = -1;
                    navigation[0].children.forEach(element => {
                        if (element.id === 'comunicazioni') {
                            qualeRiga = q;
                        }
                        q++;
                    });
                    if (qualeRiga > -1) {
                        if (+data2 > 0) {
                            navigation[0].children[qualeRiga].badge.title = data2;
                            navigation[0].children[qualeRiga].badge.bg = '#F44336';
                        } else {
                            navigation[0].children[qualeRiga].badge.title = '';
                            navigation[0].children[qualeRiga].badge.bg = '#2d323e';
                        }

                        this.variabiliGlobali.navigation2 = JSON.parse(JSON.stringify(navigation));

                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    }

                    // console.log('Mail non lette', data2);
                    // }
                } else {
                    console.log('Problemi a leggere le mail arrivate');
                }
        });
    }

    timerLetturaMails() {
        const numbers = timer(30000);
        numbers.subscribe(any => {
            if (this.variabiliGlobali.CodAnnoSquadra && this.variabiliGlobali.idUtente) {
                this.leggeMails();
            }

            this.timerLetturaMails();
        });  
    }
}
