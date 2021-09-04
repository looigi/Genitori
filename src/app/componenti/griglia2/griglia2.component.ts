import { OnInit, ViewEncapsulation, Component, ElementRef, ViewChild, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { VariabiliGlobali } from 'app/global.component';
import { fuseAnimations } from '@fuse/animations';
import { ColumnMode, SelectionType, SortType, DatatableComponent } from '@swimlane/ngx-datatable';
import { single } from 'rxjs/operators';
import { ApiService } from 'app/services/api.service';

@Component({
    selector   : 'griglia2',
    templateUrl: './griglia2.component.html',
    styleUrls  : ['./griglia2.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class Griglia2Component implements OnInit, OnChanges, AfterViewChecked
{
    @Input() dati;
    @Input() displayedColumns;
    @Input() userName;
    @Input() titoloGriglia;
    @Input() tastoShow;
    @Input() tastoFilter;
    @Input() tastoOffline = false;
    @Input() tastoGestPartita = false;
    @Input() tastoStampaRicevuta = false;
    @Input() tastoStampaScontrino = false;
    @Input() tastoMail = false;
    @Input() tastoNew;
    @Input() tastoDelete;
    @Input() tastoEdit;
    @Input() tastoRefresh;
    @Input() selezioneMultipla;
    @Input() impostaSelezione;
    @Input() pageSize;
    @Input() campoRicerca;
    @Input() nomeMaschera;
    @Input() icona;
    @Input() mostraHeader = true;
    @Input() nomiColonne;
    @Input() caricamentoInCorso = 'OK';
    @Input() tipiCampi;
    @Input() larghezzaColonne = ColumnMode.force;
  
    @Output() cellClick: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoNewEmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoDeleteEmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoEditEmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoShowEmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoRefreshEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() tastoOfflineEmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() ritornoSelezione: EventEmitter<any> = new EventEmitter<any>();
    @Output() clickSuPallocco: EventEmitter<any> = new EventEmitter<any>();
    @Output() tastoGestiscePartita: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoStampaRicevutaEmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoEmailRicevutaEmit: EventEmitter<string> = new EventEmitter<string>();
    @Output() tastoStampaScontrinoEmit: EventEmitter<string> = new EventEmitter<string>();
  
    @ViewChild(DatatableComponent) table: DatatableComponent;
    
    dataSource;
    cols;

    rows = [];
    loadingIndicator = true;
    reorderable = true;
    columns;
    columns2;
    selected = [];
    appoggioSel;
    SelectionType = SelectionType;
    selType;
    refresh = false;
    SortType = SortType;
    filtroVisibile = false;
    temp;
    contextMenu = false;
    contextMenuX;
    contextMenuY;
    rigaPremutoMenu;
    puoChiudere = false;
    checks;
    ricerca;
    caricamentoInCorso2 = 'OK';
    paginaImpostata = -1;

    immagineConvertita: string;
    numeroRighe = -1;
    pageSize2;
    nomeMaschera2;
     // columnsSort;
     datiRighe = [ { Descrizione: 5 }, { Descrizione: 7 }, { Descrizione: 10 }, { Descrizione: 25 }, { Descrizione: 50 } ];
    
    // columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company', sortable: false }];
  
    ColumnMode = ColumnMode;
  
    constructor(
        private elRef: ElementRef,
        private variabiliGlobali: VariabiliGlobali,
        private cdRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        // this.caricaCategorie();
        // this.selectionType = this.SelectionTypeSingle;
        // console.log('Ricerca:', this.ricerca);
    }

    caricaDati(): void {
        if (this.dataSource && this.columns) {
            this.rows = this.dataSource;
            // console.log('Righe-Colonne', this.rows, this.columns);
            this.checks.forEach(element => {
                element = false;
            });
            if (this.appoggioSel || this.appoggioSel === '') {
                // console.log(this.appoggioSel, typeof(this.appoggioSel));
                if (typeof(this.appoggioSel) === 'object') {
                    this.appoggioSel = JSON.stringify(this.appoggioSel);
                }
                this.selected = new Array();
                if (this.appoggioSel.indexOf(',') > - 1) {
                    const a = this.appoggioSel.split(',');
                    a.forEach(element => {
                        this.rows.forEach(element2 => {
                            if (+element2.idRiga === +element) {
                                this.selected.push(element2);
                                this.checks[element2.idRiga] = true;
                            }
                        });
                    });
                } else {
                    // console.log(this.appoggioSel);
                    if (this.appoggioSel === '') {
                        this.rows.forEach(element2 => {
                            this.checks[element2.idRiga] = false;
                        });
                    } else {
                        this.rows.forEach(element2 => {
                            if (+element2.idRiga === +this.appoggioSel) {
                                this.selected.push(element2);
                                this.checks[element2.idRiga] = true;
                            }
                        });
                    }
                }
                // console.log('Righe selezionate nella griglia', this.selected);
            } else {
                this.selected = new Array();
                // console.log('Selezione pulita nella griglia', this.selected);
            }
            setTimeout(() => {
                // this.selected = [this.rows[2]];
                this.loadingIndicator = false;
            }, 1000);
        }

        if (this.ricerca && this.ricerca !== '') {
            // console.log('Ricerca:', this.ricerca);
            this.updateFilter(this.ricerca);
            // this.ricerca = '';
        }
    }

    cambioNumeroRighe(e) {
        this.pageSize2 = e;
        this.numeroRighe = e;
        if (this.variabiliGlobali.Utente && this.nomeMaschera2) {
            let nm = this.nomeMaschera2;
            while (nm.indexOf(' ') > -1) {
                nm = nm.replace(' ', '_');
            }
            localStorage.setItem('Griglia_' + this.variabiliGlobali.Utente + '_' + nm + '_Righe', e);
            this.caricaDati();
        }
    }

    ngOnChanges(c): void {
        if (c.nomeMaschera) {
            if (c.nomeMaschera.currentValue) {
                this.nomeMaschera2 = c.nomeMaschera.currentValue;
                let nm = this.nomeMaschera2;
                while (nm.indexOf(' ') > -1) {
                    nm = nm.replace(' ', '_');
                }
                const righe = localStorage.getItem('Griglia_' + this.variabiliGlobali.Utente + '_' + nm + '_Righe');
                if (righe !== null) {
                    this.pageSize2 = +righe;
                    this.numeroRighe = +righe;
                } else {
                    this.numeroRighe = this.pageSize2;
                }
                // console.log('UserName:', this.variabiliGlobali.Utente, c.nomeMaschera.currentValue, this.numeroRighe, this.pageSize2);
            }
        }
        
        if (c.pageSize) {
            if (this.nomeMaschera2 && this.nomeMaschera2 !== '') {
                let nm = this.nomeMaschera2;
                while (nm.indexOf(' ') > -1) {
                    nm = nm.replace(' ', '_');
                }
                const righe = localStorage.getItem('Griglia_' + this.variabiliGlobali.Utente + '_' + nm + '_Righe');
                if (righe !== null) {
                    this.pageSize2 = +righe;
                    // console.log('Cambio page size da cookie:', this.variabiliGlobali.Utente, this.nomeMaschera, this.pageSize2, this.numeroRighe);
                    this.caricaDati();
                } else {
                    this.pageSize2 = +c.pageSize.currentValue;
                    // console.log('Cambio page size passato:', this.variabiliGlobali.Utente, this.nomeMaschera, this.pageSize2, this.numeroRighe);
                }
                this.numeroRighe = +this.pageSize2;
            } else {
                this.numeroRighe = c.pageSize.currentValue;
                this.pageSize2 = c.pageSize.currentValue;
                // console.log('Cambio page size originale:', this.variabiliGlobali.Utente, this.nomeMaschera, this.pageSize2, this.numeroRighe);
            }

            if (this.numeroRighe > -1) {
                let ok = false;
                this.datiRighe.forEach(element => {
                    if (+element.Descrizione === +this.numeroRighe) {
                        ok = true;
                    }
                });
                if (ok === false) {
                    this.datiRighe.push({ Descrizione: this.numeroRighe });
                }
            }
        }

        if (c.caricamentoInCorso) {
            this.caricamentoInCorso2 = c.caricamentoInCorso.currentValue;
        }

        if (c.impostaSelezione && (c.impostaSelezione.currentValue || c.impostaSelezione.currentValue === '')) {
            // VUOLE UN ARRAY OPPURE UN idRiga
            this.appoggioSel = c.impostaSelezione.currentValue.toString();
            // console.log('Selezione:', this.appoggioSel, typeof(this.appoggioSel));
            this.caricaDati();
        }

        if (c.selezioneMultipla) {
            if (c.selezioneMultipla.currentValue === true) {
                this.selType = SelectionType.multiClick;
                // console.log('Multi selezione');
            } else {
                this.selType = SelectionType.single;
                // console.log('Selezione singola');
            }
        }

        if (c.displayedColumns && c.displayedColumns.currentValue) {
            /* const ccc = new Array();
            c.displayedColumns.currentValue.forEach(element => {
                let cc;
                cc = { prop: element, name: element };
                ccc.push(element);
            });
            this.columns2 = JSON.parse(JSON.stringify(ccc)); */
            if (!this.tipiCampi) {
                this.tipiCampi = new Array();
                c.displayedColumns.currentValue.forEach(element => {
                    this.tipiCampi.push('*');
                });
                // console.log(this.tipiCampi);
            }

            this.columns = JSON.parse(JSON.stringify(c.displayedColumns.currentValue));
            if (!this.nomiColonne) {
                this.nomiColonne = JSON.parse(JSON.stringify(this.columns));
            }
            this.caricaDati();
        }

        if (c.dati && c.dati.currentValue && c.dati.currentValue != null) {
            // console.log('Nuovi dati alla griglia:', c.dati.currentValue);
            let cc = JSON.stringify(c.dati.currentValue[0]);
            const nomiImmagini = new Array();
            if (cc) {
                cc = cc.replace('{', '');
                cc = cc.replace('}', '');
                const ccc = cc.split(',');
                ccc.forEach(element => {
                const cccc = element.split(':');
                const ccccc = cccc[0].replace('"', '').replace('"', '');
                if (ccccc.toUpperCase().indexOf('IMMAGINE') > -1) {
                    nomiImmagini.push(ccccc);
                }
                });
            }
            // console.log(nomiImmagini);

            this.dataSource = c.dati.currentValue;
            this.temp = [...this.dataSource];
            this.checks = new Array();
            this.dataSource.forEach(element => {
                this.checks.push(false);
                /* nomiImmagini.forEach(element2 => {
                    if (element[element2].indexOf('?a=') === -1) {
                        element[element2] += '?a=' + new Date();
                    } else {
                        element[element2] = element[element2].substring(0, element[element2].indexOf('?a='));
                        element[element2] += '?a=' + new Date();
                    }
                }); */
            });
            this.caricaDati();
        } else {
            if (c.dati && (c.dati.currentValue === undefined || c.dati.currentValue === null))  {
                // console.log(c.dati);
                this.rows = undefined;
            }
        }
    }

    ngAfterViewChecked(): void {

    }

    onSelect({ selected }): void {
        if (this.selezioneMultipla === false) {
            // console.log('Select Event', selected[0]);
            this.cellClick.emit(selected[0]);
        } else {
            // console.log('Select Event', selected);
            /* const r = new Array();
            this.selected.forEach(element => {
                let q = 1;
                this.rows.forEach(element2 => {
                    if (element2 === element) {
                        r.push(element.idRiga);
                    }
                    q++;
                });
            }); */

            const messi = new Array();
            const sel = new Array();
            selected.forEach(element => {
                let ok = true;
                messi.forEach(element2 => {
                    if (+element.idRiga === +element2) {
                        ok = false;
                    }
                });
                if (ok) {
                    messi.push(+element.idRiga);
                    sel.push(element);
                }
            });
            this.selected = sel;
    
            this.ritornoSelezione.emit(this.selected);
        }
        // this.selected = JSON.parse(JSON.stringify(selected));
        // console.log(this.checks);
    }

    selezionaTutto(e) {
        if (e.checked === true) {
            this.selected = JSON.parse(JSON.stringify(this.dataSource));
            const c = new Array();
            for (let i = 0; i <= this.checks.length; i++) {
                c.push(true);
            }
            this.checks = JSON.parse(JSON.stringify(c));
        } else {
            this.selected = new Array();
            const c = new Array();
            for (let i = 0; i <= this.checks.length; i++) {
                c.push(false);
            }
            this.checks = JSON.parse(JSON.stringify(c));
        }
        // console.log(this.selected);
    }

    selezioneRiga(e, r): void {
        // console.log(r);

        if (e.checked === true) {
            if (this.selezioneMultipla === true) {
                this.selected.push(r);
                this.checks[r.idRiga] = true;

                const messi = new Array();
                const sel = new Array();
                this.selected.forEach(element => {
                    let ok = true;
                    messi.forEach(element2 => {
                        if (+element.idRiga === +element2) {
                            ok = false;
                        }
                    });
                    if (ok) {
                        messi.push(+element.idRiga);
                        sel.push(element);
                    }
                });
                this.selected = sel;
            
                // console.log(this.selected);
                this.ritornoSelezione.emit(this.selected);
            } else {
                this.selected = new Array();
                this.selected.push(r);
                const c = new Array();
                for (let i = 0; i <= this.checks.length; i++) {
                    c.push(false);
                }
                this.checks = JSON.parse(JSON.stringify(c));
                this.checks[r.idRiga] = true;
                // console.log(this.selected);
                this.cellClick.emit(this.selected[0]);
            }
        } else {
            if (this.selezioneMultipla === true) {
                this.checks[r.idRiga] = false;
                this.selected = this.selected.filter(item => item !== r);
                // console.log(this.selected);
                this.ritornoSelezione.emit(this.selected);
            } else {
                const c = new Array();
                for (let i = 0; i <= this.checks.length; i++) {
                    c.push(false);
                }
                this.checks = c;
                this.cellClick.emit(null);
            }
        }
    }
    
    onActivate(event): void {
        // this.contextMenuX = event.event.pageX;
        // this.contextMenuY = event.event.pageY;
        // console.log('Activate Event', event, this.contextMenuX, this.contextMenuY);
        if (!this.selezioneMultipla && event.type === 'click') {
            // console.log(event.row);
            this.cellClick.emit(event.row);
        }
    }    

    checkImage(e): void {
        // console.log(e);
        e.srcElement.src = this.variabiliGlobali.urlWS + 'MultiMedia/Sconosciuto.png?a=' + new Date().toString();
        this.cdRef.detectChanges();
    }

    premutoNew(): void {
        const d = new Date();
        this.tastoNewEmit.emit(d.toString());
      }
    
    premutoDelete(e): void {
        const d = new Date();
        this.cellClick.emit(e);
        this.tastoDeleteEmit.emit(d.toString());
        this.chiudePopup();
    }
    
    premutoEdit(e): void {
        const d = new Date();
        this.cellClick.emit(e);
        this.tastoEditEmit.emit(d.toString());
        this.chiudePopup();
    }
    
    premutoShow(e): void {
        const d = new Date();
        this.cellClick.emit(e);
        this.tastoShowEmit.emit(d.toString());
        this.chiudePopup();
    }

    premutoRefresh(): void {
        this.refresh = !this.refresh;
        this.tastoRefreshEmit.emit(this.refresh);
    }

    premutoFilter(): void {
        this.filtroVisibile = !this.filtroVisibile;
    }

    updateFilter(e): void {
        // const val = e.target.value.toLowerCase();
        const cr = this.campoRicerca;

        // filter our data
        const temp = this.temp.filter((d) => {
            /* let dd = JSON.stringify(d);
            dd = dd.replace('{', '');
            dd = dd.replace('}', '');
            const ddd = dd.split(',');
            const ddddd = new Array();
            ddd.forEach(element => {
               const dddd = element.split(':');
               dddd[0] = dddd[0].replace('"', '');
               dddd[0] = dddd[0].replace('"', '');
               // console.log(dddd[0]);
               ddddd.push(dddd[0]);
            });

            ddddd.forEach(element => {
                if (typeof(d[element]) === 'string') {
                    // console.log(element, d[element]);
                    if (d[element].toLowerCase().indexOf(val) > -1) {
                        return true;
                    }
                }
            });
            // console.log(JSON.stringify(d)); */
            if (!d[cr]) { d[cr] = ''; }

            return d[cr].toLowerCase().indexOf(e.toLowerCase()) !== -1 || !e;
        });
    
        // update the rows
        this.rows = temp;
        // console.log(temp);
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;  
    }
      
    apreMenu(e, r, q): void {
        // if (this.contextMenu === true) {
        //     this.contextMenu = false;
        // }
        /* // console.log(e.x, e.y);
        // console.log(e.screenX, e.screenY);
        // console.log(e.offsetX, e.offsetY);
        // console.log(e.clientX, e.clientY);
        // console.log(e.layerX, e.layerY);
        // console.log(e.pageX, e.pageY);
        // console.log(e.srcElement.offsetLeft, e.srcElement.offsetTop, e.srcElement.offsetWidth, e.srcElement.offsetHeight);
        // console.log(e.srcElement.scrollLeft, e.srcElement.scrollTop, e.srcElement.scrollWidth, e.srcElement.scrollHeight);
        // console.log(e.target.offsetLeft, e.target.offsetTop, e.target.offsetWidth, e.target.offsetHeight);
        // console.log(e.target.scrollLeft, e.target.scrollTop, e.target.scrollWidth, e.target.scrollHeight);
        // console.log('--------'); */
        // const rect = e.target.getBoundingClientRect();
        // console.log(rect);
        // const posX = (e.pageX - e.target.offsetLeft); // e.target.offsetLeft - 40;
        // this.rigaPremutoMenu = r;
        // this.contextMenuX = posX;
        // this.contextMenuY = e.pageY - e.target.offsetTop; // 50;
        // this.contextMenu = true;
        this.cellClick.emit(r);
        // setTimeout(() => {
        this.puoChiudere = true;
        // }, 1000);
    }

    chiudePopup(): void {
        // if (this.puoChiudere === true) {
            // alert('fora');
            this.contextMenu = false;
            this.rigaPremutoMenu = undefined;
            this.puoChiudere = false;            
        // }
    }

    onClickedOutside(e): void {
        if (this.puoChiudere === true) {
            this.puoChiudere = false;
            return;
        }
        this.chiudePopup();
    }

    prendeIconaSemaforo(n, v) {
        // console.log(n, v);
        if (v && v !== 'undefined') {
            const vv = v.split(';');
            if (vv[n]) {
                const vvv = vv[n].split('*');
                // console.log(n, v, vv, vvv);
                return 'assets/icons/' + vvv[0] + '.png';
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    prendeTitoloSemaforo(n, v) {
        if (v && v !== 'undefined') {
            const vv = v.split(';');
            if (vv[n]) {
                const vvv = vv[n].split('*');
                return vvv[1];
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    prendePathImmagine(v) {
        // this.cdRef.detectChanges();
        return v + '?a=' + new Date();
    }

    vedeSeCeHeader() {
        if (this.mostraHeader === true) {
            return 100;
        } else {
            return 0;
        }
    }

    dimeHeader() {
        if (this.mostraHeader === true) {
            return '100px';
        } else {
            return '0px';
        }
    }

    premutoOffLine(e) {
        // console.log(e);
        this.tastoOfflineEmit.emit(e);
    }

    premutoGestiscePartita(e) {
        // console.log(e);
        this.tastoGestiscePartita.emit(e);
    }

    premutoStampaRicevuta(e) {
        // console.log(e);
        this.tastoStampaRicevutaEmit.emit(e);
    }

    premutoStampaScontrino(e) {
        // console.log(e);
        this.tastoStampaScontrinoEmit.emit(e);
    }

    premutoMail(e) {
        // console.log(e);
        this.tastoEmailRicevutaEmit.emit(e);
    }

    clickPallocco(n, e) {
        // console.log(n, e);
        const nn = {
            idPallocco: n,
            Riga: e
        };
        this.clickSuPallocco.emit(nn);
    }

    onCambioPagina(e) {
        // console.log(e);
        this.paginaImpostata = e.offset;
    }

    onReorder(e) {
        console.log(e);
    }
}
