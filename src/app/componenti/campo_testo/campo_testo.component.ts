import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { VariabiliGlobali } from 'app/global.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'campo_testo',
  templateUrl: './campo_testo.component.html',
  styleUrls: ['./campo_testo.component.css']
})
export class CampoTestoComponent implements OnInit {
  @Input() soloLettura;
  @Input() nomeCampo;
  @Input() Titolo;
  @Input() lunghezzaMassima = 30;
  @Input() obbligatorio = false;
  @Input() maiuscole = false;
  @Input() tipoCampo = 'text';
  @Input() icona = '';
  @Input() lunghezzaFissa = -1;

  @Input() datiPassati;
  @Input() valoreDefault;
  @Input() campoID;
  @Input() campoDescrizione;

  @Output() ritorno: EventEmitter<string> = new EventEmitter<string>();

  campo;
  campo2;
  campo3;

  datiCombo;
  
  tipoCampo2 = 'text';
  soloLettura2 = false;

  erroreLunghezza = false;

  // erroreNelCampo = false;

  constructor(
      public variabiliGlobali: VariabiliGlobali,
      public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.controllaErrore();
  }

  aggiornaDefault(): void {
    if (this.obbligatorio === true) {
        this.campo = new FormControl(this.valoreDefault, [Validators.required]);
        this.campo2 = new FormControl(this.valoreDefault, [Validators.required]);      
        this.campo3 = new FormControl(this.valoreDefault, [Validators.required]);      
    } else {
        this.campo = new FormControl(this.valoreDefault, [Validators.nullValidator]);
        this.campo2 = new FormControl(this.valoreDefault, [Validators.nullValidator]);      
        this.campo3 = new FormControl(this.valoreDefault, [Validators.nullValidator]);      
    }

    // this.campo.setErrors(null);
    // this.campo2.setErrors(null);
    // this.campo3.setErrors(null);
  }

  ngOnChanges(c) {
    if (c.lunghezzaFissa > -1) {
        this.lunghezzaMassima = c.lunghezzaFissa.currentValue;
    }

    if (c.tipoCampo) {
        this.tipoCampo2 = c.tipoCampo.currentValue;
        this.aggiornaDefault();
    }

    if (c.obbligatorio) {
        this.aggiornaDefault();
    }

    if (c.datiPassati) {
        this.datiCombo = c.datiPassati.currentValue;
        // console.log(this.datiCombo);
    }
    
    if (c.nomeCampo) {
        // console.log(c.nomeCampo.currentValue);
        this.valoreDefault = c.nomeCampo.currentValue;
        this.aggiornaDefault();
    }

    if (c.soloLettura) {
        // console.log(c.soloLettura);
        this.soloLettura2 = c.soloLettura.currentValue;
    }

    this.controllaErrore();
  }

  cambia(e): void {
    // console.log('Cambio ' + this.tipoCampo2, e.target.value, e.target.value.length);
    this.nomeCampo = e.target.value; 
    this.ritorno.emit(this.nomeCampo);

    if (this.lunghezzaFissa === -1 || (this.nomeCampo !== '' && this.lunghezzaFissa > -1 )) {
        this.controllaErrore();
    }
  }

  controllaErrore(): void {
    setTimeout(() => {
        if (this.obbligatorio && this.nomeCampo === '') {
            // console.log('Errore 1');
            this.campo.setErrors({ invalid: true, });
        } else {
            if (this.tipoCampo2 !== 'tendina' && this.tipoCampo2 !== 'data') {
                // Testo, Numero
                if (this.lunghezzaFissa > -1) {
                    // console.log(this.nomeCampo.length, +this.lunghezzaFissa)
                    if (this.nomeCampo) {
                        if (this.nomeCampo.length !== +this.lunghezzaFissa && this.nomeCampo.length > 0) {
                            // console.log('Campo errato. Lunghezza diversa', this.nomeCampo, this.nomeCampo.length);
                            // this.erroreNelCampo = true;
                            // console.log('Errore 4');
                            this.campo.setErrors({ invalid: true, });
                        }
                    } else {
                        // console.log('Errore 2');
                        this.campo.setErrors({ invalid: true, });
                    }
                }
            } else {
                // Tendina / Data
                if (!this.valoreDefault) {
                    // console.log('Errore 3');
                    this.campo3.setErrors({ invalid: true, });
                }
            }
        }
    }, 100);
  }

  cambioValore(e): void {
    // console.log('Cambio combo', e);
    this.valoreDefault = e;
    this.ritorno.emit(e);
  }

  ritornaTesto(e) {
    this.nomeCampo = this.variabiliGlobali.sistemaTestoERitorna(this.maiuscole, e.target.value);
    // console.log(this.nomeCampo);
    this.ritorno.emit(this.nomeCampo);

    if (this.lunghezzaFissa === -1 || (this.nomeCampo !== '' && this.lunghezzaFissa > -1 )) {
        this.controllaErrore();
    }
  }

  cambioData(e): void {
    if (e) {
        const tt = this.datepipe.transform(this.campo3.value, 'yyyy-MM-dd');
        // console.log('Cambio data', tt);
        this.valoreDefault = tt;
        this.ritorno.emit(tt);
    }
  }
}
  

