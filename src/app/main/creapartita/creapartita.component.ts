import { OnInit, ViewEncapsulation, Component, OnDestroy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';
import { ReplaySubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ConfirmationDialogComponent } from 'app/componenti/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
    selector   : 'creapartita',
    templateUrl: './creapartita.component.html',
    styleUrls  : ['./creapartita.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class CreaPartitaComponent implements OnInit, OnDestroy
{
    @Input() dataPartita;
    @Input() idPartita;
    @Input() agisce;
    @Input() soloVisualizzazione = true;

    @Output() chiusuraMaschera: EventEmitter<string> = new EventEmitter<string>();
  
    ColumnMode = ColumnMode;

    datiCategorie;
    gridDataGiocatori;
    idPartita2;
    haSalvato = false;
    mascheraEditAperta = false;
    strutturaPerEdit;
    solaLettura = false;
    datiTipologie;
    datiAllenatori;
    immagineAllenatore;
    campiCasa = [{ idCasa: 'S', Descrizione: 'In Casa' },
      { idCasa: 'N', Descrizione: 'Fuori Casa' }, { idCasa: 'E', Descrizione: 'CampoEsterno' }];
    datiRisTempo = [{ idRisTempo: 'S', Descrizione: 'Sì' }, { idRisTempo: 'N', Descrizione: 'No' }];
    datiMezziTrasporto = [{ id: 'A', Descrizione: 'Auto Propria'}, { id: 'P', Descrizione: 'Pullman'}];
    campoEsternoAbilitato = false;
    // indirizzoCampoEsterno;
    immagineArbitro;
    immagineAvversario;
    datiArbitri;
    inserimentoOModifica;
    titoloGrigliaGioc1;
    titoloGrigliaGioc2;
    titoloGrigliaGioc3;
    caricamentoDatiInCorsoGioc1;
    caricamentoDatiInCorsoGioc2;
    gridDataGiocNonConv;
    gridDataGiocConv;
    gridDataGiocRisposte;
    columnsGioc1;
    columnsGioc2;
    columnsGioc3;
    effettuaAutoFitGioc1;
    effettuaAutoFitGioc2;
    pulisceSelezioneGioc1;
    pulisceSelezioneGioc2;
    indirizzoConvocazione = '';
    indirizzoSchedaPartita = '';
    appoStrutturaDati;
    pulisceSelezione = false;
    datiAvversari;
    marcatori;
    convocati;
    campiUlteriori;
    multimedia;
    qualeMultimedia;
    nomeMultimedia;
    Ricerca;
    titoloMascheraEdit;
    categoriaSelezionata;
    vecchiaCategoria = '';
    nomeUrlImmagine;
    dataPartita2;
    ricercaAvv = '';
    tempPerRicerca;
    filteredAvversari;
    userName;
    ultimoIndirizzoAvversario;
    dirigenti;
    dataCorretta = true;
    comboDisabilitata = false;
    datiTempi = [ { id: 1, Descrizione: 'Uno' }, { id: 2, Descrizione: 'Due' }, { id: 3, Descrizione: 'Tre'} ];
    sitoLocale = false;
    // caricatiGiocatori;
    interval;
    
    constructor(
        @Inject(DOCUMENT) document: any,
        private apiService: ApiService,
        public dialog: MatDialog,
        private datepipe: DatePipe,
        public sanitizer: DomSanitizer,
        public variabiliGlobali: VariabiliGlobali,
    ) {
        this.userName = variabiliGlobali.Utente;
        // console.log(document.location.href);
        if (document.location.href.toUpperCase().indexOf('LOOIGI') > -1 || document.location.href.toUpperCase().indexOf('LOCALHOST') > -1) {
            this.sitoLocale = true;
        }
    }
    
    ngOnInit() {
        this.haSalvato = false;
        this.caricaCategorie();
    }

    ngOnDestroy() {
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
                let s = '';
                const ss = new Array();
                campi.forEach(element => {
                  if (element !== '') {
                    const campi2 = element.split(';');
                    // console.log(campi2);
                    if (+campi2[0] === -1) {
                        // Non carico tutti
                    } else {
                        // s += '{ "idCategoria": ' + campi2[0] + ', "Categoria": "' + campi2[1] + '", "Anticipo": ' + campi2[2] + ', "RisultatoATempi": "' + campi2[3] + '"},';
                        const sss = {
                            idCategoria: +campi2[0],
                            Categoria: campi2[1],
                            Anticipo: campi2[2] ? +(campi2[2].replace(',', '.')) : 0,
                            RisultatoATempi: campi2[3],
                            ShootOut: campi2[17] === 'S' ? true : false,
                            idNumeroTempi: +campi2[18]
                        };
                        ss.push(sss);
                    }
                  }
                });
                // if (s.length > 0) {
                //   s = s.substring(0, s.length - 1);
                //   s = '[' + s + ']';
                // }
                // console.log(ss);
                // this.datiCategorie = JSON.parse(s);        
                this.datiCategorie = ss;
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
    
    ngOnChanges(r) {
        if (r.dataPartita) {
            if (r.dataPartita.currentValue !== null) {
                this.haSalvato = false;
                const fs = this.datepipe.transform(r.dataPartita.currentValue.date, 'yyyy-MM-dd HH:mm:ss');
                const fs2 = this.datepipe.transform(r.dataPartita.currentValue.date, 'HH:mm:ss');
                this.dataPartita2 = fs;
                // console.log('Data partita:', r.dataPartita.currentValue.date);

                if (this.strutturaPerEdit) {
                    this.strutturaPerEdit.DataOra = fs;
                    this.strutturaPerEdit.OraPartita = fs2;
                }
                // console.log('Data Partita:', r.dataPartita.currentValue);
                this.cambioData(null);
            }
        }

        if (r.idPartita) {
            if (r.idPartita.currentValue !== null) {
                this.haSalvato = false;
                this.idPartita2 = r.idPartita.currentValue;
                // console.log('ID PARTITA:', this.idPartita2);
                // this.creaStrutturaPartita();
            }
        }

        if (r.agisce) {
            // console.log('Agisce');
            this.creaStrutturaPartita();
        }

        if (r.soloVisualizzazione) {
          if (r.soloVisualizzazione.currentValue === true) {
            this.comboDisabilitata = true;
            this.solaLettura = true;
            console.log('Diasbilito campi');
          }
        }
    }

    caricaTipologie() {
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra
        };
    
        this.apiService.ritornaTipologie(params.Squadra)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const campi = data2.split('§');
                // console.log(campi);
                this.datiTipologie = new Array();
                campi.forEach(element => {
                  if (element !== '') {
                    const aa = element.split(';');
                    const a = {
                      idTipologia: aa[0],
                      Descrizione: aa[1],
                    };
                    this.datiTipologie.push(a);
                  }
                });
              }
            }
          }
        );
    }
    
    caricaNuovoNumeroPartita() {
        const params = {
            Squadra: this.variabiliGlobali.CodAnnoSquadra
        };
    
        this.apiService.ritornaNuovoNumeroPartita(params.Squadra)
        .map(response => response.text())
        .subscribe(
        data => {
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    this.strutturaPerEdit.idPartita = +data2;
                    this.appoStrutturaDati = JSON.parse(JSON.stringify(this.strutturaPerEdit));
                    // console.log('Nuovo numero id partita:', +data2);

                    // this.caricaAvversari();
                    // this.caricaAllenatori();
                    this.caricaTipologie();
                    // this.caricaGiocatori(true);
                    this.caricaArbitri();

                    this.impostaLuogoAppuntamento();
                }   
            }
        });
    }    

    clickSuCellaGioc1(e) {
        if (e && this.soloVisualizzazione === false) {
          // console.log('Click su cella gioc 1');
          this.caricamentoDatiInCorsoGioc2 = 'CARICAMENTO';
          if (this.gridDataGiocConv === undefined || this.gridDataGiocConv === 'empty grid' || this.gridDataGiocConv === null) {
            this.gridDataGiocConv = new Array();
          }
          // if (this.gridDataGiocRisposte === undefined || this.gridDataGiocRisposte === 'empty grid' || this.gridDataGiocRisposte === null) {
          //   this.gridDataGiocRisposte = new Array();
          // }

          const app = JSON.parse(JSON.stringify(this.gridDataGiocConv));
          app.push(e);
          this.gridDataGiocConv = JSON.parse(JSON.stringify(app));

          // const app2 = JSON.parse(JSON.stringify(this.gridDataGiocRisposte));
          // app2.push(e);
          // this.gridDataGiocRisposte = JSON.parse(JSON.stringify(app2));
          // this.columnsGioc3 = ['Immagine', 'Nominativo', 'RispostaConvocazione'];

          // console.log(this.gridDataGioc2);
          this.gridDataGiocNonConv = this.gridDataGiocNonConv.filter( h => +h.idGiocatore !== +e.idGiocatore);
          this.caricamentoDatiInCorsoGioc2 = 'OK';

          this.ordinaArray();
        }
        if (!this.gridDataGiocConv) {
            this.gridDataGiocConv = new Array();
        }
        this.titoloGrigliaGioc2 = 'Convocati: ' + this.gridDataGiocConv.length;
        console.log(this.gridDataGiocNonConv, this.gridDataGiocConv);
    }

    ordinaArray() {        
        const app1 = JSON.parse(JSON.stringify(this.gridDataGiocConv));
        const app2 = JSON.parse(JSON.stringify(this.gridDataGiocNonConv));
        this.gridDataGiocConv = null;
        this.gridDataGiocNonConv = null;
        app1.sort((a, b) => a.Nominativo.localeCompare(b.Nominativo));
        app2.sort((a, b) => a.Nominativo.localeCompare(b.Nominativo));
        setTimeout(() => {
          this.gridDataGiocConv = JSON.parse(JSON.stringify(app1));
          this.gridDataGiocNonConv = JSON.parse(JSON.stringify(app2));

          this.aggiornaRisposte();
        }, 100);
    }

    clickSuCellaGioc2(e) {
        if (e && this.soloVisualizzazione === false) {
          // console.log('Click su cella gioc 2');
          this.caricamentoDatiInCorsoGioc1 = 'CARICAMENTO';
          if (this.gridDataGiocNonConv === undefined || this.gridDataGiocNonConv === 'empty grid' || this.gridDataGiocNonConv === null) {
            this.gridDataGiocNonConv = new Array();
          }
          const app = JSON.parse(JSON.stringify(this.gridDataGiocNonConv));
          app.push(e);
          this.gridDataGiocNonConv = JSON.parse(JSON.stringify(app));
          // console.log(this.gridDataGioc2);
          this.gridDataGiocConv = this.gridDataGiocConv.filter( h => +h.idGiocatore !== +e.idGiocatore);
          this.caricamentoDatiInCorsoGioc1 = 'OK';

          // this.gridDataGiocRisposte =  this.gridDataGiocRisposte.filter( h => +h.idGiocatore !== +e.idGiocatore);
          // this.columnsGioc3 = ['Immagine', 'Nominativo', 'RispostaConvocazione'];          
          
          this.ordinaArray();
        }
        if (!this.gridDataGiocNonConv) {
            this.gridDataGiocNonConv = new Array();
        }
        this.titoloGrigliaGioc1 = 'Da Convocare: ' + this.gridDataGiocNonConv.length;
        console.log(this.gridDataGiocNonConv, this.gridDataGiocConv);
    }
    
    checkImage(e): void {
        // console.log(e);
        e.srcElement.src = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png?a=' + new Date().toString();
    }

    selezioneCategoriaPerEdit(e) {
        if (e && e > -1) {
            // console.log('Cambio categoria 1', this.strutturaPerEdit.idCategoria);
            this.strutturaPerEdit.idCategoria = e;
            this.datiCategorie.forEach(element => {
                if (+e === +element.idCategoria) { 
                    this.strutturaPerEdit.AnticipoConvocazione = element.Anticipo;
                    this.strutturaPerEdit.ShootOut = element.ShootOut;
                    this.strutturaPerEdit.idNumeroTempi = +element.idNumeroTempi;
                }
            });
            console.log('Cambio categoria 2', this.strutturaPerEdit);

            this.caricaAllenatori();
            this.caricaGiocatori(true);
            this.caricaDirigenti();
            this.calcolaOraAppuntamento();
        }
    }
    
    selezioneRisTempi(e) {
        if (e) {
          // console.log(e);
          this.strutturaPerEdit.RisultatoATempi = e;
        }
    }

    caricaArbitri() {
        return;
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
          idCategoria: this.strutturaPerEdit.idCategoria
        };
    
        this.apiService.ritornaArbitri(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const campi = data2.split('§');
                // console.log(campi);
                this.datiArbitri = new Array();
                campi.forEach(element => {
                  if (element !== '') {
                    const aa = element.split(';');
                    const a = {
                      idArbitro: aa[0],
                      Cognome: aa[1],
                      Nome: aa[2],
                      Tutto: aa[1] + ' ' + aa[2]
                    };
                    this.datiArbitri.push(a);
                  }
                });
                // console.log(this.datiArbitri);
              }
            }
          }
        );
    }
    
    caricaDirigenti() {
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
          idCategoria: this.strutturaPerEdit.idCategoria
        };
    
        this.apiService.ritornaDirigenti(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const campi = data2.split('§');
                // console.log(campi);
                const dirigenti = new Array();
                this.dirigenti = '';
                campi.forEach(element => {
                  if (element !== '') {
                    const aa = element.split(';');
                    const a = {
                      idDirigente: aa[0],
                      Cognome: aa[1],
                      Nome: aa[2],
                    };
                    dirigenti.push(a);
                    this.dirigenti += a.Cognome + ' ' + a.Nome + ' - ';
                  }
                });
                if (this.dirigenti.length > 0) {
                    this.dirigenti = this.dirigenti.substring(0, this.dirigenti.length - 3);
                }
                // console.log('Dirigenti:', this.dirigenti);
                this.strutturaPerEdit.Dirigenti = '';
                let q = 0;
                dirigenti.forEach(element => {
                  q++;
                  this.strutturaPerEdit.Dirigenti += element.idDirigente + ';';
                });
                // console.log(this.strutturaPerEdit.Dirigenti);
              } else {
                // this.strutturaPerEdit.Dirigenti = '';
                this.dirigenti = '';
              }
            }
          }
        );
    }
    
    caricaAllenatori() {
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
          idCategoria: this.strutturaPerEdit.idCategoria
        };
    
        this.apiService.ritornaAllenatori(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const campi = data2.split('§');
                this.datiAllenatori = new Array();
                let q = 0;
                campi.forEach(element => {
                  if (element !== '') {
                    const aa = element.split(';');
                    const a = {
                      idAllenatore: aa[0],
                      Cognome: aa[1],
                      Nome: aa[2],
                      Tutto: aa[1] + ' ' + aa[2]
                    };
                    this.datiAllenatori.push(a);
                    q++;
                  }
                });
                if (this.strutturaPerEdit) {
                    setTimeout(() => {
                        if (q > 0) {
                            if (this.datiAllenatori && this.datiAllenatori[0]) {
                                this.strutturaPerEdit.idAllenatore = this.datiAllenatori[0].idAllenatore;
                                this.immagineAllenatore = this.variabiliGlobali.urlWS + 'MultiMedia/' + this.variabiliGlobali.Squadra + '/Allenatori/' +
                                    this.variabiliGlobali.Anno + '_' + this.datiAllenatori[0].idAllenatore + '.kgb'; // jpg';
                            }
                        } else {
                            this.strutturaPerEdit.idAllenatore = -1;
                            this.immagineAllenatore = '';
                        }
                    }, 1000);
                }
              } else {
                this.strutturaPerEdit.idAllenatore = -1;
                this.immagineAllenatore = '';
              }
            }
          }
        );
    }

    caricaAvversari() {
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
          ricerca: this.Ricerca
        };
    
        this.apiService.ritornaAvversari(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const campi = data2.split('§');
                this.datiAvversari = new Array();
    
                campi.forEach(element => {
                  if (element !== '') {
                    const aa = element.split(';');
                    const a = {
                      idAvversario: aa[0],
                      Descrizione: aa[2],
                      idCampo: aa[1],
                      Campo: aa[3],
                      Indirizzo: aa[4],
                      Lat: aa[5],
                      Lon: aa[6]
                    };
                    this.datiAvversari.push(a);
                  }
                });
                this.filteredAvversari = [...this.datiAvversari];
                // console.log('Avversari:', this.filteredAvversari, this.datiAvversari);
              }
            }
          }
        );
    }
    
    caricaGiocatori(perEdit) {
        if (this.strutturaPerEdit.idCategoria === -1) { // } && this.inserimentoOModifica === 'INSERIMENTO') {
          return;
        }
        // if (this.gridDataGiocNonConv && this.gridDataGiocNonConv.length > 0) {
        //     return;
        // }
    
        this.vecchiaCategoria = this.strutturaPerEdit.idCategoria;
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
          idCategoria: this.strutturaPerEdit.idCategoria
        };
        this.caricamentoDatiInCorsoGioc1 = 'CARICAMENTO';
        this.titoloGrigliaGioc1 = '';
        this.apiService.ritornaGiocatoriCategoria(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              // console.log('Giocatori categoria convocati', data2);
              if (data2.indexOf('ERROR') === -1) {
                const righe = data2.split('§');
            
                interface Tabella {
                    idRiga: number;
                    Immagine: string;
                    idGiocatore: number;
                    idR: number;
                    Cognome: string;
                    Nome: string;
                    Ruolo: string;
                    EMail: string;
                    Telefono: string;
                    Soprannome: string;
                    DataDiNascita: string;
                    Indirizzo: string;
                    CodFiscale: string;
                    Maschio: string;
                    Citta: string;
                    Matricola: string;
                    NumeroMaglia: string;
                    idCategoria: number;
                    idCategoria2: number;
                    Categoria2: string;
                    idCategoria3: number;
                    Categoria3: string;
                    Categoria1: string;
                    Categorie: string;
                    RapportoCompleto: string;
                    idTaglia: number;
                    Nominativo: string;
                    CertificatoMedico: boolean;
                    CertificatoScaduto: boolean;
                    ImmagineCert: string;
                }
                const d: Tabella[] = new Array();
                let conta = 0;
                righe.forEach(element => {
                    if (element && element !== '') {
                        const campi = element.split(';');
                        const t: Tabella = {
                            idRiga: conta,
                            Immagine: this.variabiliGlobali.urlWS + 'MultiMedia/' + this.variabiliGlobali.Squadra + '/Giocatori/' +
                                this.variabiliGlobali.Anno + '_' + campi[0] + '.kgb', // jpg',
                            idGiocatore: campi[0],
                            idR: +campi[1],
                            Cognome: campi[2],
                            Nome: campi[3],
                            Ruolo: campi[4],
                            EMail: campi[5],
                            Telefono: campi[6],
                            Soprannome: campi[7],
                            DataDiNascita: campi[8],
                            Indirizzo: campi[9],
                            CodFiscale: campi[10],
                            Maschio: campi[11],
                            Citta: campi[12],
                            Matricola: campi[13],
                            NumeroMaglia: campi[14],
                            idCategoria: +campi[15],
                            idCategoria2: +campi[16],
                            Categoria2: campi[17],
                            idCategoria3: +campi[18],
                            Categoria3: campi[19],
                            Categoria1: campi[20],
                            Categorie: campi[21],
                            RapportoCompleto: campi[22],
                            idTaglia: campi[23],
                            Nominativo: campi[2] + ' ' + campi[3],
                            CertificatoMedico: campi[26] === 'S' ? true : false,
                            CertificatoScaduto: campi[27] === 'S' ? true : false,
                            ImmagineCert: (campi[26] === 'N' || (campi[26] === 'S' && campi[27] === 'S')) ?
                                this.variabiliGlobali.urlWS + 'MultiMedia/Icone/icona_ATTENZIONE.png' : '',
                        };
                        if (t.Maschio === 'S') {
                            t.Maschio = 'M';
                        }
                        d.push(t);
                        conta++;
                    }
                });
    
                this.gridDataGiocatori = d;
                this.gridDataGiocConv = undefined;
                this.gridDataGiocNonConv = undefined;
                this.columnsGioc1 = undefined;
                this.columnsGioc2 = undefined;
                if (this.inserimentoOModifica === 'INSERIMENTO') {
                    setTimeout(() => {
                        this.gridDataGiocConv = new Array();
                        this.gridDataGiocNonConv = new Array();
                        this.gridDataGiocatori.forEach(element => {
                            this.gridDataGiocConv.push(element);
                        });
                        this.columnsGioc1 = ['ImmagineCert', 'Immagine', 'Nominativo', 'Ruolo'];
                        this.columnsGioc2 = ['ImmagineCert', 'Immagine', 'Nominativo', 'Ruolo'];
                        console.log('Giocatori caricati:', this.gridDataGiocConv);

                        this.aggiornaRisposte();

                        this.gridDataGiocRisposte = JSON.parse(JSON.stringify(this.gridDataGiocConv));
                    }, 1000);
                } else {
                    setTimeout(() => {
                        console.log('Lista giocatori', this.gridDataGiocatori);
                        console.log('Convocati caricati partita', this.convocati);

                        this.caricamentoDatiInCorsoGioc2 = 'CARICAMENTO';
                        this.titoloGrigliaGioc3 = 'Risposte';
                        this.gridDataGiocConv = new Array();
                        this.gridDataGiocNonConv = new Array();
                        // this.columnsGioc2 = this.columnsGioc1;

                        this.convocati.forEach(element => {
                            this.gridDataGiocConv.push(element);
                        });
                        this.gridDataGiocatori.forEach(element => {
                            let ok = true;
                            this.gridDataGiocConv.forEach(element2 => {
                                if (ok === true) {
                                    if (element.idGiocatore === element2.idGiocatore) {
                                        ok = false;
                                    }
                                }
                            });
                            if (ok === true) {
                                this.gridDataGiocNonConv.push(element);
                            }
                        });

                        this.columnsGioc1 = ['ImmagineCert', 'Immagine', 'Nominativo', 'Ruolo'];
                        this.columnsGioc2 = ['ImmagineCert', 'Immagine', 'Nominativo', 'Ruolo'];

                        this.aggiornaRisposte();

                        console.log('Non convocati', this.gridDataGiocNonConv);
                        console.log('Convocati', this.gridDataGiocConv);
                    }, 1000);
                }
    
                // this.columnsGioc2 = this.columnsGioc1;
                // if (perEdit === false) {
                //     // console.log('Elimino convocati');
                //     this.gridDataGioc2 = undefined;
                // } else {
                  /* if (this.strutturaPerEdit.Convocati !== '') {
                    this.caricamentoDatiInCorsoGioc2 = 'CARICAMENTO';
                    setTimeout(() => {
                      this.gridDataGioc2 = new Array();
                      this.strutturaPerEdit.Convocati.forEach(element => {
                        this.gridDataGioc1.forEach(element2 => {
                          if (element.idGiocatore === element2.idGiocatore) {
                            this.gridDataGioc2.push(element2);
                            this.gridDataGioc1 = this.gridDataGioc1.filter( h => h.idGiocatore !== element.idGiocatore);
                          }
                        });
                      });
                      this.caricamentoDatiInCorsoGioc2 = 'OK';
                      // console.log(this.gridDataGioc2);
                    }, 1000); */
                    // this.caricaDettaglioPartita(true);
                    // }
                // }
                // console.log('Ricarico giocatori');
    
                this.caricamentoDatiInCorsoGioc1 = 'OK';
                // this.caricatiGiocatori = true;
                this.titoloGrigliaGioc1 = 'Giocatori caricati ' + conta;
              } else {
                // console.log(data2);
                if (data2.indexOf('Nessun giocatore') > -1) {
                    this.variabiliGlobali.mostraMessaggio('Nessun giocatore nella categoria selezionata', false);
                } else {
                    this.variabiliGlobali.mostraMessaggio(data2, false);
                }

                this.gridDataGiocatori = null;
                // this.caricatiGiocatori = true;
                this.caricamentoDatiInCorsoGioc1 = 'OK';
                this.titoloGrigliaGioc1 = 'Giocatori caricati 0';
                if (perEdit === false) {
                    /* this.gridDataGiocConv = null;
                    this.gridDataGiocNonConv = null;
                    this.columnsGioc2 = ['Immagine', 'Nominativo', 'Ruolo'];
                    this.columnsGioc1 = ['Immagine', 'Nominativo', 'Ruolo']; */
                }
              }
            } else {
              this.variabiliGlobali.mostraMessaggio('Ritorno nullo caricamento giocatori', false);

              this.caricamentoDatiInCorsoGioc1 = 'OK';
              // this.caricatiGiocatori = true;
              this.gridDataGiocatori = null;
              this.titoloGrigliaGioc1 = 'Giocatori caricati 0';
              if (perEdit === false) {
                this.gridDataGiocConv = null;
                this.gridDataGiocNonConv = null;
                this.columnsGioc2 = ['Immagine', 'Nominativo', 'Ruolo'];
                this.columnsGioc1 = ['Immagine', 'Nominativo', 'Ruolo'];
             }
            }
          }
        );
    }

    openDialogS(messaggio, inviaMail, perCreaConvocazione): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: messaggio // ' '§left',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.salvaDati2(inviaMail, perCreaConvocazione);
            } else {
            }
        });
    }

    salvaDati(inviaMail, perCreaConvocazione) {
        let giocatoriSenzaCertificato = '';
        this.gridDataGiocConv.forEach(element => {
            if (element.CertificatoMedico === false || (element.CertificatoMedico === true && element.CertificatoScaduto === true)) {
                console.log(element.CertificatoMedico, element.CertificatoScaduto, element);
                giocatoriSenzaCertificato += '<br />' + element.Nominativo;
            }
        });
        if (giocatoriSenzaCertificato !== '') {
            this.openDialogS('I seguenti giocatori sono senza certificato medico o con certificato scaduto:<br />' + 
                giocatoriSenzaCertificato + '<br /><br />Si vuole forzare il salvataggio ?', inviaMail, perCreaConvocazione);
        } else {
            this.salvaDati2(inviaMail, perCreaConvocazione);
        }
    }

    salvaDati2(inviaMail, perCreaConvocazione) {
        let convocati = '';
        let q = 0;
        if (this.gridDataGiocConv !== undefined && this.gridDataGiocConv !== '') {
          this.gridDataGiocConv.forEach(element => {
            q++;
            convocati += element.idGiocatore + ';§';
          });
        }
        this.strutturaPerEdit.Convocati = convocati;
        // console.log(this.strutturaPerEdit.Convocati);
    
        if (!this.strutturaPerEdit.idUnioneCalendatio || this.strutturaPerEdit.idUnioneCalendario === '') {
          this.strutturaPerEdit.idUnioneCalendario = -1;
        }
        if (!this.strutturaPerEdit.sTempo || this.strutturaPerEdit.sTempo === '') {
          this.strutturaPerEdit.sTempo = 'Da Impostare;0;0;0;';
        }
        if (!this.strutturaPerEdit.RisGiochetti || this.strutturaPerEdit.RisGiochetti === '') {
          this.strutturaPerEdit.RisGiochetti = '';
        }
        if (!this.strutturaPerEdit.RisAvv || this.strutturaPerEdit.RisAvv === '') {
          this.strutturaPerEdit.RisAvv = '0;0;0;';
        }
        if (!this.strutturaPerEdit.Risultato || this.strutturaPerEdit.Risultato === '') {
          this.strutturaPerEdit.Risultato = '0-0';
        }
        // if (!this.strutturaPerEdit.RisultatoATempi || this.strutturaPerEdit.RisultatoATempi === '') {
        //   this.strutturaPerEdit.RisultatoATempi = '0-0';
        // }
    
        while (this.strutturaPerEdit.EventiPrimoTempo.indexOf('%') > - 1) {
          this.strutturaPerEdit.EventiPrimoTempo = this.strutturaPerEdit.EventiPrimoTempo.replace('%', '§');
        }
        while (this.strutturaPerEdit.EventiSecondoTempo.indexOf('%') > - 1) {
          this.strutturaPerEdit.EventiSecondoTempo = this.strutturaPerEdit.EventiSecondoTempo.replace('%', '§');
        }
        while (this.strutturaPerEdit.EventiTerzoTempo.indexOf('%') > - 1) {
          this.strutturaPerEdit.EventiTerzoTempo = this.strutturaPerEdit.EventiTerzoTempo.replace('%', '§');
        }
        while (this.strutturaPerEdit.EventiPrimoTempo.indexOf('!') > - 1) {
          this.strutturaPerEdit.EventiPrimoTempo = this.strutturaPerEdit.EventiPrimoTempo.replace('!', ';');
        }
        while (this.strutturaPerEdit.EventiSecondoTempo.indexOf('!') > - 1) {
          this.strutturaPerEdit.EventiSecondoTempo = this.strutturaPerEdit.EventiSecondoTempo.replace('!', ';');
        }
        while (this.strutturaPerEdit.EventiTerzoTempo.indexOf('!') > - 1) {
          this.strutturaPerEdit.EventiTerzoTempo = this.strutturaPerEdit.EventiTerzoTempo.replace('!', ';');
        }
    
        while (this.strutturaPerEdit.TGA1.indexOf('#') > - 1) {
          this.strutturaPerEdit.TGA1 = this.strutturaPerEdit.TGA1.replace('#', '$');
        }
        while (this.strutturaPerEdit.TGA2.indexOf('#') > - 1) {
          this.strutturaPerEdit.TGA2 = this.strutturaPerEdit.TGA2.replace('#', '$');
        }
        while (this.strutturaPerEdit.TGA3.indexOf('#') > - 1) {
          this.strutturaPerEdit.TGA3 = this.strutturaPerEdit.TGA3.replace('#', '$');
        }
        this.strutturaPerEdit.DataOra = this.datepipe.transform(this.strutturaPerEdit.DataOra, 'yyyy-MM-dd') + ' ' + this.strutturaPerEdit.OraPartita;
        // console.log(this.strutturaPerEdit);
        
        // this.haSalvato = true;
        // return;
    
        if (this.strutturaPerEdit.DataAppuntamento || this.strutturaPerEdit.OraAppuntamento) {
            this.strutturaPerEdit.DataOraAppuntamento = this.datepipe.transform(this.strutturaPerEdit.DataAppuntamento, 'yyyy-MM-dd') + ' ' + this.strutturaPerEdit.OraAppuntamento;
        }

        // console.log(this.strutturaPerEdit);
        // return;

        this.apiService.salvaPartita(
          this.variabiliGlobali.CodAnnoSquadra,
          this.variabiliGlobali.Anno,
          this.strutturaPerEdit,
          inviaMail)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                this.haSalvato = true;
                if (inviaMail !== 'S') {
                    if (perCreaConvocazione === true) {
                        this.creaConvocazione2();
                    } else {
                        this.variabiliGlobali.mostraMessaggio('Partita salvata', false);
                    }
                } else {
                    this.variabiliGlobali.mostraMessaggio('Convocazione inviata', false);
                }
                this.pulisceSelezione = !this.pulisceSelezione;
                this.appoStrutturaDati = JSON.parse(JSON.stringify(this.strutturaPerEdit));
                // this.strutturaDati = undefined;
                // this.caricaPartite();
                // this.chiudiMascheraEdit(true);
              } else {
                this.variabiliGlobali.mostraMessaggio(data2, false);
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
              this.variabiliGlobali.mostraMessaggio(error, false);
            }
          }
        );
    }
    
    creaStrutturaPartita() {
        let dp = '';
        let op = '';
        if (this.dataPartita2) {
            dp = this.dataPartita2;
            op = this.dataPartita2.substring(this.dataPartita2.indexOf(' ') + 1, this.dataPartita2.length)
        }
        // console.log('ID Partita:', this.idPartita2);
        // if (this.idPartita2 > -1) {
        //     this.inserimentoOModifica = 'MODIFICA';
        //     this.titoloMascheraEdit = 'Modifica Partita';
            // this.caricaDatiPartita();
        //     this.caricaGiocatori(false);
        // } else {
        const risTempi =  localStorage.getItem(this.userName + '_categoria_rt_sel');
        this.strutturaPerEdit = {
            idCategoria: -1, // this.categoriaSelezionata,
            idAvversario: -1,
            idAllenatore: -1,
            DataOra: dp,
            OraPartita: '',
            Casa: 'S',
            idTipologia: -1,
            idCampo: -1,
            Risultato: '',
            Notelle: '',
            Marcatori: '',
            Convocati: '',
            RisGiochetti: '',
            RisAvv: '',
            Campo: '',
            Tempo1Tempo: '',
            Tempo2Tempo: '',
            Tempo3Tempo: '',
            Coordinate: '',
            sTempo: '',
            idUnioneCalendario: '',
            TGA1: '',
            TGA2: '',
            TGA3: '',
            Dirigenti: '',
            idArbitro: -1,
            RisultatoATempi: risTempi,
            RigoriPropri: '',
            RigoriAvv: '',
            EventiPrimoTempo: '',
            EventiSecondoTempo: '',
            EventiTerzoTempo: '',
            Giocata: 'N',
            idPartita: -1,
            DataOraAppuntamento: '',
            LuogoAppuntamento: '',
            MezzoTrasporto: 'A',
            DataAppuntamento: dp,
            OraAppuntamento: '',
            ShootOut: false,
            idNumeroTempi: 2,
            PartitaConRigori: false,
        };

        this.immagineAllenatore = '';
        this.immagineArbitro = '';
        this.immagineAvversario = '';

        this.Ricerca = '';

        this.caricaAvversari();

        setTimeout(() => {
            if (this.idPartita2 === -1) {
                this.inserimentoOModifica = 'INSERIMENTO';
                this.titoloMascheraEdit = 'Nuova Partita';
                this.comboDisabilitata = false;
                this.caricaNuovoNumeroPartita();
            } else {
                this.inserimentoOModifica = 'MODIFICA';
                this.titoloMascheraEdit = 'Modifica Partita';
                this.comboDisabilitata = true;
                this.caricaDettaglioPartita();
            }
        }, 1000);

        // this.caricatiGiocatori = false;

        // this.caricaAvversari();
        // this.caricaAllenatori();
        // this.caricaTipologie();
        // this.caricaGiocatori(true);
        // this.caricaArbitri();

        /* if (this.interval) {
            this.interval = null;
        }
        this.interval = setInterval(() => {
            if (this.caricatiGiocatori === true) {
                clearInterval(this.interval);
                
                if (this.idPartita2 > -1) {
                    this.caricaDettaglioPartita();
                } else {
                    /* this.gridDataGiocConv = JSON.parse(JSON.stringify(this.gridDataGiocatori));
                    this.gridDataGiocNonConv = null;
                    this.columnsGioc2 = ['Immagine', 'Nominativo', 'Ruolo'];
                    this.columnsGioc1 = ['Immagine', 'Nominativo', 'Ruolo'];

                    this.caricaAvversari();
                    this.caricaAllenatori();
                    this.caricaTipologie();
                    // this.caricaGiocatori(true);
                    this.caricaArbitri();
                }
            }
        }, 1000); */
        // }
    
        this.mascheraEditAperta = true;
        if (this.soloVisualizzazione === false) {
          this.solaLettura = false;
        }
    }
     
    updateFilter(e): void {
        // const val = e.target.value.toLowerCase();
        const cr = this.ricercaAvv.toLowerCase();

        // filter our data
        if (this.datiAvversari) {
            const temp = this.datiAvversari.filter((d) => {
                return d.Descrizione.toLowerCase().indexOf(cr) !== -1 || !e;
            });

            this.filteredAvversari = temp;
        } else {
            this.filteredAvversari = null;
        }
        // console.log(temp);
    }

    cambioData(e) {
        setTimeout(() => {
            if (this.sitoLocale === true) {
                this.dataCorretta = true;
            } else {
                const oraPartita = this.datepipe.transform('1970-01-01 ' + this.strutturaPerEdit.OraPartita, 'HH:mm');
                const ee = this.datepipe.transform(this.strutturaPerEdit.DataOra, 'yyyy-MM-dd') + ' ' + oraPartita;
                console.log(this.strutturaPerEdit.DataOra, this.strutturaPerEdit.OraPartita, oraPartita, ee);
                if (ee !== null && ee !== 'null') {
                    try {
                        const d = this.datepipe.transform(ee, 'yyyy-MM-dd HH:mm');
                        const o = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
                        const dataMessa = new Date(d).getTime();
                        const dataAttuale = new Date(o).getTime();
                        console.log(d, o, dataMessa, dataAttuale, dataMessa - dataAttuale);
                        if (dataAttuale > dataMessa) {
                            this.dataCorretta = false;
                        } else {
                            this.dataCorretta = true;
                        }            
                    } catch (e) {
                        this.dataCorretta = true;
                    }
                } else {
                    this.dataCorretta = false;
                }
            }
        }, 100);
    }

    openDialogC(messaggio): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: messaggio
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.chiudiMascheraEdit2();
            } else {
            }
        });
    }
    
    chiudiMascheraEdit(e) {
        let ok = false;
        if (this.inserimentoOModifica !== 'SHOW' && this.soloVisualizzazione === false) {
            if (JSON.stringify(this.appoStrutturaDati) !== JSON.stringify(this.strutturaPerEdit)) {
                this.openDialogC('Si vuole chiudere la maschera?\nEventuali dati immessi e non ancora salvati andranno persi');
            } else {
                ok = true;
            }
        } else {
            ok = true;
        }
        if (ok) {
            this.chiudiMascheraEdit2();
        }
    }
        
    chiudiMascheraEdit2() {
        // console.log('Chiudo maschera. Ha salvato', this.haSalvato);
        if (this.haSalvato === true) {
            let tipo = '';
            let casa = '';
            let avv = '';
            let cat = '';

            if (this.datiTipologie) {
              this.datiTipologie.forEach(element => {
                  if (element.idTipologia === this.strutturaPerEdit.idTipologia) {
                      tipo = element.Descrizione;
                  }
              });            
            }

            if (this.campiCasa) {
              this.campiCasa.forEach(element => {
                  if (element.idCasa === this.strutturaPerEdit.Casa) {
                      casa = element.Descrizione;
                  }
              });
            }

            if (this.filteredAvversari) {
              this.filteredAvversari.forEach(element => {
                  if (element.idAvversario === this.strutturaPerEdit.idAvversario) {
                      avv = element.Descrizione;
                  }
              });
            }
            
            if (this.datiCategorie) {
              this.datiCategorie.forEach(element => {
                  if (element.idCategoria === this.strutturaPerEdit.idCategoria) {
                      cat = element.Categoria;
                  }
              });
            }
            
            let notelle = '';
            if (this.strutturaPerEdit.Note) {
                notelle = this.strutturaPerEdit.Note;
                while (notelle.indexOf(';') > -1) {
                    notelle = notelle.replace(';', '^');
                }
            }
            // console.log(tipo, casa, avv);
            this.chiusuraMaschera.emit(tipo + ' ' + cat + ' ' + casa + ' contro ' + avv + ';' +
                this.strutturaPerEdit.DataOra + ';' + this.strutturaPerEdit.OraPartita + ';' +
                notelle + ';' + this.strutturaPerEdit.indirizzoCampoEsterno + ';' + this.strutturaPerEdit.idPartita);
        } else {
            this.chiusuraMaschera.emit('');
        }
        // return;

        this.mascheraEditAperta = false;
        this.pulisceSelezione = !this.pulisceSelezione;
        this.strutturaPerEdit = undefined;
        this.appoStrutturaDati = '';                        
    }

    selezioneTipologia(e) {
        if (e) {
          this.strutturaPerEdit.idTipologia = e;
        }
    }
        
    selezioneMezzoTrasporto(e) {
        if (e) {
          this.strutturaPerEdit.MezzoTrasporto = e;
        }
    }

    selezioneAllenatore(e) {
        if (e) {
          // console.log(e);
          setTimeout(() => {
            this.strutturaPerEdit.idAllenatore = e;
            this.immagineAllenatore = this.variabiliGlobali.urlWS + 'MultiMedia/' + this.variabiliGlobali.Squadra + '/Allenatori/' +
                this.variabiliGlobali.Anno + '_' + e + '.kgb'; // jpg?Data=' + new Date();
          }, 100);
        }
    }

    selezioneCasa(e) {
      if (e) {
        this.strutturaPerEdit.Casa = e;

        this.impostaLuogoAppuntamento();
      }
    }

    impostaLuogoAppuntamento() {
        const e = this.strutturaPerEdit.Casa;
        switch (e) {
            case 'S':
                if (this.strutturaPerEdit.CampoSquadra === undefined) {
                    this.strutturaPerEdit.CampoSquadra = '';
                }
                if (this.strutturaPerEdit.Indirizzo === undefined) {
                    this.strutturaPerEdit.Indirizzo = '';
                }
                this.strutturaPerEdit.LuogoAppuntamento = this.variabiliGlobali.Indirizzo;
                this.strutturaPerEdit.Coordinate = this.variabiliGlobali.Coordinate;

                this.strutturaPerEdit.idCampo = -2;
                this.strutturaPerEdit.Campo = '';
                // this.indirizzoCampoEsterno = '';
                this.campoEsternoAbilitato = false;
                break;
            case 'N':
                if (this.ultimoIndirizzoAvversario) {
                    this.strutturaPerEdit.LuogoAppuntamento = this.ultimoIndirizzoAvversario.Campo + ' ' + this.ultimoIndirizzoAvversario.Indirizzo;

                    this.strutturaPerEdit.idCampo = this.ultimoIndirizzoAvversario.idCampo;
                    this.strutturaPerEdit.Campo = this.ultimoIndirizzoAvversario.Campo;
                    // this.indirizzoCampoEsterno = this.ultimoIndirizzoAvversario.Campo;
                    this.campoEsternoAbilitato = false;
                    this.strutturaPerEdit.Coordinate = this.ultimoIndirizzoAvversario.Lat + ';' + this.ultimoIndirizzoAvversario.Lon;
                }
                break;
            case 'E':
                this.strutturaPerEdit.idCampo = -1;
                // this.strutturaPerEdit.Campo = this.indirizzoCampoEsterno;
                this.campoEsternoAbilitato = true;
                break;
        }
    }

    selezioneAvversario(ee) {
        if (ee) {
          // console.log(ee, this.filteredAvversari);
          let e;
          this.filteredAvversari.forEach(element => {
              if (+element.idAvversario === +ee) {
                e = element;
              }
          });
          if (!e) { this.ultimoIndirizzoAvversario = null; return; }
          // console.log(e);
    
          this.strutturaPerEdit.idAvversario = e.idAvversario;
          this.ultimoIndirizzoAvversario = e;

          this.immagineAvversario = this.variabiliGlobali.urlWS + 'Multimedia/' + this.variabiliGlobali.Squadra +
            '/Avversari/' + e.idAvversario + '.kgb'; // jpg?Data=' + new Date();

          // console.log(this.ultimoIndirizzoAvversario);
          this.impostaLuogoAppuntamento();
        }
    }

    selezioneArbitro(e) {
        if (e) {
          // console.log(e);
          this.strutturaPerEdit.idArbitro = e;
          this.immagineArbitro = this.variabiliGlobali.urlWS + 'Multimedia/' + this.variabiliGlobali.Squadra + '/Arbitri/' +
              e + '.kgb'; // jpg?Data=' + new Date();
        }
    }

    selezioneRisTempo(e) {
        if (e) {
          // console.log('Categoria selezionata:', e.idCategoria);
          this.strutturaPerEdit.RisultatoATempi = e;
        }
    }

    creaConvocazione() {
        this.salvaDati('N', true);
    }

    creaConvocazione2() {        
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
          idPartita: this.strutturaPerEdit.idPartita
        };
        this.apiService.creaConvocazionePartita(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                this.indirizzoConvocazione = this.variabiliGlobali.urlWS + data2;
                // console.log(this.indirizzoConvocazione);
                const esiste = this.variabiliGlobali.esisteUrl(this.indirizzoConvocazione);
                if (esiste === false) {
                  this.indirizzoConvocazione = '';
                }
              } else {
                this.variabiliGlobali.mostraMessaggio(data2, false);
              }
            }
          }
        );
    }
    
    stampaConvocazione() {
        const params = {
            Squadra: this.variabiliGlobali.CodAnnoSquadra,
            idAnno: this.variabiliGlobali.Anno,
            idPartita: this.strutturaPerEdit.idPartita
        };
        this.apiService.stampaConvocazionePartita(params)
        .map(response => response.text())
          .subscribe(
            data => {
              if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    const path = this.variabiliGlobali.urlWS + 'Allegati/' + this.variabiliGlobali.CodAnnoSquadra + '/Convocazioni/' +
                        'Anno' + this.variabiliGlobali.Anno + '/Partite/Partita_' + params.idPartita + '.pdf';
                    // window.open(path, '_blank');
                    this.variabiliGlobali.stampaDocumento(path);
                } else {
                    this.variabiliGlobali.mostraMessaggio(data2, false);
                }
              }
            }
        );
    }
    
    inviaConvocazione() {
        const params = {
            Squadra: this.variabiliGlobali.CodAnnoSquadra,
            idAnno: this.variabiliGlobali.Anno,
            idPartita: this.strutturaPerEdit.idPartita
        };
        this.apiService.inviaConvocazionePartita(params)
        .map(response => response.text())
          .subscribe(
            data => {
              if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    this.variabiliGlobali.mostraMessaggio('Convocazione inviata', false);
                } else {
                    this.variabiliGlobali.mostraMessaggio(data2, false);
                }
              }
            }
        );
    }

    aggiornaRisposte() {
        this.gridDataGiocRisposte = null;
        // this.gridDataGiocRisposte.sort((a, b) => a.Nominativo > b.Nominativo);
        setTimeout(() => {
            this.gridDataGiocRisposte = JSON.parse(JSON.stringify(this.gridDataGiocConv));
            this.columnsGioc3 = ['Immagine', 'Nominativo', 'RispostaConvocazione'];
            this.gridDataGiocRisposte.forEach(element => {
                if (!element.RispostaConvocazione || element.RispostaConvocazione === '') {
                    element.RispostaConvocazione = 'Non Confermato';
                }
            });
            // console.log(this.gridDataGiocRisposte);
        }, 1000);
    }

    caricaDettaglioPartita() {
        // if (!this.strutturaPerEdit) {
        //   this.variabiliGlobali.mostraMessaggio('Prima selezionare una partita');
        //   return;
        // }
    
        // console.log('Carico partita', this.idPartita2);
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
        };
        this.apiService.ritornaPartita(params.Squadra, params.idAnno, this.idPartita2)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    // console.log(data2);
                    const campi2 = data2.split('|');
    
                    // CONTROLLO PER MARCATORI
                    const marc = campi2[1];
                    const marc2 = marc.split('§');
                    this.marcatori = new Array();
                    marc2.forEach(element => {
                        if (element !== '') {
                            const mm = element.split(';');
                            const m = {
                                Tempo: mm[0],
                                Progressivo: mm[1],
                                idGiocatore: mm[2],
                                Minuto: mm[3],
                                Cognome: mm[4],
                                Nome: mm[5],
                                Ruolo: mm[6],
                                NumeroMaglia: mm[7],
                            };
                            if (+m.NumeroMaglia === 999) {
                                m.NumeroMaglia = '';
                            }
                            this.marcatori.push(m);
                        }
                    });
                    // console.log('Marcatori:' , this.marcatori);
        
                    // CONTROLLO PER CONVOCATI
                    // console.log(campi2);
                    // console.log('Convocati', this.inserimentoOModifica);
                    const conv = campi2[2];
                    const conv2 = conv.split('§');
                    this.convocati = new Array();
                    conv2.forEach(element => {
                        if (element !== '') {
                            const mm = element.split(';');
                            const m = {
                                idProgressivo: mm[0],
                                idGiocatore: mm[1],
                                Cognome: mm[2],
                                Nome: mm[3],
                                Ruolo: mm[4],
                                idRuolo: mm[5],
                                NumeroMaglia: mm[6],
                                Nominativo: mm[2] + ' ' + mm[3],
                                RispostaConvocazione: mm[7] === 'S' ? 'Confermato' : 'Non Confermato',
                                Immagine: this.variabiliGlobali.urlWS + 'Multimedia/' +
                                    this.variabiliGlobali.Squadra + '/Giocatori/' + this.variabiliGlobali.Anno + '_' +
                                    mm[1] + '.kgb', // jpg?Data=' + new Date()
                            };
                            this.convocati.push(m);
                        }
                    });

                    this.caricamentoDatiInCorsoGioc2 = 'OK';
                    // this.gridDataGiocRisposte = JSON.parse(JSON.stringify(this.convocati));
                    // this.columnsGioc3 = ['Immagine', 'Nominativo', 'RispostaConvocazione'];

                    const inFormazione = campi2[3];
                    const inFormazione2 = inFormazione.split('§');
                    const inFormazione3 = new Array();
                    inFormazione2.forEach(element => {
                        if (element !== '') {
                            const mm = element.split(';');
                            const m = {
                                idProgressivo: mm[0],
                                idGiocatore: mm[1],
                                Cognome: mm[2],
                                Nome: mm[3],
                                Ruolo: mm[4],
                                idRuolo: mm[5],
                                NumeroMaglia: mm[6],
                                Nominativo: mm[2] + ' ' + mm[3],
                                Immagine: this.variabiliGlobali.urlWS + 'Multimedia/' +
                                    this.variabiliGlobali.Squadra + '/Giocatori/' + this.variabiliGlobali.Anno + '_' +
                                    mm[1] + '.kgb', // jpg?Data=' + new Date()
                            };
                            inFormazione3.push(m);
                        }
                    });
        
                    this.campiUlteriori = campi2[0].split(';');
                    // console.log(this.campiUlteriori);
        
                    this.indirizzoConvocazione = this.variabiliGlobali.urlWS + '/Allegati/' + this.variabiliGlobali.CodAnnoSquadra + '/' +
                        'Convocazioni/Anno' + this.variabiliGlobali.Anno + '/Partite/Partita_' + this.idPartita2 + '.html';
                    const esiste1 = this.variabiliGlobali.esisteUrl(this.indirizzoConvocazione);
                    if (esiste1 === false) {
                        this.indirizzoConvocazione = '';
                    }
        
                    this.indirizzoSchedaPartita = this.variabiliGlobali.urlWS + 'Partite/' +
                    this.variabiliGlobali.Squadra + '/' + this.variabiliGlobali.Anno + '_' +
                    this.idPartita2 + '.html';
                    const esiste2 = this.variabiliGlobali.esisteUrl(this.indirizzoSchedaPartita);
                    if (esiste2 === false) {
                        this.indirizzoSchedaPartita = '';
                    }
        
                    // console.log(this.campiUlteriori);

                    let datella = this.campiUlteriori[5];
                    if (datella !== '') {
                        const ora = datella.substring(datella.indexOf(' ') + 1, datella.length);
                        datella = datella.replace(' ' + ora, '');
                        const d = datella.split('/');
                        datella = d[2] + '-' + d[1] + '-' + d[0] + ' ' + ora.replace(':00', '');
                        // console.log(datella);
                    }

                    let da = null;
                    if (this.campiUlteriori[44]) {
                        da = this.campiUlteriori[44].split(' ');
                    } else {
                        da = new Array();
                        da.push('');
                        da.push('');
                    }

                    let inf = '';
                    inFormazione3.forEach(element => {
                        inf += element.idGiocatore + ';';
                    });
                    
                    this.strutturaPerEdit = {
                        idPartita: this.idPartita2,
                        idCategoria: +this.campiUlteriori[0],
                        Categoria: this.campiUlteriori[16],
                        idAvversario: this.campiUlteriori[1],
                        Avversario: this.campiUlteriori[13],
                        idAllenatore: this.campiUlteriori[20],
                        DataOra: datella,
                        OraPartita: datella.substring(datella.indexOf(' ') + 1, datella.length), // this.campiUlteriori[5], //  'HH:mm:ss'),
                        Casa: this.campiUlteriori[19],
                        idTipologia: this.campiUlteriori[2],
                        idCampo: this.campiUlteriori[3],
                        Risultato: this.campiUlteriori[43],
                        Notelle: this.campiUlteriori[8],
                        Convocati: this.convocati,
                        RisGiochetti: this.campiUlteriori[9],
                        RisAvv1: +this.campiUlteriori[10],
                        RisAvv2: +this.campiUlteriori[11],
                        RisAvv3: +this.campiUlteriori[12],
                        RisAvv: this.campiUlteriori[10] + ';' + this.campiUlteriori[11] + ';' + this.campiUlteriori[12],
                        Campo: this.campiUlteriori[14],
                        Tempo1Tempo: this.campiUlteriori[22],
                        Tempo2Tempo: this.campiUlteriori[23],
                        Tempo3Tempo: this.campiUlteriori[24],
                        Coordinate: this.campiUlteriori[25] + ';' + this.campiUlteriori[26],
                        sTempo: this.campiUlteriori[27] + ';' + this.campiUlteriori[28] + ';' +
                            this.campiUlteriori[29] + ';' + this.campiUlteriori[30] + ';' + this.campiUlteriori[31] + ';',
                        TempoMeteo: this.campiUlteriori[27],
                        Gradi: this.campiUlteriori[28],
                        Umidita: this.campiUlteriori[29],
                        Pressione: this.campiUlteriori[30],
                        IconaTempo: this.campiUlteriori[31],
                        idUnioneCalendario: this.campiUlteriori[4],
                        TGA1: this.campiUlteriori[32],
                        TGA2: this.campiUlteriori[33],
                        TGA3: this.campiUlteriori[34],
                        Dirigenti: this.campiUlteriori[35],
                        idArbitro: this.campiUlteriori[36],
                        RisultatoATempi: this.campiUlteriori[37],
                        RigoriPropri: this.campiUlteriori[38],
                        RigoriAvv: this.campiUlteriori[39],
                        EventiPrimoTempo: this.campiUlteriori[40],
                        EventiSecondoTempo: this.campiUlteriori[41],
                        EventiTerzoTempo: this.campiUlteriori[42],
                        Giocata: this.campiUlteriori[6],
                        DataOraAppuntamento: this.campiUlteriori[44],
                        LuogoAppuntamento: this.campiUlteriori[45],
                        MezzoTrasporto: this.campiUlteriori[46],
                        DataAppuntamento: da[0],
                        OraAppuntamento: da[1],
                        InFormazione: inf,
                        AnticipoConvocazione: this.campiUlteriori[47],
                        Indirizzo: this.campiUlteriori[48],
                        Lat: this.campiUlteriori[49],
                        Lon: this.campiUlteriori[50],
                        CampoSquadra: this.campiUlteriori[51],
                        NomePolisportiva: this.campiUlteriori[52],
                        ShootOut: this.campiUlteriori[53] === 'S' ? true : false,
                        idNumeroTempi: this.campiUlteriori[54],
                        PartitaConRigori: this.campiUlteriori[55] === 'S' ? true : false,
                    };
                    console.log(this.strutturaPerEdit);
                    // this.selezioneCategoriaPerEdit(this.strutturaPerEdit.idCategoria);

                    /* this.indirizzoCampoEsterno = '';
                    if (this.strutturaPerEdit.Casa === 'E') {
                        this.indirizzoCampoEsterno = this.campiUlteriori[14];
                    } */

                    if (this.strutturaPerEdit.idArbitro !== '') {
                    const arbitro = this.strutturaPerEdit.idArbitro.split('-');
                    this.strutturaPerEdit.idArbitro = arbitro[0];
                    this.immagineArbitro = this.variabiliGlobali.urlWS + 'Multimedia/' +
                        this.variabiliGlobali.Squadra + '/Arbitri/' + this.strutturaPerEdit.idArbitro + '.kgb'; // jpg?Data=' + new Date();
                    } else {
                        this.immagineArbitro = '';
                    }

                    if (this.strutturaPerEdit.idAvversario !== '') {
                    this.immagineAvversario = this.variabiliGlobali.urlWS + 'Multimedia/' +
                        this.variabiliGlobali.Squadra + '/Avversari/' + this.strutturaPerEdit.idAvversario + '.kgb'; // jpg?Data=' + new Date();
                    } else {
                        this.immagineAvversario = '';
                    }

                    if (this.marcatori !== '') {
                        // console.log(this.marcatori);
                        let marc3 = '';
                        this.marcatori.forEach(element => {
                            marc3 += element.Tempo + ';' +
                            element.idGiocatore + ';' +
                            element.Cognome + ' ' + element.Nome + ';' +
                            ';;' +
                            element.Minuto + ';§';
                        });
                        this.strutturaPerEdit.Marcatori = marc3;
                    }
                    // console.log(this.strutturaPerEdit);

                    setTimeout(() => {
                        this.cambioData(null);
                    }, 1000);

                    this.caricaAllenatori();
                    this.caricaTipologie();
                    // this.caricaGiocatori(true);
                    this.caricaArbitri();

                    this.impostaLuogoAppuntamento();

                    this.mascheraEditAperta = true;
                    if (this.soloVisualizzazione === false) {
                      this.solaLettura = false;
                    }
                } else {
                    // console.log(data2);
                }
            }
        },
        (error) => {
            if (error instanceof Error) {
            }
        });
    }

    calcolaOraAppuntamento() {
        if (!this.strutturaPerEdit.AnticipoConvocazione || this.strutturaPerEdit.AnticipoConvocazione === '') {
            // console.log('Non posso calcolare l\'ora di appuntamento. Non c\'è l\'anticipo');
            return;
        }
        if (!this.strutturaPerEdit.OraPartita || this.strutturaPerEdit.OraPartita === '') {
            return;
        }
        // if (this.strutturaPerEdit.OraAppuntamento || this.strutturaPerEdit.OraAppuntamento !== '') {
        //     return;
        // }
        const op = new Date('1972-02-26 ' + this.strutturaPerEdit.OraPartita).getTime();
        const anticipo = this.strutturaPerEdit.AnticipoConvocazione.toString();
        let minuti = 0;
        if (anticipo.indexOf('.') > -1) {
            const a = anticipo.split('.');
            const mm = +(a[1] / 100);
            minuti = (a[0] * (60 * 60 * 1000)) + (mm * (60 * 60 * 1000));
            // console.log('1:', a[0], (a[0] * (60 * 60 * 1000)), mm, (mm * (60 * 60 * 1000)));
        } else {
            if (anticipo.indexOf(',') > -1) {
                const a = anticipo.split(',');
                const mm = +(a[1] / 100);
                minuti = (a[0] * (60 * 60 * 1000)) + (mm * (60 * 60 * 1000));
                // console.log('2:', a[0], mm, minuti);
            } else {
                minuti = (+anticipo / 60) * (60 * 60 * 1000);
                // console.log('3:', minuti);
            }                
        }
        const oa = op - minuti;
        // console.log('Inizio', op);
        // console.log('Differenza', oa, oa - op);
        const fs = this.datepipe.transform(oa, 'HH:mm');
        this.strutturaPerEdit.OraAppuntamento = fs;
        // console.log('1972-02-26 ' + this.strutturaPerEdit.OraPartita, op, anticipo, minuti, oa, fs);
    }

    caricaMultimediaPerPartita() {
        const params = {
          Squadra: this.variabiliGlobali.CodAnnoSquadra,
          idAnno: this.variabiliGlobali.Anno,
          idPartita: this.strutturaPerEdit.idPartita,
          Tipologia: 'Partite'
        };
        this.apiService.ritornaMultimediaPartita(params)
        .map(response => response.text())
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              if (data2.indexOf('ERROR') === -1) {
                const mm = data2.split('§');
                this.multimedia = new Array();
                mm.forEach(element => {
                  const m1 = element.split(';');
                  const m2 = {
                    urlImmagine: m1[0],
                    nomeFile: m1[1],
                    dimeFile: m1[2],
                    dataFile: m1[3],
                    codice: m1[4]
                  };
                  this.multimedia.push(m2);
                });
                // console.log(this.multimedia);
                this.qualeMultimedia = 0;
                this.scriveNomeImmagine();
              } else {
                // this.variabiliGlobali.mostraMessaggio(data2);
              }
            }
          }
        );
    }

    scriveNomeImmagine() {
        this.nomeMultimedia = 'Multimedia ' +
          (this.qualeMultimedia + 1) + '/' + (this.multimedia.length) + ': ' +
          this.multimedia[this.qualeMultimedia].nomeFile + ' Kb.: ' +
          (this.multimedia[this.qualeMultimedia].dimeFile / 1024) + ' ' +
          this.multimedia[this.qualeMultimedia].dataFile;
        this.nomeUrlImmagine = this.variabiliGlobali.urlWS  + 'MultiMedia/' +
          this.variabiliGlobali.Squadra + '/Partite/' + this.strutturaPerEdit.idPartita +
          '/' + this.multimedia[this.qualeMultimedia].nomeFile + '?Data=' + new Date();
        // console.log(this.nomeUrlImmagine);
    }

    selezioneRisTempiCat(e) {
        if (e) {
            // console.log(e);
            this.strutturaPerEdit.RisultatoATempi = e.replace('"', '').replace('"', '');
        }
    }

    cambioStatoShootOut(e) {
        this.strutturaPerEdit.ShootOut = e.checked;
    }

    selezioneTempi(e) {
        if (e) {
            // console.log(e);
            this.strutturaPerEdit.idNumeroTempi = +e;
        }
    }

    cambioStatoPcR(e) {
        this.strutturaPerEdit.PartitaConRigori = e.checked;
    }
}
