import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'immagine_griglia-component',
    templateUrl: 'immagine_griglia.component.html',
    styleUrls: ['immagine_griglia.style.css']
})

export class ImmagineGrigliaComponent implements OnInit, OnChanges {
    @Input() immagine;
    @Input() classePassata;
    @Input() refresh;
    @Input() puoIngrandire;
    @Input() stilePassato;

    immagineRitorno: string = '../../../assets/images/giphy_image.gif';
    immagineAttuale;
    immagineImpostata = false;

    visualizzaGrande = false;
    posLeft = 0;
    posTop = 0;

    constructor(
        private apiService: ApiService,
        public sanitizer: DomSanitizer,
        public variabiliGlobali: VariabiliGlobali,
        private cdRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        // console.log(this.immagine);
    }

    ngOnChanges(r) {
        if (r.immagine) {
            setTimeout(() => {
                this.immagineAttuale = r.immagine.currentValue;
                if (this.immagineAttuale) {
                    if (this.immagineAttuale.toUpperCase().indexOf('.KGB') > -1  && this.immagineAttuale && this.immagineAttuale !== '') {
                        this.prendeImmagine(this.immagineAttuale);
                    } else {
                        // console.log(this.immagineAttuale);
                        this.immagineRitorno = (this.immagineAttuale + '?a=' + new Date()) ;
                    }
                } else {
                    this.immagineRitorno = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png';
                }
            }, 10);
        }

        if (r.refresh) {
            setTimeout(() => {
                this.immagineAttuale = r.immagine.currentValue;
                if (this.immagineAttuale) {
                    if (this.immagineAttuale.toUpperCase().indexOf('.KGB') > -1  && this.immagineAttuale && this.immagineAttuale !== '') {
                        this.immagineRitorno = '../../../assets/images/giphy_image.gif';
                        this.prendeImmagine(this.immagineAttuale);
                    } else {
                        // console.log(this.immagineAttuale);
                        this.immagineRitorno = (this.immagineAttuale + '?a=' + new Date()) ;
                    }
                } else {
                    this.immagineRitorno = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png';
                }
            }, 10);
        }
    }

    checkImage(e): void {
        // console.log(e);
        e.srcElement.src = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png?a=' + new Date().toString();
        this.cdRef.detectChanges();
    }

    prendeImmagine(n) {
        if (!this.variabiliGlobali.urlWS) {
            return;
        }
        
        this.immagineImpostata = false;
        this.apiService.converteImmagine(n)
        .map(response => response.text())
        .subscribe(
            data => {
                if (data) {
                    const data2: string = this.apiService.prendeSoloDatiValidi(data);
                    if (data2.indexOf('ERROR') === -1) {
                        //  + '?a=' + new Date()
                        this.immagineRitorno = (data2 + '?a=' + new Date()) ;
                        this.immagineImpostata = true;
                        // console.log('Ritorno:', this.immagineRitorno);
                    } else {
                        this.immagineRitorno = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png';
                        this.immagineImpostata = false;
                    }
                }
            },
            (error) => {
                this.immagineRitorno = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png';
                if (error instanceof Error) {
                }
            }
        );
    }

    over(e) {
        if (this.puoIngrandire === true && this.immagineImpostata === true) {
            // console.log('Dentro', e);
            this.visualizzaGrande = true;
            
            const rect = e.target.getBoundingClientRect();
            this.posLeft = (e.clientX  - rect.left);
            this.posTop = (e.clientY  - rect.top);
        }
    }

    out(e) {
        if (this.puoIngrandire === true && this.immagineImpostata === true) {
            // console.log('Fuori', e);
            this.visualizzaGrande = false;
        }
    }
}
