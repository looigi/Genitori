import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';

@Component({
  selector: 'sceltacategoria-component',
  templateUrl: 'scelta_categoria.component.html',
  styleUrls: ['./scelta_categoria.style.css']
})

export class SceltaCategoriaComponent implements OnInit, OnChanges {
  @Input() categoriaSelezionata;
  @Input() userName;
  @Input() tutti = true;
  @Input() disabilitata = false;
  @Input() ritornaVecchioValoreAllAvvio = true;

  @Output() RitornoValore: EventEmitter<string> = new EventEmitter<string>();
  @Output() RitornoRisTempi: EventEmitter<string> = new EventEmitter<string>();
  @Output() RitornoCategoria: EventEmitter<string> = new EventEmitter<string>();
  @Output() RitornaTuttiIDati: EventEmitter<any> = new EventEmitter<any>();

  datiCategorie;
  risTempi;
  categoriaSelezionata2;
  
  constructor(
    private apiService: ApiService,
    private variabiliGlobali: VariabiliGlobali
  ) {
    this.userName = variabiliGlobali.Utente;
    if (this.userName === undefined) {
      this.userName = 'Looigi';
    }
  }

  ngOnInit() {
    this.caricaCategorie();
  }

  ngOnChanges(c) {
    if (c.categoriaSelezionata)  {
        // this.categoriaSelezionata2 = c.categoriaSelezionata.currentValue;
        if (c.categoriaSelezionata.currentValue !== undefined) {
            this.categoriaSelezionata2 = c.categoriaSelezionata.currentValue;
            this.selezioneCategoria({ value: c.categoriaSelezionata.currentValue });
        }
    }
  }

  caricaCategorie(): void {
    const idUte = this.variabiliGlobali.idUtente;
    const params = {
        Squadra: this.variabiliGlobali.CodAnnoSquadra,
        idAnno: this.variabiliGlobali.Anno,
        idUtente: idUte
    };
    this.apiService.ritornaCategorie(params)
    .map(response => response.text())
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          if (data2.indexOf('ERROR') === -1) {
            const campi = data2.split('§');
            // let s = '';
            const ss = new Array();
            campi.forEach(element => {
              if (element !== '') {
                const campi2 = element.split(';');
                if ((this.tutti === false && +campi2[0] === -1)) {
                    // Non carico tutti
                } else {
                    // s += '{ "idCategoria": ' + campi2[0] + ', "Categoria": "' + campi2[1] + '", "RisultatoATempi": "' + campi2[3] + '"},';
                    const sss = {
                        idCategoria: +campi2[0],
                        AnnoCategoria: campi2[16],
                        Categoria: campi2[1],
                        AnticipoConvocazione: +campi2[2],
                        RisultatoATempi: campi2[3],
                        GiornoAllenamento1: +campi2[4],
                        OraInizio1: campi2[5],
                        OraFine1: campi2[6],
                        GiornoAllenamento2: +campi2[7],
                        OraInizio2: campi2[8],
                        OraFine2: campi2[9],
                        GiornoAllenamento3: +campi2[10],
                        OraInizio3: campi2[11],
                        OraFine3: campi2[12],
                        GiornoAllenamento4: +campi2[13],
                        OraInizio4: campi2[14],
                        OraFine4: campi2[15],
                    };
                    ss.push(sss);
                }
              }
            });
            /* if (s.length > 0) {
                s = s.substring(0, s.length - 1);
                s = '[' + s + ']';
                this.datiCategorie = JSON.parse(s);
            } */
            this.datiCategorie = ss;
            // console.log(this.datiCategorie);

            setTimeout(() => {
                this.risTempi = localStorage.getItem(this.userName + '_categoria_rt_sel');
                if (this.ritornaVecchioValoreAllAvvio === true) {
                    let c = localStorage.getItem(this.userName + '_categoria_sel');    
                    if (c !== undefined && c !== null) {
                        while (c.indexOf('"') > -1) {
                            c = c.replace('"', '');
                        }
                        this.categoriaSelezionata2 = +c;
                        // console.log('Valore impostato combo', c, this.categoriaSelezionata2);
                        this.RitornoValore.emit(this.categoriaSelezionata2.toString());
                    }
                // } else {
                //     this.categoriaSelezionata2 = -1;
                }
                this.RitornoRisTempi.emit(this.risTempi);
                this.datiCategorie.forEach(element => {
                    if (+element.idCategoria === +this.categoriaSelezionata2) {
                        this.RitornaTuttiIDati.emit(element);
                    }
                });
            }, 100);        
        } else {
            this.datiCategorie = null;
            // console.log(data2);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
        }
      }
    );
  }

  selezioneCategoria(e) {
      if (e !== undefined && e.value && e.value.toString() !== 'NaN') {
        // console.log('Cambio selezione categoria in scelta', e.value.toString(), this.datiCategorie);
        setTimeout(() => {
            this.categoriaSelezionata2 = +e.value;
        
            this.RitornoValore.emit(e.value);
            if (this.datiCategorie) {
                this.datiCategorie.forEach(element => {
                    if (+element.idCategoria === +e.value) {
                        this.risTempi = element.RisultatoATempi;
                    }
                });
            }
            this.RitornoRisTempi.emit(this.risTempi);
            // console.log('Selezionata categoria:', this.categoriaSelezionata2);
        
            if (this.categoriaSelezionata2 > -1) {
                localStorage.setItem(this.userName + '_categoria_sel', JSON.stringify(e.value));
                localStorage.setItem(this.userName + '_categoria_rt_sel', JSON.stringify(this.risTempi));
            }
        
            let ok = false;
            // console.log('Cerco categoria', e.value);
            if (this.datiCategorie) {
                this.datiCategorie.forEach(element => {
                    // console.log('categoria', element.id, e.value);
                    if (+element.idCategoria === +e.value) {
                        if (ok === false) {
                        ok = true;
                        // console.log('Segnalo categoria', element);
                        this.RitornaTuttiIDati.emit(element);
                        this.RitornoCategoria.emit(element.descrizione);
                        }
                    }
                });
            }            
        }, 100);    
      }
  }
}
