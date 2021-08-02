import * as CanvasJS from '../assets/js/canvasjs.min';
import { Injectable } from '@angular/core';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from './componenti/alert/alert.component';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { ConfirmationDialogComponent } from './componenti/confirm/confirm.component';

@Injectable()
export class VariabiliGlobali {
  AccedeASquadra = '';
  confirmDialogRef: MatDialogRef<AlertComponent>;
  Anno: string;
  idUtente: number;
  Utente: string;
  Password: string;
  Cognome: string;
  Nome: string;
  Tipologia: string;
  EMail: string;
  PaginaAttuale: string;
  Squadra: string;
  idSquadra: string;
  idCampo: string;
  DescrizioneAnno: string;
  Coordinate: string;
  Indirizzo: string;
  CampoSquadra: string;
  NomePolisportiva: string;
  Permessi;
  urlWS: string;
  urlPerUpload: string;
  CodiceSquadra: string;
  CodAnnoSquadra: string;
  linkClickato: string;
  Telefono: string;
  idCategoria: number;
  idTipologia: number;
  immSfondo;
  immSfondoGlobale;
  PasswordScaduta = 0;
  Mail = '';
  PEC = '';
  Telefono2 = '';
  PIva = '';
  CodiceFiscale = '';
  CodiceUnivoco = '';
  SitoWeb = '';
  idTipologiaPermessi: number;
  idLicenza: number;
  datiAnni;
  navigation2;
  MittenteMail: '';
  ScadenzaLicenza: '';
  listaFigli;
  idFiglioScelto = 0;
  NumerazioneManuale;
  EsisteFirmaUtente;
  urlFirmaUtente;
  meseLicenza;
  annoLicenza;
  versione;
  CostoScuolaCalcio = 0;
  WidgetSelezionati = '';
  stampaModuloAssociato = false;
  AmmOriginale;
  mailComunicazioni;
  pwdComunicazioni;
  PercCashBack = 10;
  listaAllegati = new Array;
  rateManuali = false;
  pagamentiRegistrati = false;
  Cashback = false;
  ListaLicenze;
  
  idPerFirma = '';
  genitorePerFirma = '';
  codiceFirma = '';

  coloreSfondoHeader = '#efefef';
  coloreTestoHeader = '#212529';

  caricamentoInCorsoGlobale = false;
  codGenitore;
  suffisso;
  Privacy = 'S';
  iscrFirmaEntrambi;
  modalitaPrivacy = -1;
  urlFirma;
  urlGestPartita;

  modalitaCreaDB = false;
  // consideraIlRitorno = false;
  
  constructor(
    private router: Router,
    private http: Http,
    public dialog: MatDialog,
    public _matDialog: MatDialog,
  ) {

  }

  openDialog(messaggio): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: messaggio
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            return true;
        } else {
            return false;
        }
    });
  }

  pulisceCampi() {
    this.Anno = '';
    this.idUtente = -1;
    this.Utente = '';
    this.Password = '';
    this.Cognome = '';
    this.Nome = '';
    this.Tipologia = '';
    this.EMail = '';
    this.PaginaAttuale = '';
    this.Squadra = '';
    this.idSquadra = '';
    this.idCampo = '';
    this.DescrizioneAnno = '';
  }

  ritornaNumeroLicenza() {
    let ritorno = '';
    const contatore = this.CodAnnoSquadra.split('_');
    let cont2 = (+contatore[1]).toString().trim();
    for (let i = cont2.length; i <= 2; i++) {
        cont2 = '0' + cont2;
    }
    ritorno += this.idLicenza + cont2;
    ritorno += '-';

    ritorno += this.ritornaCodiceLettera(0) + this.ritornaCodiceLettera(1);
    ritorno += '-';

    ritorno += this.ritornaCodiceLettera(2) + this.ritornaCodiceLettera(3);
    ritorno += '-';

    let mese = this.meseLicenza;
    if (mese.length === 1) {
        mese = '0' + mese;
    }
    const anno = this.annoLicenza;
    ritorno += this.ritornaCodiceLettera(4) + mese;
    ritorno += '-';

    ritorno += anno;

    return ritorno;
  }

  ritornaCodiceLettera(posizione): string {
    if (this.Squadra.length < posizione) {
        return '00';
    } else {
        const lettere = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lettera = this.Squadra.substring(posizione, posizione + 1).toUpperCase();
        // console.log('Controllo lettera', lettera, lettere.indexOf(lettera));
        let posizione1 = (lettere.indexOf(lettera)).toString().trim();
        if (posizione1 === '-1') {
            posizione1 = '00';
        } else {
            if (posizione1.length === 1) {
                posizione1 = '0' + posizione1;
            }
        }
        return posizione1;
    }
  }

  sistemaTestoERitorna(maiuscole, e) {
    // console.log('Cambio data:', e);
    let nomeCampo2 = e;
    
    if (e || e === '') {
        nomeCampo2 = this.maiuscoleInizioParola(maiuscole, e);
    }
    if (nomeCampo2) {
      while (nomeCampo2.indexOf('***') > -1)  {
        nomeCampo2 = nomeCampo2.replace('***', '**');
      }
    }
    // console.log('campo prima:', e);
    // console.log('campo dopo:', nomeCampo2);

    return nomeCampo2;
  }

  maiuscoleInizioParola(maiuscole, e) {
    if (maiuscole === true) {
      let c = e.toLowerCase().split(' ');
      let ritorno = '';
      c.forEach(element => {
        const primaLettera = element.substring(0, 1).toUpperCase();
        ritorno += primaLettera + element.substring(1, element.length) + ' ';
      });
      if (ritorno !== '') {
        ritorno = ritorno.substring(0, ritorno.length - 1);
      }

      if (ritorno.indexOf('-') > - 1) {
        c = ritorno.split('-');
        // console.log(c);
        ritorno = '';
        c.forEach(element => {
          const primaLettera = element.substring(0, 1).toUpperCase();
          ritorno += primaLettera + element.substring(1, element.length) + '-';
        });
        if (ritorno !== '') {
          ritorno = ritorno.substring(0, ritorno.length - 1);
        }
      }

      if (ritorno.indexOf('.') > - 1) {
        c = ritorno.split('.');
        // console.log(c);
        ritorno = '';
        c.forEach(element => {
          const primaLettera = element.substring(0, 1).toUpperCase();
          ritorno += primaLettera + element.substring(1, element.length) + '. ';
        });
        if (ritorno !== '') {
          ritorno = ritorno.substring(0, ritorno.length - 2);
        }
      }

      // console.log(ritorno);
      return ritorno;
    } else {
      return e;
    }
  }

  creaRigaTabella(posizione, campo, titolo, nascosto, tipologia) {
    const s = '{ "posizione": ' + posizione + ', ' +
      '"campo": "' + campo + '", ' +
      '"id": ' + posizione + ', ' +
      '"titolo": "' + titolo + '", ' +
      '"nascosto": ' + nascosto + ', ' +
      '"Tipologia": "' + tipologia + '"' +
    '},';
    return s;
  }

  prendeLogoGlobale() {
    const imm = this.urlWS + 'Multimedia/logoApplicazione.png?Data=' + new Date();
    // console.log(imm);
    return imm;
  }

  prendeLogo() {
    const imm = this.urlWS + 'Multimedia/' +
      this.Squadra + '/Societa/' + this.Anno + '_1.kgb'; // jpg?Data=' + new Date();
    // console.log(imm);
    return imm;
  }

  prendeLogoAffiliazione() {
    const imm = this.urlWS + 'Multimedia/' +
      this.Squadra + '/Societa/' + this.Anno + '_2.kgb'; // jpg?Data=' + new Date();
    // console.log(imm);
    return imm;
  }

  caricaImmSfondoGlobale() {
    const imm = this.urlWS + 'Multimedia/Sfondo.jpg';
    // console.log(imm);
    this.immSfondoGlobale = imm;
    return imm;
  }

  caricaImmSfondo() {
    const imm = this.urlWS + 'Multimedia/' +
      this.Squadra + '/Societa/' + this.Anno + '_0.kgb'; // jpg?Data=' + new Date();
    // console.log(imm);
    this.immSfondo = imm;
  }

  prendeImmUtente() {
    const imm = this.urlWS + 'Multimedia/' +
      this.Squadra + '/Utenti/' + this.Anno + '_' + this.idUtente + '.kgb'; // jpg?Data=' + new Date();
    // console.log(imm);
    return imm;
  }

  caricaPermessi(api, aprePrimaPagina) {
    // console.log('Carica Permessi', api, aprePrimaPagina);
    api.ritornaPermessiMaschere(this.CodAnnoSquadra, this.idUtente)
    .map(response => response.text())
    .subscribe(
      data => {
        if (data) {
          const data2 = api.prendeSoloDatiValidi(data);
          if (data2.indexOf('ERROR') === -1 || (data2.indexOf('ERROR') > -1 && data2.indexOf('Nessun permesso') > -1)) {
            // console.log(data2);

            const data3 = data2.split('§');
            let s = '{';
            data3.forEach(element => {
              if (element !== '') {
                const data4 = element.split(';');
                const nomeCampo = data4[4];
                s += '"' + nomeCampo + '": true,';
              }
            });
            if (s.length > 5) {
              s = s.substring(0, s.length - 1);
              s += '}';
            }
            this.Permessi = null;
            try {
              this.Permessi = JSON.parse(s);
            } catch (e) {
              // console.log('Errore nel parse dei permessi', s);
            }
            // console.log(this.Permessi, this.Permessi['ARBITRI']);

            if (aprePrimaPagina === true) {
                if (+this.PasswordScaduta === 1) {
                    this.Utente = '';
                    const dove = 'reset-password-2';
                    this.router.navigate([dove]);
                } else {
                    const dove = 'home';
                    this.router.navigate([dove]);
                }
            }
          } else {
            // alert(data2);
            this.mostraMessaggio(data2, false);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          // alert(error);
          this.mostraMessaggio(error, false);
        }
      }
    );
  }

  creaDatiGriglia(campi, listaCampi, listaPosizione, listaTitoli, listaNascosti, listaTipologia, pathUrl, filtroImmagine) {
    let s = '[';
    let i = 0;
    listaCampi.forEach(element => {
      s += this.creaRigaTabella(
        listaPosizione[i],
        element,
        listaTitoli[i],
        listaNascosti[i],
        listaTipologia[i]
      );
      i++;
    });
    s = s.substring(0, s.length - 1);
    // s += '{ "posizione": 4, "campo": "Immagine", "id": 22, "titolo": "Immagine", "nascosto": false, "Tipologia": "Immagine" }';
    s += ']';
    // console.log(s);
    const scolumns = JSON.parse(s);

    s = '';
    let sriga = 0;
    // console.log(campi[1]);
    const campiNuovo = new Array();
    campi.forEach(element => {
      if (element !== '') {
        const c = element.split(';');
        let cc = '';
        let iii = 0;
        listaTipologia.forEach(element2 => {
          // console.log(listaTipologia[ii]);
          if (element2.indexOf('Immagine') > -1) {
            cc += element2 + ';';
          } else {
            cc += c[iii] + ';';
            iii++;
          }
        });
        // console.log(cc.split(';'));
        // return;
        campiNuovo.push(cc);
      }
    });
    // console.log(listaTipologia);
    // console.log(campiNuovo[0].split(';'));
    // return;

    let ii = 0;
    let rigaBase = '{ ';
    scolumns.forEach(element2 => {
      rigaBase += '"**TITOLO' + listaPosizione[ii] + '**": "**CAMPO' + listaPosizione[ii] + '**", ';
      ii++;
    });
    rigaBase = rigaBase.substring(0, rigaBase.length - 2);
    // console.log(rigaBase);

    let riga = 0;
    campiNuovo.forEach(element => {
      if (element !== '') {
        const campi2 = element.split(';');
        riga++;
        // console.log(campi2);

        ii = 0;
        s += rigaBase;
        scolumns.forEach(element2 => {
          let tipo = listaTipologia[listaPosizione[ii]];
          // console.log(tipo);
          if (tipo) {
            let numero = 0;
            if (tipo.indexOf('.') > -1) {
              numero = +(tipo.substring(tipo.indexOf('.') + 1, tipo.length)) - 1;
              tipo = tipo.substring(0, tipo.indexOf('.'));
              // console.log(tipo, numero);
            }
            switch(tipo) {
              case 'Testo':
                // s += '"' + element2.campo + '": "' + campi2[listaPosizione[ii]] + '",';
                s = s.replace('**TITOLO' + listaPosizione[ii] + '**', element2.campo);
                s = s.replace('**CAMPO' + listaPosizione[ii] + '**', campi2[ii]);
                break;
              case 'Numero':
                // s += '"' + element2.campo + '": "' + campi2[listaPosizione[ii]] + '",';
                s = s.replace('**TITOLO' + listaPosizione[ii] + '**', element2.campo);
                s = s.replace('**CAMPO' + listaPosizione[ii] + '**', campi2[ii]);
                break;
              case 'Immagine':
                let filtro = '';
                // console.log(numero, filtroImmagine[numero]);
                if (filtroImmagine[numero] !== '') {
                  const f = filtroImmagine[numero].split(';');
                  // console.log(f);
                  f.forEach(element3 => {
                    if (element3.indexOf('*ANNO') > - 1) {
                      filtro += this.Anno;
                    } else {
                      if (element3.indexOf('Campo') > - 1) {
                        const nc = element3.replace('Campo', '');
                        // console.log(nc);
                        filtro += campi2[+nc];
                      } else {
                        filtro += element3;
                      }
                    }
                    // console.log(filtro, element3);
                  });
                }
                // console.log(filtro);
                const imm = pathUrl[numero] + '/' + filtro + '.kgb'; // jpg?Date=' + new Date();
                // s += '"' + element2.campo + '": "' + imm + '",';
                s = s.replace('**TITOLO' + listaPosizione[ii] + '**', element2.campo);
                s = s.replace('**CAMPO' + listaPosizione[ii] + '**', imm);

                break;
              default:
                // console.log('ERRORE', '*' + listaTipologia[ii] + '*');
                break;
            }
          }
          ii++;
        });
        // s += '"idRiga": ' + sriga + ', "Immagine": ""},';
        // s = s.substring(0, s.length - 1);
        s += ', "idRiga": ' + sriga + '},';
        // console.log(s);
        sriga++;
      }
    });
    if (s.length > 0) {
      s = s.substring(0, s.length - 1);
      s = '[' + s + ']';
    }

    // console.log(s);
    if (s !== '') {
      const ritorno = [ JSON.parse(s), { riga: sriga }, { columns : scolumns }];
      return ritorno;
    } else {
      return [ 'empty grid', { riga: sriga }, { columns : scolumns }];
    }
    // console.log(this.gridData);
  }

  esisteUrl(urlToFile) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', urlToFile, false);
      xhr.send();
      // console.log(xhr);
      if (xhr.status === 404) {
        // console.clear();
        return false;
      } else {
        // console.clear();
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  controllaPassword(pp): boolean {
    let p = pp;
    if (p.length < 8) {
        return false;
    }
    const stringhe = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const numerici = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const speciali = ['!', '"', '£', '$', '%', '&', '/', '(', ')', '=', '?', '^', '*', '-', '_', '.', ',', ';', ':', '<', '>', '\\', '|', '\''];
    let qStringheMin = 0;
    let qStringheMai = 0;
    let qNumerici = 0;
    let qSpeciali = 0;

    let orig = p;
    stringhe.forEach(element => {
        while (p.indexOf(element) > -1) {
            qStringheMin++;
            p = p.replace(element, '°');
        }
        while (p.indexOf(element.toUpperCase()) > -1) {
            qStringheMai++;
            p = p.replace(element.toUpperCase(), '°');
        }
    });      
    p = orig;
    numerici.forEach(element => {
        while (p.indexOf(element) > -1) {
            qNumerici++;
            p = p.replace(element, '°');
        }
    });
    p = orig;
    speciali.forEach(element => {
        while (p.indexOf(element) > -1) {
            qSpeciali++;
            p = p.replace(element, '°');
        }
    });
    // console.log(qStringheMin, qStringheMai, qNumerici, qSpeciali);

    if (qStringheMin > 2 && qStringheMai > 0 && qNumerici > 2 && qSpeciali > 0) {
        return true;
    } else {
        return false;
    }
  }

  mostraMessaggio(messaggio, conferma) {
    this.confirmDialogRef = this._matDialog.open(AlertComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.messaggio = messaggio;
    this.confirmDialogRef.componentInstance.conferma = conferma;
  }

  ridisegnaMenu(navigation) {
        console.log('Menù originale', navigation[0].children);
        console.log('Permessi utente', this.Permessi);
        console.log('Tipologia', this.Tipologia);
        console.log('Lista licenze', this.ListaLicenze);

        if (this.Tipologia) {
          const tipologia = this.Tipologia.toUpperCase();

          let navigation2;

          // GESTIONE LICENZE
          if (tipologia !== 'SUPER USER') {
            navigation2 = JSON.parse(JSON.stringify(navigation[0].children));
            if (this.ListaLicenze) {
              const n = new Array();
              navigation2.forEach(element => {
                const idPadre = element.id.toUpperCase().trim();

                const agg = {
                  icon: element.icon,
                  id: element.id,
                  title: element.title,
                  translate: element.translate,
                  type: element.type,
                  url: element.url
                };

                let okPadre = false;
                // console.log('Ricerca id', idPadre);
                this.ListaLicenze.forEach(ll => {
                  if (!ll.Preso) {
                    if (idPadre === ll.Codice.toUpperCase().trim()) {
                      ll.Preso = true;
                      okPadre = true;
                      n.push(agg);
                    }
                  }
                });

                if (okPadre) {
                  const agg2 = new Array();
                  if (element.children) {
                    // console.log('Ricerca Children:', element.id, element.children);
                    let ok = false;

                    const c = element.children;
                    c.forEach(element2 => {
                      const idFiglio = element2.id.toUpperCase().trim();

                      this.ListaLicenze.forEach(ll => {
                        if (!ll.Preso) {
                          if (idFiglio === ll.Codice.toUpperCase().trim()) {
                            ll.Preso = true;
                            agg2.push(element2);
                            ok = true;

                            this.ListaLicenze.forEach(ll2 => {
                              if (!ll2.Preso) {
                                if (idPadre === ll2.Codice.toUpperCase().trim()) {
                                  ll2.Preso = true;
                                }
                              }
                            });
                          }
                        }
                      });
                    });

                    if (ok) {
                      agg['children'] = agg2;
                      // n.push(agg);
                    }
                  }
                }
              });
              const n2 = [ { id: 'applications', title: 'Applications', translate: 'NAV.APPLICATIONS', type: 'group', children: n } ];
              // console.log('Menù finale per licenze', n2);
              this.ListaLicenze.forEach(element => {
                if (!element.Preso) {
                  console.log('MENU\' ' + element.Codice + ' Non rilevato. Forse è stato impostato il figlio ma non il padre...', element);
                }
              });
              navigation2 = n2;
            }
          } else {
            navigation2 = JSON.parse(JSON.stringify(navigation));
          }

          // VERIFICA SU ITEMS PRESENTI ANCHE SE NON C'E' LICENZA
          navigation2[0].children.forEach(padre => {
            let ok = false;
            const id = padre.id.toUpperCase().trim();
            this.ListaLicenze.forEach(licenza => {
              if (id === licenza.Codice.toUpperCase().trim()) {
                ok = true;
              }
            });
            if (!ok) {
              console.log('Padre presente in lista ma non in licenza:', id, padre);
            }

            const figli = padre.children;
            if (figli) {
              figli.forEach(figlio => {
                let ok = false;
                const id = figlio.id.toUpperCase().trim();
                this.ListaLicenze.forEach(licenza => {
                  if (id === licenza.Codice.toUpperCase().trim()) {
                    ok = true;
                  }
                });
                if (!ok) {
                  console.log('Figlio presente in lista ma non in liceza:', id, figlio);
                }
              });
            }
          });
          // VERIFICA SU ITEMS PRESENTI ANCHE SE NON C'E' LICENZA

          // GESTIONE PERMESSI UTENTE
          const r = JSON.parse(JSON.stringify(navigation2[0].children));
          const nuovo2 = new Array();

          switch (tipologia.toUpperCase().trim()) {
              case 'UTENTE':
                  r.forEach(element => {
                      const rigaPadre = element.id.toUpperCase().trim();
                      // console.log('Controllo padre:', rigaPadre);
                      if (this.Permessi && this.Permessi[rigaPadre]) {
                          const ele = {
                              icon: element.icon,
                              id: element.id,
                              title: element.title,
                              translate: element.translate,
                              type: element.type,
                              url: element.url,
                              children: null
                          };
                          // console.log('Aggiungo padre:', ele);
                          if (element.children && element.id !== 'amministrazione' && element.id !== 'super user' && element.id !== 'genitori' && element.id !== 'giocatori') {
                              const rr = element.children;
                              const nuovo = new Array();
                              rr.forEach(element2 => {
                                  const rigaFiglio = element2.id.toUpperCase().trim();
                                  // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                                  if (this.Permessi[rigaFiglio]) {
                                      // console.log('Aggiungo figlio:', rigaPadre, rigaFiglio);
                                      nuovo.push(element2);
                                  }
                              });
                              ele.children = nuovo;
                          }
                          nuovo2.push(ele);
                      }
                  });
                  navigation2[0].children = nuovo2;
                  // console.log(this.navigation2[0]);
                  break;
              case 'AMMINISTRATORE':
                  r.forEach(element => {
                      // console.log(element.id);
                      if (element.id !== 'super user' && element.id !== 'genitori' && element.id !== 'giocatori') {
                          if (element.children) {
                              const rr = element.children;
                              const nuovo = new Array();
                              rr.forEach(element2 => {
                                  const rigaFiglio = element2.id.toUpperCase().trim();
                                  // console.log('Controllo figlio AMM:', rigaFiglio);
                                  nuovo.push(element2);
                              });
                              element.children = nuovo;
                          }
                          nuovo2.push(element);
                      }
                  });
                  navigation2[0].children = nuovo2;
                  break;
              case 'SUPER USER':
                  if (this.AccedeASquadra !== '') {
                      navigation2[0].children = navigation[0].children;
                  } else {
                      r.forEach(element => {
                          // console.log(element.id);
                          if (element.id === 'super user' && element.id !== 'genitori' && element.id !== 'giocatori') {
                              if (element.children) {
                                  const rr = element.children;
                                  const nuovo = new Array();
                                  rr.forEach(element2 => {
                                      const rigaFiglio = element2.id.toUpperCase().trim();
                                      // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                                      nuovo.push(element2);
                                  });
                                  element.children = nuovo;
                              }
                              nuovo2.push(element);
                          }
                      });
                      navigation2[0].children = nuovo2;
                  }
                  break;
              case 'GENITORE':
                  r.forEach(element => {
                      if (element.id === 'genitori' || element.id === 'home' || element.id === 'contatti') {
                        if (element.children) {
                            const rr = element.children;
                            const nuovo = new Array();
                            rr.forEach(element2 => {
                                const rigaFiglio = element2.id.toUpperCase().trim();
                                // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                                nuovo.push(element2);
                            });
                            element.children = nuovo;
                        }
                        nuovo2.push(element);
                      }
                  });
                  navigation2[0].children = nuovo2;
                  break;
              case 'GIOCATORE':
                  r.forEach(element => {
                      if (element.id === 'giocatori' || element.id === 'home') {
                          if (element.children) {
                              const rr = element.children;
                              const nuovo = new Array();
                              rr.forEach(element2 => {
                                  const rigaFiglio = element2.id.toUpperCase().trim();
                                  // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                                  nuovo.push(element2);
                              });
                              element.children = nuovo;
                          }
                          nuovo2.push(element);
                      }
                  });
                  navigation2[0].children = nuovo2;
                  break;
              case 'DIRIGENTE GENITORE':
                r.forEach(element => {
                  if (element.id === 'dirigenti' || element.id === 'genitori' || element.id === 'home' || element.id === 'contatti') {
                    if (element.children) {
                        const rr = element.children;
                        const nuovo = new Array();
                        rr.forEach(element2 => {
                            const rigaFiglio = element2.id.toUpperCase().trim();
                            // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                            nuovo.push(element2);
                        });
                        element.children = nuovo;
                    }
                    nuovo2.push(element);
                  }
                });
                navigation2[0].children = nuovo2;
                break;

              case 'DIRIGENTE':
                  /* r.forEach(element => {
                      const rigaPadre = element.id.toUpperCase().trim();
                      // console.log('Controllo padre:', rigaPadre);
                      let aggiungi = false;
                      let menuFisso = false;
                      if (this.Permessi && this.Permessi[rigaPadre]) { aggiungi = true; }
                      if (aggiungi === false) {
                          if ((rigaPadre === 'GENITORI' && tipologia.indexOf('GENITORE') > -1) 
                              || rigaPadre === 'HOME') {
                              aggiungi = true;
                              menuFisso = true;
                          }
                      }
                      if (aggiungi) {
                          const ele = {
                              icon: element.icon,
                              id: element.id,
                              title: element.title,
                              translate: element.translate,
                              type: element.type,
                              url: element.url,
                              children: null
                          };
                          // console.log('Aggiungo padre:', ele);
                          if (element.children && element.id !== 'amministrazione' && element.id !== 'super user') {
                              const rr = element.children;
                              const nuovo = new Array();
                              rr.forEach(element2 => {
                                  const rigaFiglio = element2.id.toUpperCase().trim();
                                  // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                                  if (menuFisso === false) {
                                      if (this.Permessi && this.Permessi[rigaFiglio]) {
                                          // console.log('Aggiungo figlio:', rigaPadre, rigaFiglio);
                                          nuovo.push(element2);
                                      }
                                  } else {
                                      nuovo.push(element2);
                                  }
                              });
                              ele.children = nuovo;
                          }
                          nuovo2.push(ele);
                      }
                  });
                  navigation2[0].children = nuovo2;
                  // console.log(this.navigation2[0]);
                  break; */
                  r.forEach(element => {
                    if (element.id === 'dirigenti' || element.id === 'home' || element.id === 'contatti') {
                      if (element.children) {
                          const rr = element.children;
                          const nuovo = new Array();
                          rr.forEach(element2 => {
                              const rigaFiglio = element2.id.toUpperCase().trim();
                              // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                              nuovo.push(element2);
                          });
                          element.children = nuovo;
                      }
                      nuovo2.push(element);
                    }
                });
                navigation2[0].children = nuovo2;
                break;

              case 'ALLENATORE':
                r.forEach(element => {
                  if (element.id === 'allenatori' || element.id === 'home' || element.id === 'contatti') {
                    if (element.children) {
                        const rr = element.children;
                        const nuovo = new Array();
                        rr.forEach(element2 => {
                            const rigaFiglio = element2.id.toUpperCase().trim();
                            // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                            nuovo.push(element2);
                        });
                        element.children = nuovo;
                    }
                    nuovo2.push(element);
                  }
                });
                navigation2[0].children = nuovo2;
                break;

              case 'ALLENATORE GENITORE':
                r.forEach(element => {
                  if (element.id === 'allenatori' || element.id === 'genitori' || element.id === 'home' || element.id === 'contatti') {
                    if (element.children) {
                        const rr = element.children;
                        const nuovo = new Array();
                        rr.forEach(element2 => {
                            const rigaFiglio = element2.id.toUpperCase().trim();
                            // console.log('Controllo figlio:', rigaPadre, rigaFiglio);
                            nuovo.push(element2);
                        });
                        element.children = nuovo;
                    }
                    nuovo2.push(element);
                  }
                });
                navigation2[0].children = nuovo2;
                break;

              default:
                navigation2[0] = null;
                break;
          }       

          this.navigation2 = navigation2;
          return navigation2;
        }
    }

    riempieGrafico(idChart, dp, nomeGrafico, tipoGrafico, titolo, titoloAsseX, titoloAsseY, visualizzaAsseX, currency) {
        let valCurr = '#.##';
        let come = "horizontal";
        if (currency === true) {
          valCurr = '€0.00';
          come = "vertical";
        }
        setTimeout(() => {
          const datelli = [{
            indexLabelFontSize: 11,
            indexLabelFontWeight: "bold",
            indexLabelOrientation: come,
            name: nomeGrafico,
            indexLabel: "{yy}",
            valueFormatString: valCurr,
            type: tipoGrafico,
            showInLegend: true,
            dataPoints: dp
          }];
          let vAx = 'e.value';
          if (visualizzaAsseX === false) {
              vAx = '';
          }
          const chart = new CanvasJS.Chart(idChart, {
            animationEnabled: true,
            title: { text: titolo },
            toolTip: {    
              contentFormatter: function ( e ) {
                // console.log(e);
                let content = ' ';
                for (var i = 0; i < e.entries.length; i++) {
                  content += 'Anno ' + e.entries[i].dataPoint.label + ': ' + "<strong>" + e.entries[i].dataPoint.yy + "</strong>";
                  content += "<br/>";
                }
                return content;
              },  
              shared: true
            },
            axisX: { labelFormatter: function(e) { return vAx; } , title: titoloAsseX, valueFormatString: valCurr },
            axisY: { title: titoloAsseY, valueFormatString: valCurr },
            data: datelli
          });
          // console.log(dp);
          chart.render();
        }, 1000);
    }

    stampaDocumento(url) {
        this.http.get(url, {
          responseType: ResponseContentType.Blob
        }).subscribe(
          (response) => { // download file
            const blob = new Blob([response.blob()], {type: 'application/pdf'});
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
        });
    }    

    prendeTipologia(t) {
        let rit = '';

        switch (t) {
            case 0:
                rit = 'Super User';
                break;
            case 1:
                rit = 'Amministratore';
                break;
            case 2:
                rit = 'Utente';
                break;
            case 3:
                rit = 'Genitore';
                break;
            case 4:
                rit = 'Dirigente Genitore';
                break;
            case 5:
                rit = 'Allenatore Genitore';
                break;
            case 6:
                rit = 'Giocatore';
                break;
            case 7:
                rit = 'Allenatore';
                break;
            case 8:
                rit = 'Dirigente';
                break;
            default:
                rit = 'Sconosciuto';
                break;
        }

        return rit;
    }

    /* async creaWidgetsPagamenti(api) {
      setTimeout(() => {
          api.CreaQuoteNonSaldate(this.CodAnnoSquadra)
          .map(response => response.text())
          .subscribe(
          data => {
              if (data) {
                  const data2 = api.prendeSoloDatiValidi(data);
              }
          },
          (error) => {
              if (error instanceof Error) {
              }
          });  
      }, 1000);
    } */

  creaWidgetsAnagrafica(api) {
    const params = {
      Squadra: this.CodAnnoSquadra,
  };
  api.PulisceDatiWidgets(params)
  .map(response => response.text())
  .subscribe(
    data => {
      if (data) {
        const data2 = api.prendeSoloDatiValidi(data);
      }
    });
  }

    /*
  async creaWidgetsAnagrafica2(api) {
      setTimeout(() => {
          const params = {
              Squadra: this.CodAnnoSquadra,
          };
          api.CreaIscritti(params)
          .map(response => response.text())
          .subscribe(
            data => {
              if (data) {
                const data2 = api.prendeSoloDatiValidi(data);
  
                setTimeout(() => {
                  api.CreaConteggi(api.CodAnnoSquadra)
                  .map(response => response.text())
                  .subscribe(
                  data => {
                      if (data) {
                          const data2 = api.prendeSoloDatiValidi(data);
  
                          setTimeout(() => {
                              api.CreaFirmeDaValidare(this.CodAnnoSquadra, 'S')
                              .map(response => response.text())
                              .subscribe(
                              data => {
                                  if (data) {
                                      const data2 = api.prendeSoloDatiValidi(data);

                                      setTimeout(() => {
                                          api.CreaIndicatori(this.CodAnnoSquadra)
                                          .map(response => response.text())
                                          .subscribe(
                                          data => {
                                              if (data) {
                                                  const data2 = api.prendeSoloDatiValidi(data);

                                                  this.creaWidgetsPagamenti(api);
                                              }
                                          },
                                          (error) => {
                                              if (error instanceof Error) {
                                              }
                                          });                                      
                                      }, 5000);
                                  }
                              },
                              (error) => {
                                  if (error instanceof Error) {
                                  }
                              });                                      
                          }, 5000);
          
                      }
                  },
                  (error) => {
                      if (error instanceof Error) {
                      }
                  });                        
                }, 5000);
              }
            },
            (error) => {
              if (error instanceof Error) {
              }
            }
          );  
      }, 1000);
  }
  */
}
