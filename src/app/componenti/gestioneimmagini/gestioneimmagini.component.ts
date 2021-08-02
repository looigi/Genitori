import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { VariabiliGlobali } from 'app/global.component';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'gestioneimmagini-component',
  templateUrl: 'gestioneimmagini.component.html',
  styleUrls: ['./gestioneimmagini.style.css']
})

export class ImmaginiComponent implements OnInit, OnChanges {
  @Input() pathImmagine;
  @Input() titoloMaschera;
  @Input() solaLettura;
  @Input() Tipologia;
  @Input() Arrotonda;
  @Input() Anno;
  @Input() Squadra;
  @Input() id;

  @Output() immagineCambiata: EventEmitter<string> = new EventEmitter<string>();

  mascheraEditVisibile = false;
  nomeImmagine;
  refreshImmagine;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali,
    private cdRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
  }

  ngOnChanges(c): void {
    if (c.pathImmagine && c.pathImmagine.currentValue) {
      setTimeout(() => {
        /* if (c.pathImmagine.currentValue.indexOf('?') > - 1) {
          this.nomeImmagine = c.pathImmagine.currentValue.substring(0, c.pathImmagine.currentValue.indexOf('?'));
          this.nomeImmagine += '?a=' + new Date().getTime();
        } else {
          this.nomeImmagine = c.pathImmagine.currentValue; //  + '?a=' + new Date().getTime();
        } */
        this.nomeImmagine = c.pathImmagine.currentValue;
        this.cdRef.detectChanges();
        // console.log(this.nomeImmagine);
      }, 100);
    } else {
        setTimeout(() => {
            this.nomeImmagine = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png';
            this.cdRef.detectChanges();
        }, 100);
    }
  }
  
  checkImage(e): void {
      // console.log(e);
      e.srcElement.src = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png';
      this.cdRef.detectChanges();
    }

  cambiaImmagine(): void {
    this.mascheraEditVisibile = true;
  }

  eliminaImmagine(): void {
    const n = this.pathImmagine.replace(this.variabiliGlobali.urlWS, '');
    const nn = n.split('/');
    // console.log(nn);
    let ni = nn[3];
    if (ni.indexOf('?') > -1) {
        ni = ni.substring(0, ni.indexOf('?'));
    }
    const sq = nn[1];
    // console.log('Elimina immagine', sq, ni);
    // return;

    this.apiService.eliminaImmagine(this.Tipologia, sq, ni)
    .map(response => response.text())
    .subscribe(
        data => {
        if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            // console.log(data2);
            if (data2.indexOf('ERROR:') > -1) {
                this.variabiliGlobali.mostraMessaggio('data2', false);
            } else {                
                this.nomeImmagine = '';
                this.immagineCambiata.emit(this.nomeImmagine);
                this.variabiliGlobali.mostraMessaggio('Immagine eliminata', false);
            }
        } else {
            this.variabiliGlobali.mostraMessaggio('Nessun valore di ritorno', false);
            // console.log(data);
        }
      },
      (error) => {
      if (error instanceof Error) {
          this.variabiliGlobali.mostraMessaggio('Errore: ' + error, false);
        }
    });
  }

  immagineCaricata(e): void {
    if (this.nomeImmagine.indexOf('Sconosciuto') > -1) {
        return;
    }
    setTimeout(() => {
      /* if (this.nomeImmagine.indexOf('?') > - 1) {
        this.nomeImmagine = this.nomeImmagine.substring(0, this.nomeImmagine.indexOf('?'));
        this.nomeImmagine += '?a=' + new Date().getTime();
      } else {
        this.nomeImmagine = this.nomeImmagine + '?a=' + new Date().getTime();
      }
      // console.log(this.nomeImmagine); */
      this.immagineCambiata.emit(this.nomeImmagine);
    }, 100);
  }

  chiudiMaschera(): void {
    this.mascheraEditVisibile = false;
  }
    
  chiusuraMascheraUpload(chiudiMaschera): void {
    if (chiudiMaschera === true) {
      this.mascheraEditVisibile = false;
      this.immagineCaricata(null);
      this.refreshImmagine = !this.refreshImmagine;
    }
    // this.attendiUpload = false;
  }
}
