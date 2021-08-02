import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'datepicker-component',
    templateUrl: 'datepicker.component.html',
    styleUrls: ['datepicker.style.css']
})

export class DatePickerComponent implements OnInit, OnChanges {
    @Input() solaLettura;
    @Input() nomeCampo = new Date();
    @Input() Titolo;
    @Input() icona = '';
    @Input() obbligatorio = false;
    @Input() tipologia = 'calendar'; // calendar - both - timer

    @Output() valoreRitorno: EventEmitter<string> = new EventEmitter<string>();

    campo;
    campo2;
    testoPlaceholder = '';

    constructor(
    ) {

    }

    ngOnInit() {
        this.aggiornaDefault();
    }

    aggiornaDefault(): void {
        if (this.obbligatorio === true) {
            this.campo = new FormControl(this.nomeCampo, [Validators.required]);
            this.campo2 = new FormControl(new Date(), [Validators.required]);
        } else {
            this.campo = new FormControl(this.nomeCampo, [Validators.nullValidator]);
            this.campo2 = new FormControl(new Date(), [Validators.nullValidator]);
        }
    }

    ngOnChanges(r: SimpleChanges) {
        if (r.tipologia) {
            switch (r.tipologia.currentValue) {
                case 'calendar':
                    this.testoPlaceholder = 'Data';
                    break;
                case 'timer':
                    this.testoPlaceholder = 'Ora';
                    break;
                case 'both':
                    this.testoPlaceholder = 'Data Ora';
                    break;
            }
            this.aggiornaDefault();
        }

        if (r.tipoCampo) {
            this.aggiornaDefault();
        }
    
        if (r.nomeCampo) {
            this.aggiornaDefault();
        }
    
        if (r.obbligatorio) {
            this.aggiornaDefault();
        }
    
    }

    cambiamentoData(e) {
        // console.log('Cambiamento data:', e);
    }
}
