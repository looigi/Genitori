import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from './httpclient.service';
import { VariabiliGlobali } from '../global.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { timer } from 'rxjs/observable/timer';
import { Observable } from 'rxjs';

@Injectable()

export class ApiService {
  // private urlBase = this.variabiliGlobali.urlWS;
  // private urlRoot = environment.urlRoot;
  vecchiParametriPerMail = '';

  constructor(
    private httpclient: HttpClient,
    private router: Router,
    private location: Location,
    private variabiliGlobali: VariabiliGlobali
    ) {
      this.controlloPresenzaUtente(false);

      setTimeout(() => {
        // console.log('Spengo attesa iniziale');
        this.variabiliGlobali.caricamentoInCorsoGlobale = false;
      }, 10);
  }

  controlloPresenzaUtente(nonDisegnareIconaDiAttesa): void {
    if (window.location.href.indexOf('/nuova_societa') !== -1) {
      this.variabiliGlobali.modalitaCreaDB = true;
      console.log('API SERVICE: Nuova società');
      // return;
    } else {
      this.variabiliGlobali.modalitaCreaDB = false;
    /* if (window.location.href.indexOf('/login') === -1) {
      setTimeout(() => {
        this.variabiliGlobali.consideraIlRitorno = true;
        this.variabiliGlobali.modalitaCreaDB = false;
        this.variabiliGlobali.Utente = '';

        console.log('Pagina che non c\'entra niente... Devo tornare al login');
      }, 100);
    } else {
      if (window.location.href.indexOf('/login?CreaDB=') !== -1) {
        console.log('Pagina di creazione DB... Vado lì');
      } else {
        console.log('Pagina normale');
      }
    }
    console.log(this.variabiliGlobali.consideraIlRitorno, window.location.href); */
    // if (this.variabiliGlobali.modalitaCreaDB === false) {
      // console.log(this.variabiliGlobali.Utente, this.variabiliGlobali.Tipologia, this.variabiliGlobali.codiceFirma);
      if (environment.debug === false && this.variabiliGlobali.Tipologia !== 'Amministratore') {
        if (this.variabiliGlobali.Utente === '' || this.variabiliGlobali.Utente === undefined) {
          if (!this.variabiliGlobali.codiceFirma || this.variabiliGlobali.codiceFirma !== '') {
              // alert('Sessione scaduta 1: ' + this.location.path());

              /* this.variabiliGlobali.Anno = localStorage.getItem('GC_Anno');
              this.variabiliGlobali.Utente = localStorage.getItem('GC_UserName');
              this.variabiliGlobali.Password = localStorage.getItem('GC_Password');
              this.variabiliGlobali.CodAnnoSquadra = localStorage.getItem('GC_CodAnnoSquadra');
              this.variabiliGlobali.Squadra = localStorage.getItem('GC_Squadra'); */

              // if (this.variabiliGlobali.consideraIlRitorno === true) {
                const dove = 'login';              
                this.router.navigate([dove]);
              // }
          }
        }
      } else {
        if (this.variabiliGlobali.Utente === undefined && this.variabiliGlobali.Tipologia === undefined) {
          if (!this.variabiliGlobali.codiceFirma || this.variabiliGlobali.codiceFirma !== '') {
              // alert('Sessione scaduta 2: ' + this.location.path());

              // if (this.variabiliGlobali.consideraIlRitorno === true) {
                const dove = 'login';
                this.router.navigate([dove]);
              // }
          }
      }
        /* if (!this.variabiliGlobali.Squadra || this.variabiliGlobali.Squadra === ''
            || this.variabiliGlobali.Squadra === undefined) {
          this.variabiliGlobali.Anno = '2';
          this.variabiliGlobali.Squadra = 'Ponte Di Nona';
          while (this.variabiliGlobali.Squadra.indexOf(' ') > -1) {
            this.variabiliGlobali.Squadra = this.variabiliGlobali.Squadra.replace(' ', '_');
          }
          this.variabiliGlobali.DescrizioneAnno = '2019 / 2020';
          this.variabiliGlobali.Coordinate = '41.895031;12.6755324';
          this.variabiliGlobali.Indirizzo = 'Via Raoul Follerau';
          this.variabiliGlobali.CampoSquadra = 'Gabii';
          this.variabiliGlobali.NomePolisportiva = 'Polisportiva Ponte Di Nona';
          this.variabiliGlobali.idUtente = 1;
        } */
      }
    // }
    }

    if (nonDisegnareIconaDiAttesa === false) {
        setTimeout(() => {
            // console.log('Accendo attesa');
            this.variabiliGlobali.caricamentoInCorsoGlobale = true;
        }, 10);
    }
  }

  cambiaChar(ee, c1, c2) {
    while (ee.indexOf(c1) > -1) {
        ee = ee.replace(c1, c2);
    }
    return ee;
  }

  sistemaTesto(e): string {
    if (e === undefined || e === 'undefined' || e === '' || e === null) {
        return '';
    }

    let ee = e.toString();
    
    ee = this.cambiaChar(ee, '<', '%3C');
    ee = this.cambiaChar(ee, '>', '%3E');
    ee = this.cambiaChar(ee, '#', '%23');
    ee = this.cambiaChar(ee, '{', '%7B');
    ee = this.cambiaChar(ee, '}', '%7D');
    ee = this.cambiaChar(ee, '|', '%7C');
    ee = this.cambiaChar(ee, '\\', '%5C');
    ee = this.cambiaChar(ee, '^', '%5E');
    ee = this.cambiaChar(ee, '~', '%7E');
    ee = this.cambiaChar(ee, '[', '%5B');
    ee = this.cambiaChar(ee, ']', '%5D');
    ee = this.cambiaChar(ee, '`', '%60');
    // ee = this.cambiaChar(ee, ';', '%3B');
    ee = this.cambiaChar(ee, '/', '%2F');
    ee = this.cambiaChar(ee, '?', '%3F');
    ee = this.cambiaChar(ee, ':', '%3A');
    ee = this.cambiaChar(ee, '@', '%40');
    ee = this.cambiaChar(ee, '=', '%3D');
    ee = this.cambiaChar(ee, '&', '%26');
    ee = this.cambiaChar(ee, '$', '%24');

    return ee;
  }

  login(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/RitornaUtentePerLoginNuovo?' +
      'Utente=' + this.sistemaTesto(params.Utente); // ) + '&' +
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaRuoli(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/RitornaRuoli?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaNuovoNumeroPartita(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/RitornaIdPartita?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // GIOCATORI
  RitornaNuovoIDGiocatore(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaNuovoIDGiocatore?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaGiocatoriCategoria(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaGiocatoriCategoria?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaGiocatoriNonInCategoria(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaGiocatoriNonInCategoria?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaIscrizioni(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaGiocatoriDaIscrivere?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaIscrizione(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const RC = params.RapportoCompleto === true ? 'S' : 'N';
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/SalvaIscrizione?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'RapportoCompleto=' + this.sistemaTesto(RC);
    // console.log('Salva Iscrizione:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaPagamento(params) {
    this.controlloPresenzaUtente(false);
    let im = params.ImportoManuale.toString();
    if (im && im !== null && im !== '') {
      im = im.replace(',', '.');
    }

    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/SalvaPagamento?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'Pagamento=' + this.sistemaTesto(params.Pagamento) + '&' +
      'Commento=' + this.sistemaTesto(params.Commento) + '&' +
      'idPagatore=' + this.sistemaTesto(params.idPagatore) + '&' +
      'idRegistratore=' + this.sistemaTesto(params.idUtente) + '&' +
      'Note=' + this.sistemaTesto(params.Note) + '&' +
      'Validato=' + this.sistemaTesto(params.Validato) + '&' +
      'idTipoPagamento=' + this.sistemaTesto(params.idTipoPagamento) + '&' +
      'idRata=' + this.sistemaTesto(params.idRata) + '&' +
      'idQuota=' + this.sistemaTesto(params.idQuota) + '&' +
      'Suffisso=' + this.sistemaTesto(this.variabiliGlobali.suffisso) + '&' +
      'sNumeroRicevuta=' + this.sistemaTesto(params.NumeroRicevuta) + '&' +
      'DataRicevuta=' + this.sistemaTesto(params.DataRicevuta) + '&' +
      'idUtente=' + this.sistemaTesto(this.variabiliGlobali.idUtente) + '&' +
      'idModalitaPagamento=' + this.sistemaTesto(params.idModalitaPagamento) + '&' +
      'ImportoManuale=' + this.sistemaTesto(im) + '&' +
      'DescrizioneManuale=' + this.sistemaTesto(params.DescrizioneManuale) + '&' +
      'DataManuale=' + this.sistemaTesto(params.DataManuale)
      ;
    // console.log('Salva Pagamento:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  modificaPagamento(params) {
    this.controlloPresenzaUtente(false);
    let im = params.ImportoManuale.toString();
    if (im && im !== null && im !== '') {
      im = im.replace(',', '.');
    }
    
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/ModificaPagamento?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idPagamento=' + this.sistemaTesto(params.idPagamento) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'Pagamento=' + this.sistemaTesto(params.Pagamento) + '&' +
      'Commento=' + this.sistemaTesto(params.Commento) + '&' +
      'idPagatore=' + this.sistemaTesto(params.idPagatore) + '&' +
      'idRegistratore=' + this.sistemaTesto(params.idUtente) + '&' +
      'Note=' + this.sistemaTesto(params.Note) + '&' +
      'Validato=' + this.sistemaTesto(params.Validato) + '&' +
      'idTipoPagamento=' + this.sistemaTesto(params.idTipoPagamento) + '&' +
      'idRata=' + this.sistemaTesto(params.idRata) + '&' +
      'idQuota=' + this.sistemaTesto(params.idQuota) + '&' +
      'Suffisso=' + this.sistemaTesto(this.variabiliGlobali.suffisso) + '&' +
      'NumeroRicevuta=' + this.sistemaTesto(params.NumeroRicevuta) + '&' +
      'DataRicevuta=' + this.sistemaTesto(params.DataRicevuta) + '&' +
      'idUtente=' + this.sistemaTesto(this.variabiliGlobali.idUtente) + '&' +
      'idModalitaPagamento=' + this.sistemaTesto(params.idModalitaPagamento) + '&' +
      'Stato=' + this.sistemaTesto(params.Stato) + '&' +
      'Modifica=' + this.sistemaTesto(params.Modifica) + '&' +
      'ImportoManuale=' + this.sistemaTesto(im) + '&' +
      'DescrizioneManuale=' + this.sistemaTesto(params.DescrizioneManuale) + '&' +
      'DataManuale=' + this.sistemaTesto(params.DataManuale)
      ;
    // console.log('Salva Pagamento:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaPagamento(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/EliminaPagamentoGiocatore?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'Progressivo=' + this.sistemaTesto(params.Progressivo) + '&' +
      'idRegistratore=' + this.sistemaTesto(params.idUtente) ;
    // console.log('Elimina Pagamento:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaPagamentiGiocatore(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaPagamentiGiocatore?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  inviaMail(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/InviaMailConAllegato?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'Oggetto=' + this.sistemaTesto(params.Oggetto) + '&' +
      'Body=' + this.sistemaTesto(params.Body) + '&' +
      'Destinatario=' + this.sistemaTesto(params.Destinatario) + '&' +
      'Allegato=' + this.sistemaTesto(params.Allegato) + '&' +
      'AllegatoOMultimedia=' + this.sistemaTesto(params.AllegatoOMultimedia) + '&' +
      'Mittente=' + this.sistemaTesto(params.Mittente);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  inviaMailSollecito(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/InviaSollecitoPagamento?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'Destinatario=' + this.sistemaTesto(params.Destinatario) + '&' +
      'Dati=' + this.sistemaTesto(params.Dati) + '&' +
      'Mittente=' + this.sistemaTesto(params.Mittente);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  stampaListaRicevute(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsQuote.asmx/StampaListaRicevute?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'NomeSquadra=' + this.sistemaTesto(params.NomeSquadra) + '&' +
      'DataInizio=' + this.sistemaTesto(params.DataInizio) + '&' +
      'DataFine=' + this.sistemaTesto(params.DataFine);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaGiocatoriTutti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaGiocatoriTutti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaGiocatoriCategoriaSenzaAltri(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaGiocatoriCategoriaSenzaAltri?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna giocatori Categorie Senza altri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaGiocatoreCategoria(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/EliminaGiocatore?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore);
    // console.log('Elimina giocatore:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  aggiungeGiocatoreAllaCategoria(Squadra, idAnno, idGiocatore, idCategoria) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/AggiungeCategoriaAGiocatore?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
      'idCategoria=' + this.sistemaTesto(idCategoria);
    // console.log('Aggiunge giocatori alla categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaGiocatoreDallaCategoria(Squadra, idAnno, idGiocatore, idCategoria) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/EliminaGiocatoreDallaCategoria?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
      'idCategoria=' + this.sistemaTesto(idCategoria);
    // console.log('Elimina giocatore dalla categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }
  
  ControllaEsistenzaModuloIscrizione(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/ControllaEsistenzaModuloIscrizione?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' + 
        'Anno=' + this.sistemaTesto(params.Anno) + '&' +
        'idGiocatore=' + this.sistemaTesto(params.idGiocatore);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  
  
  ControllaEsistenzaModuloAssociato(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/ControllaEsistenzaModuloAssociato?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' + 
        'Anno=' + this.sistemaTesto(params.Anno) + '&' +
        'idGiocatore=' + this.sistemaTesto(params.idGiocatore);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaDettaglioGiocatore(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/TornaDettaglioGiocatore?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore);
    // console.log('Elimina giocatore dalla categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaGiocatoreCategoria(squadra, idAnno, params, tipoModifica) {
    const i = (params.RapportoCompleto === true ? 'S' : 'N');
    
    this.controlloPresenzaUtente(false);
    // const RC = params.RapportoCompleto === true ? 'S' : 'N';
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/SalvaGiocatore?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'idRuolo=' + this.sistemaTesto(params.idR) + '&' +
      'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
      'Nome=' + this.sistemaTesto(params.Nome) + '&' +
      'EMail=' + this.sistemaTesto(params.EMail) + '&' +
      'Telefono=' + this.sistemaTesto(params.Telefono) + '&' +
      'Soprannome=' + this.sistemaTesto(params.Soprannome) + '&' +
      'DataDiNascita=' + this.sistemaTesto(params.DataDiNascita) + '&' +
      'Indirizzo=' + this.sistemaTesto(params.Indirizzo) + '&' +
      'CodFiscale=' + this.sistemaTesto(params.CodFiscale) + '&' +
      'Maschio=' + this.sistemaTesto(params.Maschio) + '&' +
      'Citta=' + this.sistemaTesto(params.Citta) + '&' +
      'Matricola=' + this.sistemaTesto(params.Matricola) + '&' +
      'NumeroMaglia=' + this.sistemaTesto(params.NumeroMaglia) + '&' +
      'idCategoria2=' + this.sistemaTesto(params.idCategoria2) + '&' +
      'idCategoria3=' + this.sistemaTesto(params.idCategoria3) + '&' +
      'Categorie=' + this.sistemaTesto(params.Categorie) + '&' +
      'RapportoCompleto=' + i + '&' +
      'idTaglia=' + this.sistemaTesto(params.idTaglia) + '&' +
      'Modalita=' + this.sistemaTesto(tipoModifica) + '&' +
      'Cap=' + this.sistemaTesto(params.cap) + '&' +
      'CittaNascita=' + this.sistemaTesto(params.CittaNascita) + '&' +
      'Mittente=' + this.sistemaTesto(this.variabiliGlobali.MittenteMail) 
    ;
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaDettaglioGiocatore(squadra, idAnno, idGiocatore, params) {
    this.controlloPresenzaUtente(false);
    if (params.TotalePagamento === undefined) {
        params.TotalePagamento = this.variabiliGlobali.CostoScuolaCalcio;
    }
    let idTutore = params.idTutore ? params.idTutore : 1;
    /* let tot = params.TotalePagamento.toString();
    if (tot) {
      tot = tot.replace(',', '.');
    } else {
      tot = 0;
    } */
    const Firma1 = params.FirmaGenitore1 === true ? 'S' : 'N';
    const Firma2 = params.FirmaGenitore2 === true ? 'S' : 'N';
    const Firma3 = params.FirmaGenitore3 === true ? 'S' : 'N';
    const Firma4 = params.FirmaGenitore4 === true ? 'S' : 'N';
    const CertMedico = params.CertificatoMedico === true ? 'S' : 'N';
    let sconto = params.Sconto.toString();
    // console.log(sconto);
    if (sconto && sconto !== null && sconto !== '') {
      sconto = sconto.replace(',', '.');
    } else {
      sconto = 0;
    }

    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/SalvaDettaglioGiocatore?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
      'Genitore1=' + this.sistemaTesto(params.Genitore1) + '&' +
      'Genitore2=' + this.sistemaTesto(params.Genitore2) + '&' +
      'FirmaGenitore1=' + this.sistemaTesto(Firma1) + '&' +
      'FirmaGenitore2=' + this.sistemaTesto(Firma2) + '&' +
      'CertificatoMedico=' + this.sistemaTesto(CertMedico) + '&' +
      'TotalePagamento=' + this.sistemaTesto(params.TotalePagamento) + '&' +
      'TelefonoGenitore1=' + this.sistemaTesto(params.TelefonoGenitore1) + '&' +
      'TelefonoGenitore2=' + this.sistemaTesto(params.TelefonoGenitore2) + '&' +
      'ScadenzaCertificatoMedico=' + this.sistemaTesto(params.ScadenzaCertificatoMedico) + '&' +
      'MailGenitore1=' + this.sistemaTesto(params.MailGenitore1) + '&' +
      'MailGenitore2=' + this.sistemaTesto(params.MailGenitore2) + '&' +
      'FirmaGenitore3=' + this.sistemaTesto(Firma3) + '&' +
      'FirmaGenitore4=' + this.sistemaTesto(Firma4) + '&' +
      'MailGenitore3=' + this.sistemaTesto(params.MailGenitore3) + '&' +

      'DataDiNascita1=' + this.sistemaTesto(params.DataDiNascita1) + '&' +
      'CittaNascita1=' + this.sistemaTesto(params.CittaNascita1) + '&' +
      'CodFiscale1=' + this.sistemaTesto(params.CodFiscale1) + '&' +
      'Citta1=' + this.sistemaTesto(params.Citta1) + '&' +
      'Cap1=' + this.sistemaTesto(params.Cap1) + '&' +
      'Indirizzo1=' + this.sistemaTesto(params.Indirizzo1) + '&' +

      'DataDiNascita2=' + this.sistemaTesto(params.DataDiNascita2) + '&' +
      'CittaNascita2=' + this.sistemaTesto(params.CittaNascita2) + '&' +
      'CodFiscale2=' + this.sistemaTesto(params.CodFiscale2) + '&' +
      'Citta2=' + this.sistemaTesto(params.Citta2) + '&' +
      'Cap2=' + this.sistemaTesto(params.Cap2) + '&' +
      'Indirizzo2=' + this.sistemaTesto(params.Indirizzo2) + '&' +

      'GenitoriSeparati=' + (params.GenitoriSeparati === true ? 'S' : 'N') + '&' +
      'AffidamentoCongiunto=' + (params.AffidamentoCongiunto === true ? 'S' : 'N') + '&' +

      'AbilitaFirmaGenitore1=' + (params.AbilitaFirmaGenitore1 === true ? 'S' : 'N') + '&' +
      'AbilitaFirmaGenitore2=' + (params.AbilitaFirmaGenitore2 === true ? 'S' : 'N') + '&' +
      'AbilitaFirmaGenitore3=' + (params.AbilitaFirmaGenitore3 === true ? 'S' : 'N') + '&' +

      'FirmaAnalogicaGenitore1=' + (params.FirmaAnalogicaGenitore1 === true ? 'S' : 'N') + '&' +
      'FirmaAnalogicaGenitore2=' + (params.FirmaAnalogicaGenitore2 === true ? 'S' : 'N') + '&' +
      'FirmaAnalogicaGenitore3=' + (params.FirmaAnalogicaGenitore3 === true ? 'S' : 'N') + '&' +

      'idTutore=' + idTutore + '&' +
      'idQuota=' + params.idQuota + '&' +

      'AbilitaFirmaGenitore4=' + (params.AbilitaFirmaGenitore4 === true ? 'S' : 'N') + '&' +
      'FirmaAnalogicaGenitore4=' + (params.FirmaAnalogicaGenitore4 === true ? 'S' : 'N') + '&' +
      'NoteKit=' + params.NoteKit + '&' +
      'Sconto=' + sconto
      ;

    // console.log('Salva dettaglio giocatore:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaMaxAnno(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGeneraleasmx/RitornaMaxAnno?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log('Ritorna max anno:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  creaNuovoAnno(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGeneraleasmx/CreaNuovoAnno?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'descAnno=' + this.sistemaTesto(params.descAnno) + '&' +
      'nomeSquadra=' + this.sistemaTesto(params.nomeSquadra) + '&' +
      'idAnnoAttuale=' + this.sistemaTesto(params.idAnnoAttuale) + '&' +
      'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
      'CreazioneTuttiIDati=' + this.sistemaTesto(params.CreazioneTuttiIDati);
    // console.log('Crea nuovo anno:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // CATEGORIE
  ritornaCategorie(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCategorie.asmx/RitornaCategorie?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idUtente=' + this.sistemaTesto(params.idUtente);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaCategorieUtente(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCategorie.asmx/RitornaTutteCategorieUtente?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.variabiliGlobali.Anno + '&' +
      'idUtente=' + this.sistemaTesto(params.idUtente);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaCategorie(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCategorie.asmx/SalvaCategorieUtente?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
      'Categorie=' + this.sistemaTesto(params.Categorie);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaTutteCategoriePerAnno(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCategorie.asmx/RitornaCategoriePerAnno?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaCategoria(squadra, idAnno, params, Desc) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCategorie.asmx/SalvaCategoria?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.id) + '&' +
      'Categoria=' + this.sistemaTesto(Desc) + '&' +
      'AnticipoConvocazione=' + this.sistemaTesto(params.Anticipo) + '&' + 
      'RisultatoATempi=' + this.sistemaTesto(params.RisultatoATempi) + '&' + 
      'GiornoAllenamento1=' + this.sistemaTesto(params.GiornoAllenamento1) + '&' + 
      'OraInizio1=' + this.sistemaTesto(params.OraInizio1) + '&' + 
      'OraFine1=' + this.sistemaTesto(params.OraFine1) + '&' + 
      'GiornoAllenamento2=' + this.sistemaTesto(params.GiornoAllenamento2) + '&' + 
      'OraInizio2=' + this.sistemaTesto(params.OraInizio2) + '&' + 
      'OraFine2=' + this.sistemaTesto(params.OraFine2) + '&' + 
      'GiornoAllenamento3=' + this.sistemaTesto(params.GiornoAllenamento3) + '&' + 
      'OraInizio3=' + this.sistemaTesto(params.OraInizio3) + '&' + 
      'OraFine3=' + this.sistemaTesto(params.OraFine3) + '&' + 
      'GiornoAllenamento4=' + this.sistemaTesto(params.GiornoAllenamento4) + '&' + 
      'OraInizio4=' + this.sistemaTesto(params.OraInizio4) + '&' + 
      'OraFine4=' + this.sistemaTesto(params.OraFine4) + '&' + 
      'AnnoCategoria=' + this.sistemaTesto(params.AnnoCategoria) + '&' + 
      'ShootOut=' + (params.ShootOut === true ? 'S' : 'N') + '&' + 
      'Tempi=' + this.sistemaTesto(params.idNumeroTempi)
      ;
    // console.log('Salva categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaCategoria(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCategorie.asmx/EliminaCategoria?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.id);
    // console.log('Elimina Categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // ALLENATORI
  ritornaAllenatori(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenatori.asmx/RitornaAllenatoriCategoria?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna allenatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaAllenatore(squadra, idAnno, categoria, params, tipologia, tendina) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenatori.asmx/SalvaAllenatore?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(categoria) + '&' +
      'idAllenatore=' + this.sistemaTesto(params.idAllenatore) + '&' +
      'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
      'Nome=' + this.sistemaTesto(params.Nome) + '&' +
      'EMail=' + this.sistemaTesto(params.EMail) + '&' +
      'Telefono=' + this.sistemaTesto(params.Telefono) + '&' +      
      'idTipologia=' + this.sistemaTesto(params.idTipologia) + '&' +
      'TipologiaOperazione=' + tipologia + '&' +
      'Tendina=' + (tendina === true ? 'S' : 'N') + '&' +
      'Mittente=' + this.sistemaTesto(this.variabiliGlobali.MittenteMail);
    // console.log('Salva allenatore:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaAllenatore(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenatori.asmx/EliminaAllenatore?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idAllenatore=' + this.sistemaTesto(params.idAllenatore);
    // console.log('Elimina Categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // DIRIGENTI
  ritornaDirigenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsDirigenti.asmx/RitornaDirigentiCategoria?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna dirigenti Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaDirigente(squadra, idAnno, categoria, params, tipologia, tendina) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsDirigenti.asmx/SalvaDirigente?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(categoria) + '&' +
      'idDirigente=' + this.sistemaTesto(params.idDirigente) + '&' +
      'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
      'Nome=' + this.sistemaTesto(params.Nome) + '&' +
      'EMail=' + this.sistemaTesto(params.EMail) + '&' +
      'Telefono=' + this.sistemaTesto(params.Telefono) + '&' +
      'TipologiaOperazione=' + tipologia + '&' +
      'Tendina=' + (tendina === true ? 'S' : 'N') + '&' +
      'Mittente=' + this.sistemaTesto(this.variabiliGlobali.MittenteMail);
    // console.log('Salva dirigente:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaDirigente(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsDirigenti.asmx/EliminaDirigente?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idDirigente=' + this.sistemaTesto(params.idDirigente);
    // console.log('Elimina Categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // AVVERSARI
  RitornaNuovoIDAvversario(Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAvversari.asmx/RitornaNuovoID?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(idAnno);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaAvversari(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAvversari.asmx/RitornaAvversari?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'Ricerca=' + this.sistemaTesto(params.ricerca);
    // console.log('Ritorna avversari:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaAvversario(squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAvversari.asmx/SalvaAvversario?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idAvversario=' + this.sistemaTesto(params.idAvversario) + '&' +
      'idCampo=' + this.sistemaTesto(params.idCampo) + '&' +
      'Avversario=' + this.sistemaTesto(params.Descrizione) + '&' +
      'Campo=' + this.sistemaTesto(params.Campo) + '&' +
      'Indirizzo=' + this.sistemaTesto(params.Indirizzo) + '&' +
      'Coords=' + this.sistemaTesto(params.Lat) + ';' + this.sistemaTesto(params.Lon) + '&' +
      'Telefono=' + this.sistemaTesto(params.Telefono) + '&' +
      'Referente=' + this.sistemaTesto(params.Referente) + '&' +
      'EMail=' + this.sistemaTesto(params.EMail) + '&' +
      'Fax=' + this.sistemaTesto(params.Fax);
    // console.log('Salva avversario:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaAvversario(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAvversari.asmx/EliminaAvversario?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idAvversario=' + this.sistemaTesto(params.idAvversario);
    // console.log('Elimina Avversario:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // UTENTI
  RitornaNuovoIDUtenti(idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/RitornaNuovoID?' +
     'idAnno=' + this.sistemaTesto(idAnno);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaUtenti(Squadra, idAnno, selezione) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/RitornaListaUtenti?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'Selezione=' + this.sistemaTesto(selezione);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaUtenteDaID(idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/RitornaUtenteLocaleDaID?' +
      'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaUtente(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/EliminaUtente?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'IDutente=' + this.sistemaTesto(params.IDutente);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaUtente(Squadra, idAnno, params, tipologia) {
    // console.log('Salva Utente');
    this.controlloPresenzaUtente(false);
    let url = '';    
    if (tipologia !== 'MODIFICA') {
    // console.log(params.IDsinistro);
      url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/SalvaUtente?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(idAnno) + '&' +
        'Utente=' + this.sistemaTesto(params.Utente) + '&' +
        'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
        'Nome=' + this.sistemaTesto(params.Nome) + '&' +
        'EMail=' + this.sistemaTesto(params.EMail) + '&' +
        'Password=' + this.sistemaTesto(params.Password) + '&' +
        'idCategoria=-1&' +
        'idTipologia=' + this.sistemaTesto(params.idTipologia) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'Telefono=' + this.sistemaTesto(params.Telefono) + '&' +
        'AmmOriginale=' + this.sistemaTesto(params.AmmOriginale) + '&' +
        'Mail=' + this.sistemaTesto(params.Mail) + '&' +
        'PWD=' + this.sistemaTesto(params.PWD);
    } else {
      url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/ModificaUtente?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(idAnno) + '&' +
        'Utente=' + this.sistemaTesto(params.Utente) + '&' +
        'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
        'Nome=' + this.sistemaTesto(params.Nome) + '&' +
        'EMail=' + this.sistemaTesto(params.EMail) + '&' +
        'Password=' + this.sistemaTesto(params.Password) + '&' +
        'idCategoria=-1&' +
        'idTipologia=' + this.sistemaTesto(params.idTipologia) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'Telefono=' + this.sistemaTesto(params.Telefono) + '&' +
        'AmmOriginale=' + this.sistemaTesto(params.AmmOriginale) + '&' +
        'Mail=' + this.sistemaTesto(params.Mail) + '&' +
        'PWD=' + this.sistemaTesto(params.PWD);
    }
    while (url.indexOf('undefined') > -1) {
      url = url.replace('undefined', '');
    }
    // console.log(url);
    // return;
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // UTENTI MOBILE
  ritornaUtentiMobile(Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/RitornaListaUtenti?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaUtenteMobile(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/EliminaUtente?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'IDutente=' + this.sistemaTesto(params.IDutente);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaUtenteMobile(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    let url = '';
    if (params.idUtente === -1) {
    // console.log(params.IDsinistro);
      url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/SalvaUtente?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(idAnno) + '&' +
        'Utente=' + this.sistemaTesto(params.Utente) + '&' +
        'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
        'Nome=' + this.sistemaTesto(params.Nome) + '&' +
        'EMail=' + this.sistemaTesto(params.Email) + '&' +
        'Password=' + this.sistemaTesto(params.Password) + '&' +
        'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
        'idTipologia=' + this.sistemaTesto(params.idTipologia);
    } else {
      url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/ModificaUtente?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(idAnno) + '&' +
        'Utente=' + this.sistemaTesto(params.Utente) + '&' +
        'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
        'Nome=' + this.sistemaTesto(params.Nome) + '&' +
        'EMail=' + this.sistemaTesto(params.Email) + '&' +
        'Password=' + this.sistemaTesto(params.Password) + '&' +
        'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
        'idTipologia=' + this.sistemaTesto(params.idTipologia) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente);
    }
    while (url.indexOf('undefined') > -1) {
      url = url.replace('undefined', '');
    }
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // PARTITE
  salvaPartita(Squadra, idAnno, params, MandaMail) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/SalvaPartita?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idPartita=' + this.sistemaTesto(params.idPartita) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'idAvversario=' + this.sistemaTesto(params.idAvversario) + '&' +
      'idAllenatore=' + this.sistemaTesto(params.idAllenatore) + '&' +
      'DataOra=' + this.sistemaTesto(params.DataOra) + '&' +
      'Casa=' + this.sistemaTesto(params.Casa) + '&' +
      'idTipologia=' + this.sistemaTesto(params.idTipologia) + '&' +
      'idCampo=' + this.sistemaTesto(params.idCampo) + '&' +
      'Risultato=' + this.sistemaTesto(params.Risultato) + '&' +
      'Notelle=' + this.sistemaTesto(params.Notelle) + '&' +
      'Marcatori=' + this.sistemaTesto(params.Marcatori) + '&' +
      'Convocati=' + this.sistemaTesto(params.Convocati) + '&' +
      'RisGiochetti=' + this.sistemaTesto(params.RisGiochetti) + '&' +
      'RisAvv=' + this.sistemaTesto(params.RisAvv) + '&' +
      'Campo=' + this.sistemaTesto(params.Campo) + '&' +
      'Tempo1Tempo=' + this.sistemaTesto(params.Tempo1Tempo) + '&' +
      'Tempo2Tempo=' + this.sistemaTesto(params.Tempo2Tempo) + '&' +
      'Tempo3Tempo=' + this.sistemaTesto(params.Tempo3Tempo) + '&' +
      'Coordinate=' + this.sistemaTesto(params.Coordinate) + '&' +
      'sTempo=' + this.sistemaTesto(params.sTempo) + '&' +
      'idUnioneCalendario=' + this.sistemaTesto(params.idUnioneCalendario) + '&' +
      'TGA1=' + this.sistemaTesto(params.TGA1) + '&' +
      'TGA2=' + this.sistemaTesto(params.TGA2) + '&' +
      'TGA3=' + this.sistemaTesto(params.TGA3) + '&' +
      'Dirigenti=' + this.sistemaTesto(params.Dirigenti) + '&' +
      'idArbitro=' + this.sistemaTesto(params.idArbitro) + '&' +
      'RisultatoATempi=' + this.sistemaTesto(params.RisultatoATempi) + '&' +
      'RigoriPropri=' + this.sistemaTesto(params.RigoriPropri) + '&' +
      'RigoriAvv=' + this.sistemaTesto(params.RigoriAvv) + '&' +
      'EventiPrimoTempo=' + this.sistemaTesto(params.EventiPrimoTempo) + '&' +
      'EventiSecondoTempo=' + this.sistemaTesto(params.EventiSecondoTempo) + '&' +
      'EventiTerzoTempo=' + this.sistemaTesto(params.EventiTerzoTempo) + '&' +
      'Mittente=' + this.sistemaTesto(this.variabiliGlobali.MittenteMail) + '&' +
      'DataOraAppuntamento=' + this.sistemaTesto(params.DataOraAppuntamento) + '&' +
      'LuogoAppuntamento=' + this.sistemaTesto(params.LuogoAppuntamento) + '&' +
      'MezzoTrasporto=' + this.sistemaTesto(params.MezzoTrasporto) + '&' +
      'MandaMail=' + MandaMail + '&' +
      'InFormazione=' + this.sistemaTesto(params.InFormazione) + '&' +
      'ShootOut=' + (params.ShootOut === true ? 'S' : 'N') + '&' +
      'Tempi=' + this.sistemaTesto(params.idNumeroTempi) + '&' +
      'PartitaConRigori=' + (params.PartitaConRigori === true ? 'S' : 'N') + '&' +
      'idCapitano=-1&' +
      'CreaSchedaPartita=N' + '&' +
      'TempiGoalAvversari1T=;;;;;;;;;;&' +
      'TempiGoalAvversari2T=;;;;;;;;;;&' +
      'TempiGoalAvversari3T=;;;;;;;;;;'
    ;

    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaPartite(Squadra, idAnno, idCategoria) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/RitornaPartite?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(idCategoria);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaMultimediaPartita(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMultimedia.asmx/RitornaMultimedia?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'id=' + this.sistemaTesto(params.idPartita) + '&' +
      'Tipologia=' + this.sistemaTesto(params.Tipologia);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaPartitaGEN(Squadra, idAnno, idPartita) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/EliminaPartitaGEN?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idPartita=' + this.sistemaTesto(idPartita);
    // console.log('Elimina partita GEN:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  creaConvocazionePartita(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/CreaFoglioConvocazioni?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idPartita=' + this.sistemaTesto(params.idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  stampaConvocazionePartita(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/CreaFoglioConvocazionePDF?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idPartita=' + this.sistemaTesto(params.idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  inviaConvocazionePartita(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/InviaFoglioConvocazionePDF?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idPartita=' + this.sistemaTesto(params.idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaPartita(Squadra, idAnno, idPartita) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/RitornaPartitaDaID?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idPartita=' + this.sistemaTesto(idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaTipologie(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/RitornaTipologie?Squadra=' + this.sistemaTesto(Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  /* ritornaPermessi(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPermessi.asmx/RitornaPermessi?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'IDutente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  } */

  salvaPermessi(Squadra, idUtente, Permessi) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPermessiUtente.asmx/SalvaPermessiUtente?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'IDutente=' + this.sistemaTesto(idUtente) + '&' +
      'Permessi=' + this.sistemaTesto(Permessi);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaPermessiMaschere(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPermessiUtente.asmx/RitornaPermessiUtente?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'IDutente=' + this.sistemaTesto(idUtente) + '&' + 
      'idTipologia=' + this.variabiliGlobali.idTipologia;
    // console.log('Ritorna permessi maschere', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaFunzioni(idTipologia) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/RitornaFunzioni?' +
      'idTipologia=' + this.sistemaTesto(idTipologia);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  aggiungeFunzione(idPermesso, idTipologia) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/InserisciFunzione?' +
        'IDfunzione=' + this.sistemaTesto(idPermesso) + '&' +
        'idTipologia=' + this.sistemaTesto(idTipologia);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaFunzione(idPermesso, idTipologia) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/EliminaFunzioni?' +
        'IDfunzione=' + this.sistemaTesto(idPermesso) + '&' +
        'idTipologia=' + this.sistemaTesto(idTipologia);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaTutteLeFunzioni(idTipologia) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/RitornaTutteLeFunzioni?' +
      'idTipologia=' + this.sistemaTesto(idTipologia);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaFunzionalita() {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/RitornaFunzionalita';
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaFunzionalita(idPermesso) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/EliminaFunzionalita?' +
      'idPermesso=' + this.sistemaTesto(idPermesso);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  aggiungeFunzionalita(struttura) {
    this.controlloPresenzaUtente(false);
    let url = '';
    if (struttura.idPermesso === -1) {
        url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/InserisciFunzionalita?' +
            'Descrizione=' + this.sistemaTesto(struttura.Descrizione) + '&' +
            'Codice=' + this.sistemaTesto(struttura.Codice.toUpperCase().trim())
        ;
    } else {
        url = this.variabiliGlobali.urlWS + 'wsFunzioni.asmx/ModificaFunzionalita?' +
            'idPermesso=' + this.sistemaTesto(struttura.idPermesso) + '&' +
            'Descrizione=' + this.sistemaTesto(struttura.Descrizione) + '&' +
            'Codice=' + this.sistemaTesto(struttura.Codice.toUpperCase().trim())
        ;
    }
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaMaschere(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPermessiUtente.asmx/RitornaTuttiPermessiUtente?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
      'idTipologia=' + this.variabiliGlobali.idTipologiaPermessi;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  /* inserisceFunzione(Squadra, IDutente, IDfunzione) {
    this.controlloPresenzaUtente(false);
    // console.log(params.IDsinistro);
    let url = this.variabiliGlobali.urlWS + 'wsPermessi.asmx/InserisciPermesso?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'IDutente=' + this.sistemaTesto(IDutente) + '&' +
      'progressivo=-1&' +
      'permesso=' + this.sistemaTesto(IDfunzione);
    while (url.indexOf('undefined') > -1) {
      url = url.replace('undefined', '');
    }
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  } */

  inserisceMaschera(Squadra, IDutente, IDfunzione) {
    this.controlloPresenzaUtente(false);
    // console.log(params.IDsinistro);
    let url = this.variabiliGlobali.urlWS + 'wsPermessiUtente.asmx/InserisciPermessiUtente?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'IDutente=' + this.sistemaTesto(IDutente) + '&' +
      'progressivo=-1&' +
      'permesso=' + this.sistemaTesto(IDfunzione);
    while (url.indexOf('undefined') > -1) {
      url = url.replace('undefined', '');
    }
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  /* eliminaFunzione(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPermessi.asmx/EliminaPermesso?' +
      'IDutente=' + this.sistemaTesto(params.IDutente) + '&' +
      'progressivo=' + this.sistemaTesto(params.progressivo);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  } */

  eliminaMaschera(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPermessiUtente.asmx/EliminaPermessiUtente?' +
      'IDutente=' + this.sistemaTesto(params.IDutente) + '&' +
      'progressivo=' + this.sistemaTesto(params.progressivo);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaImpostazioni() {
    this.controlloPresenzaUtente(false);
    let l = null;
    if (this.variabiliGlobali.Coordinate) {
        l = this.variabiliGlobali.Coordinate.split(';');
    } else {
        l = new Array();
        l.push('');
        l.push('');
    }
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/SalvaImpostazioni?' +
      'Cod_Squadra=' + this.sistemaTesto(this.variabiliGlobali.CodAnnoSquadra) + '&' +
      'idAnno=' + this.sistemaTesto(this.variabiliGlobali.Anno) + '&' +
      'Descrizione=' + this.sistemaTesto(this.variabiliGlobali.DescrizioneAnno) + '&' +
      'NomeSquadra=' + this.sistemaTesto(this.variabiliGlobali.Squadra) + '&' +
      'Lat=' + this.sistemaTesto(l[0]) + '&' +
      'Lon=' + this.sistemaTesto(l[1]) + '&' +
      'Indirizzo=' + this.sistemaTesto(this.variabiliGlobali.Indirizzo) + '&' +
      'CampoSquadra=' + this.sistemaTesto(this.variabiliGlobali.CampoSquadra) + '&' +
      'NomePolisportiva=' + this.sistemaTesto(this.variabiliGlobali.NomePolisportiva) + '&' +
      'Mail=' + this.sistemaTesto(this.variabiliGlobali.Mail) + '&' +
      'PEC=' + this.sistemaTesto(this.variabiliGlobali.PEC) + '&' +
      'Telefono=' + this.sistemaTesto(this.variabiliGlobali.Telefono2) + '&' +
      'PIva=' + this.sistemaTesto(this.variabiliGlobali.PIva) + '&' +
      'CodiceFiscale=' + this.sistemaTesto(this.variabiliGlobali.CodiceFiscale) + '&' +
      'CodiceUnivoco=' + this.sistemaTesto(this.variabiliGlobali.CodiceUnivoco) + '&' +
      'SitoWeb=' + this.sistemaTesto(this.variabiliGlobali.SitoWeb) + '&' +
      'MittenteMail=' + this.sistemaTesto(this.variabiliGlobali.MittenteMail) + '&' +
      'GestionePagamenti=' + (this.variabiliGlobali.NumerazioneManuale === true ? 'S' : 'N') + '&' +
      'CostoScuolaCalcio=' + this.sistemaTesto(this.variabiliGlobali.CostoScuolaCalcio) + '&' +
      'idUtente=' + this.sistemaTesto(this.variabiliGlobali.idUtente) + '&' +
      'Widgets=' + this.sistemaTesto(this.variabiliGlobali.WidgetSelezionati) + '&' +
      'Suffisso=' + this.sistemaTesto(this.variabiliGlobali.suffisso) + '&' +
      'IscrFirmaEntrambi=' + (this.variabiliGlobali.iscrFirmaEntrambi === true ? 'S' : 'N') + '&' +
      'PercCashBack=' + this.variabiliGlobali.PercCashBack.toString().replace(',', '.') + '&' +
      'ModuloAssociato=' + (this.variabiliGlobali.stampaModuloAssociato === true ? 'S' : 'N') + '&' +
      'RateManuali=' + (this.variabiliGlobali.rateManuali === true ? 'S' : 'N') + '&' +
      'Cashback=' + (this.variabiliGlobali.Cashback === true ? 'S' : 'N')
      ;
    // console.log('Salva impostazioni:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaImpostazioni(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/RitornaImpostazioni?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // METODI PAGAMENTO
  ritornaMetodiPagamento(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMetodiPagamento.asmx/RitornaMetodiPagamento?Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaMetodoPagamento(Squadra, idMetodoPagamento) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMetodiPagamento.asmx/EliminaMetodoPagamento?Squadra=' + this.sistemaTesto(Squadra) + '&idMetodoPagamento=' + this.sistemaTesto(idMetodoPagamento);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaMetodoPagamento(Squadra, idMetodoPagamento, Descrizione) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMetodiPagamento.asmx/SalvaMetodoPagamento?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idMetodoPagamento=' + this.sistemaTesto(idMetodoPagamento) + '&' +
      'MetodoPagamento=' + this.sistemaTesto(Descrizione);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // EVENTI
  ritornaEventi(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventi.asmx/RitornaEventi?Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaEvento(Squadra, idEvento) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventi.asmx/EliminaEvento?Squadra=' + this.sistemaTesto(Squadra) + '&idEvento=' + this.sistemaTesto(idEvento);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaEvento(Squadra, idEvento, Descrizione) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventi.asmx/SalvaEvento?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idEvento=' + this.sistemaTesto(idEvento) + '&' +
      'Evento=' + this.sistemaTesto(Descrizione);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // ARBITRI
  ritornaArbitri(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsArbitri.asmx/RitornaArbitri?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaArbitro(Squadra, idAnno, idCategoria, idArbitro) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsArbitri.asmx/EliminaArbitro?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      // 'idCategoria=' + this.sistemaTesto(idCategoria) + '&' +
      'idArbitro=' + this.sistemaTesto(idArbitro);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaArbitro(Squadra, idAnno, idCategoria, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsArbitri.asmx/SalvaArbitro?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(idCategoria) + '&' +
      'idArbitro=' + this.sistemaTesto(params.idArbitro) + '&' +
      'Cognome=' + this.sistemaTesto(params.Cognome) + '&' +
      'Nome=' + this.sistemaTesto(params.Nome) + '&' +
      'EMail=' + this.sistemaTesto(params.EMail) + '&' +
      'Telefono=' + this.sistemaTesto(params.Telefono);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // STATISTICHE
  ritornaStatistiche(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsStatistiche.asmx/' + this.sistemaTesto(params.Tipologia) + '?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'SoloAnno=' + this.sistemaTesto(params.SoloAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // ALLENAMENTI
  ritornaOreAllenamenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenamenti.asmx/RitornaOreAllenamenti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'Data=' + this.sistemaTesto(params.Data);
    // console.log('Ritorna allenamenti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaAllenamenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenamenti.asmx/RitornaAllenamentiCategoria?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria);
    // console.log('Ritorna allenamenti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaAllenamentiGiorno(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenamenti.asmx/RitornaAllenamentiCategoriaGiorno?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'Data=' + this.sistemaTesto(params.Data) + '&' +
      'Ora=' +  this.sistemaTesto(params.Ora) + '&' +
      'Stampa=' +  this.sistemaTesto(params.Stampa);
    // console.log('Ritorna allenamenti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaStatisticheAllenamenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsStatAllenamenti.asmx/RitornaStatAllenamentiCategoria?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'Mese=' + this.sistemaTesto(params.Mese) + '&' +
      'NomeSquadra=' + this.sistemaTesto(params.NomeSquadra) + '&' +
      'Stampa=' + this.sistemaTesto(params.Stampa);
    // console.log('Ritorna allenamenti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaInfoAllenamenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsStatAllenamenti.asmx/RitornaInfo?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'Mese=' + this.sistemaTesto(params.Mese) + '&' +
      'NomeSquadra=' + this.sistemaTesto(params.NomeSquadra) + '&' +
      'Stampa=' + this.sistemaTesto(params.Stampa);
    // console.log('Ritorna allenamenti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaAllenamenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenamenti.asmx/EliminaAllenamenti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'Data=' + this.sistemaTesto(params.Data) + '&' +
      'Ora=' + this.sistemaTesto(params.Ora) + '&' +
      'OraFine=' + this.sistemaTesto(params.OraFine);
    // console.log('Salva allenamenti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaAllenamenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenamenti.asmx/SalvaAllenamenti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'Data=' + this.sistemaTesto(params.Data) + '&' +
      'Ora=' + this.sistemaTesto(params.Ora) + '&' +
      'Giocatori=' + this.sistemaTesto(params.Giocatori) + '&' +
      'OraFine=' + this.sistemaTesto(params.OraFine);
    // console.log('Salva allenamenti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  prendeSoloDatiValidi(s) {
    let ss = s;

    let a1 = ss.indexOf('<string');
    if (a1 > -1) {
      ss = ss.substring(a1, ss.length);
      a1 = ss.indexOf('>');
      if (a1 > -1) {
        ss = ss.substring(a1 + 1, ss.length);
        a1 = ss.indexOf('</string>');
        if (a1 > -1) {
          ss = ss.substring(0, a1);
        }
      }
    }

    ss = this.cambiaChar(ss, '&amp;', '&');
    ss = this.cambiaChar(ss, '&lt;', '<');
    ss = this.cambiaChar(ss, '&gt;', '>');
    ss = this.cambiaChar(ss, '&num;', '#');
    ss = this.cambiaChar(ss, '&lcub; &lbrace;', '{');
    ss = this.cambiaChar(ss, '&lcub;', '{');
    ss = this.cambiaChar(ss, '&lbrace;', '{');
    ss = this.cambiaChar(ss, '&lcub;&lbrace;', '{');
    ss = this.cambiaChar(ss, '&rcub; &rbrace;', '}');
    ss = this.cambiaChar(ss, '&rcub;', '}');
    ss = this.cambiaChar(ss, '&rbrace;', '}');
    ss = this.cambiaChar(ss, '&rcub;&rbrace;', '}');
    ss = this.cambiaChar(ss, '&verbar;', '|');
    ss = this.cambiaChar(ss, '&vert;', '|');
    ss = this.cambiaChar(ss, '&VerticalLine;', '|');
    ss = this.cambiaChar(ss, '&bsol;', '\\');
    ss = this.cambiaChar(ss, '&circ;', '^');
    ss = this.cambiaChar(ss, '&tilde;', '~');
    ss = this.cambiaChar(ss, '&lsqb;', '[');
    ss = this.cambiaChar(ss, '&lbrack;', '[');
    ss = this.cambiaChar(ss, '&rsqb;', ']');
    ss = this.cambiaChar(ss, '&rbrack;', ']');
    ss = this.cambiaChar(ss, '&grave;', '`');
    ss = this.cambiaChar(ss, '&semi;', ';');
    ss = this.cambiaChar(ss, '&sol;', '/');
    ss = this.cambiaChar(ss, '&quest;', '?');
    ss = this.cambiaChar(ss, '&colon;', ':');
    ss = this.cambiaChar(ss, '&commat;', '@');
    ss = this.cambiaChar(ss, '&equals;', '=');
    ss = this.cambiaChar(ss, '&dollar;', '$');

    setTimeout(() => {
        // console.log('Spengo attesa');
        this.variabiliGlobali.caricamentoInCorsoGlobale = false;
    }, 10);

    return ss;
  }

  // CAMPIONATO
  ritornaSquadreCampionato(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCampionato.asmx/RitornaCampionatoCategoria?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'idUtente=' + this.sistemaTesto(params.idUtente);
    // console.log('Ritorna campionato categoria:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  aggiungeSquadraAvversaria(squadra, idAnno, idCategoria, idAvversario) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCampionato.asmx/AggiungeSquadraAvversaria?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(idCategoria) + '&' +
      'idAvversario=' + this.sistemaTesto(idAvversario)
      ;
    // console.log('Aggiunge avversario:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaSquadraAvversaria(squadra, idAnno, idCategoria, idAvversario) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCampionato.asmx/EliminaSquadraAvversaria?' +
      'Squadra=' + this.sistemaTesto(squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(idCategoria) + '&' +
      'idAvversario=' + this.sistemaTesto(idAvversario)
      ;
    // console.log('Elimina avversario:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  caricaClassificaCampionato(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCampionato.asmx/CalcolaClassificaAllaGiornata?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'idGiornata=' + this.sistemaTesto(params.idGiornata) + '&' +
      'idUtente=' + this.sistemaTesto(params.idUtente)
      ;
    // console.log('Calcola classifica:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

 aggiungePartitaCampionato(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCampionato.asmx/InserisceNuovaPartita?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiornata=' + this.sistemaTesto(params.idGiornata) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'Data=' + this.sistemaTesto(params.Data) + '&' +
      'Ora=' + this.sistemaTesto(params.Ora) + '&' +
      'Casa=' + this.sistemaTesto(params.Casa) + '&' +
      'Fuori=' + this.sistemaTesto(params.Fuori)
      ;
    // console.log('Aggiunge partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  modificaPartitaAltri(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCampionato.asmx/ModificaPartitaAltre?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiornata=' + this.sistemaTesto(params.idGiornata) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'Data=' + this.sistemaTesto(params.Data) + '&' +
      'Ora=' + this.sistemaTesto(params.Ora) + '&' +
      'Casa=' + this.sistemaTesto(params.Casa) + '&' +
      'Fuori=' + this.sistemaTesto(params.Fuori) + '&' +
      'idUnioneCalendario=' + this.sistemaTesto(params.idUnioneCalendario) + '&' +
      'ProgressivoPartita=' + this.sistemaTesto(params.Progressivo) + '&' +
      'Risultato=' + this.sistemaTesto(params.Risultato)
      ;
    // console.log('Modifica partita altri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaPartita(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCampionato.asmx/EliminaPartita?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiornata=' + this.sistemaTesto(params.idGiornata) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria) + '&' +
      'idPartita=' + this.sistemaTesto(params.idPartita)
      ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // KIT
  ritornaElementiKit(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/RitornaElementiKit?' +
      'Squadra=' + this.sistemaTesto(params.Squadra)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaElementoKit(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/EliminaElementoKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idElemento=' + this.sistemaTesto(params.idElemento)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaElementoKit(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/InserisceElementoKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  modificaElementoKit(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/ModificaElementoKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idElemento=' + this.sistemaTesto(params.idElemento) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaTipologieKit(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/RitornaTipologieKit?' +
      'Squadra=' + this.sistemaTesto(params.Squadra)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaTipologiaKit(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/EliminaTipologiaKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idTipoKit=' + this.sistemaTesto(params.idTipoKit)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaTipologiaKit(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/InserisceTipologiaKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'Nome=' + this.sistemaTesto(params.Nome) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione)
    ;
    // console.log('Salva tipologia kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  modificaTipologiaKit(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/ModificaTipologiaKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idElemento=' + this.sistemaTesto(params.idTipoKit) + '&' +
      'Nome=' + this.sistemaTesto(params.Nome) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione)
    ;
    // console.log('Modifica Tipologia Kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  caricaDettaglioKit(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/RitornaDettaglioKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idTipoKit=' + this.sistemaTesto(params.idTipoKit)
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  aggiungeDettaglioKit(Squadra, idAnno, idTipoKit, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/InserisceDettaglioKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idTipoKit=' + this.sistemaTesto(idTipoKit) + '&' +
      'idElemento=' + this.sistemaTesto(params.idElemento) + '&' +
      'Quantita=' + this.sistemaTesto(params.Quantita)
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  modificaDettaglioKit(Squadra, idAnno, idTipoKit, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/ModificaDettaglioKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idTipoKit=' + this.sistemaTesto(idTipoKit) + '&' +
      'Progressivo=' + this.sistemaTesto(params.Progressivo) + '&' +
      'idElemento=' + this.sistemaTesto(params.idElemento) + '&' +
      'Quantita=' + this.sistemaTesto(params.Quantita)
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaDettaglioKit(Squadra, idAnno, idTipoKit, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/EliminaDettaglioKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idTipoKit=' + this.sistemaTesto(idTipoKit) + '&' +
      'Progressivo=' + this.sistemaTesto(params.Progressivo)
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  SelezioneKitGiocatore(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/SelezioneKitGiocatore?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'idTipoKit=' + this.sistemaTesto(params.idTipoKit)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  RitornaKitGiocatore(Squadra, idAnno, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/RitornaKitGiocatore?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  RitornaIDKitGiocatore(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/RitornaIDKitGiocatore?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore)
    ;
    // console.log('Elimina partita:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  SalvaKitGiocatore(Squadra, idGiocatore, Dettaglio) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/SalvaKitGiocatore?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
      'Dettagli=' + this.sistemaTesto(Dettaglio)
    ;
    // console.log('Salva Kit Giocatore:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  refreshKit(Squadra, idGiocatore,idTipoKit) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsKit.asmx/RefreshKit?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
      'idTipoKit=' + this.sistemaTesto(idTipoKit)
    ;
    // console.log('Refresh Kit Giocatore:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // TAGLIE
  ritornaTaglie(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTaglie.asmx/RitornaTaglie?' +
      'Squadra=' + this.sistemaTesto(params.Squadra)
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaTaglia(Squadra, idTaglia) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTaglie.asmx/EliminaTaglia?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idTaglia=' + this.sistemaTesto(idTaglia)
    ;
    // console.log('Elimina taglia:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaTaglia(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTaglie.asmx/InserisceTaglia?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione)
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  modificaTaglia(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTaglie.asmx/ModificaTaglia?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idTaglia=' + this.sistemaTesto(params.idTaglia) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione)
    ;
    // console.log('Modifica taglia:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // Quote
  RitornaInadempienti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsQuote.asmx/RitornaInadempienti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaQuote(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsQuote.asmx/RitornaQuote?' +
        'Squadra=' + this.sistemaTesto(params.Squadra)
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaRicevute(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsQuote.asmx/RitornaRicevute?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaQuota(Squadra, idQuota) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsQuote.asmx/EliminaQuota?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idQuota=' + this.sistemaTesto(idQuota)
    ;
    // console.log('Elimina taglia:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaQuota(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsQuote.asmx/InserisceQuota?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'Descrizione=' + this.sistemaTesto(params.Descrizione) + '&' +
        'Importo=' + this.sistemaTesto(params.Importo) + '&' +
        'AttivaR1=' + (params.AttivaR1 === true ? 'S' : 'N') + '&' +
        'DescRataR1=' + this.sistemaTesto(params.DescrizioneR1) + '&' +
        'DataScadenzaR1=' + this.sistemaTesto(params.ScadenzaR1) + '&' +
        'ImportoR1=' + this.sistemaTesto(params.ImportoR1) + '&' +
        'AttivaR2=' + (params.AttivaR2 === true ? 'S' : 'N') + '&' +
        'DescRataR2=' + this.sistemaTesto(params.DescrizioneR2) + '&' +
        'DataScadenzaR2=' + this.sistemaTesto(params.ScadenzaR2) + '&' +
        'ImportoR2=' + this.sistemaTesto(params.ImportoR2) + '&' +
        'AttivaR3=' + (params.AttivaR3 === true ? 'S' : 'N') + '&' +
        'DescRataR3=' + this.sistemaTesto(params.DescrizioneR3) + '&' +
        'DataScadenzaR3=' + this.sistemaTesto(params.ScadenzaR3) + '&' +
        'ImportoR3=' + this.sistemaTesto(params.ImportoR3) + '&' +
        'AttivaR4=' + (params.AttivaR4 === true ? 'S' : 'N') + '&' +
        'DescRataR4=' + this.sistemaTesto(params.DescrizioneR4) + '&' +
        'DataScadenzaR4=' + this.sistemaTesto(params.ScadenzaR4) + '&' +
        'ImportoR4=' + this.sistemaTesto(params.ImportoR4) + '&' +
        'AttivaR5=' + (params.AttivaR5 === true ? 'S' : 'N') + '&' +
        'DescRataR5=' + this.sistemaTesto(params.DescrizioneR5) + '&' +
        'DataScadenzaR5=' + this.sistemaTesto(params.ScadenzaR5) + '&' +
        'ImportoR5=' + this.sistemaTesto(params.ImportoR5) + '&' +
        'Deducibilita=' + (params.Deducibilita === true ? 'S' : 'N') + '&' +
        'QuotaManuale=' + (params.QuotaManuale === true ? 'S' : 'N')
    ;
    // console.log('Carica dettaglio kit:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  modificaQuota(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsQuote.asmx/ModificaQuota?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idQuota=' + this.sistemaTesto(params.idQuota) + '&' +
        'Descrizione=' + this.sistemaTesto(params.Descrizione) + '&' +
        'Importo=' + this.sistemaTesto(params.Importo) + '&' +
        'AttivaR1=' + (params.AttivaR1 === true ? 'S' : 'N') + '&' +
        'DescRataR1=' + this.sistemaTesto(params.DescrizioneR1) + '&' +
        'DataScadenzaR1=' + this.sistemaTesto(params.ScadenzaR1) + '&' +
        'ImportoR1=' + this.sistemaTesto(params.ImportoR1) + '&' +
        'AttivaR2=' + (params.AttivaR2 === true ? 'S' : 'N') + '&' +
        'DescRataR2=' + this.sistemaTesto(params.DescrizioneR2) + '&' +
        'DataScadenzaR2=' + this.sistemaTesto(params.ScadenzaR2) + '&' +
        'ImportoR2=' + this.sistemaTesto(params.ImportoR2) + '&' +
        'AttivaR3=' + (params.AttivaR3 === true ? 'S' : 'N') + '&' +
        'DescRataR3=' + this.sistemaTesto(params.DescrizioneR3) + '&' +
        'DataScadenzaR3=' + this.sistemaTesto(params.ScadenzaR3) + '&' +
        'ImportoR3=' + this.sistemaTesto(params.ImportoR3) + '&' +
        'AttivaR4=' + (params.AttivaR4 === true ? 'S' : 'N') + '&' +
        'DescRataR4=' + this.sistemaTesto(params.DescrizioneR4) + '&' +
        'DataScadenzaR4=' + this.sistemaTesto(params.ScadenzaR4) + '&' +
        'ImportoR4=' + this.sistemaTesto(params.ImportoR4) + '&' +
        'AttivaR5=' + (params.AttivaR5 === true ? 'S' : 'N') + '&' +
        'DescRataR5=' + this.sistemaTesto(params.DescrizioneR5) + '&' +
        'DataScadenzaR5=' + this.sistemaTesto(params.ScadenzaR5) + '&' +
        'ImportoR5=' + this.sistemaTesto(params.ImportoR5) + '&' +
        'Deducibilita=' + (params.Deducibilita === true ? 'S' : 'N') + '&' +
        'QuotaManuale=' + (params.QuotaManuale === true ? 'S' : 'N')
    ;
    // console.log('Modifica taglia:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }
    
  // ALLEGATI
  ritornaAllegati(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllegati.asmx/RitornaAllegati?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'Categoria=' + this.sistemaTesto(params.Categoria) + '&' +
      'ID=' + this.sistemaTesto(params.ID);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaAllegati(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllegati.asmx/EliminaAllegati?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'Categoria=' + this.sistemaTesto(params.Categoria) + '&' +
      'ID=' + this.sistemaTesto(params.ID) + '&' +
      'NomeDocumento=' + this.sistemaTesto(params.NomeDocumento);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // UTILITY
  sistemaImmagini(Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/SistemaImmagini?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno);
    // console.log('Ritorna Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // MASCHERE
  /* ritornaMaschereM(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMaschere.asmx/RitornaMaschere?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaMascheraM(Squadra, idFunzione) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMaschere.asmx/EliminaMaschera?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idFunzione=' + this.sistemaTesto(idFunzione);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaMascheraM(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMaschere.asmx/SalvaMaschera?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idFunzione=' + this.sistemaTesto(params.idFunzione) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione) + '&' +
      'NomePerCodice=' + this.sistemaTesto(params.NomePerCodice)
      ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  } */
  // MASCHERE

  eliminaImmagine(Tipologia, Squadra, NomeFile) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMultimedia.asmx/EliminaImmagine?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'Tipologia=' + this.sistemaTesto(Tipologia) + '&' +
        'NomeFile=' + this.sistemaTesto(NomeFile);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  inviaMailDimenticata(userName) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/RitornaMailDimenticata?' +
        'Utente=' + this.sistemaTesto(userName);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  impostaPassword(userName, pwd) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/ImpostaPasswordDimenticata?' +
        'Utente=' + this.sistemaTesto(userName) + '&' +
        'PWD=' + this.sistemaTesto(pwd);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  richiedeFirma(Squadra, idGiocatore, Genitore, Privacy) {
    this.controlloPresenzaUtente(false);
    let sPrivacy = Privacy;
    if (+Genitore === 4) {
        sPrivacy = 'N';
    }
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RichiedeFirma?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'CodSquadra=' + this.sistemaTesto(this.variabiliGlobali.CodAnnoSquadra) + '&' +
        'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
        'Genitore=' + this.sistemaTesto(Genitore) + '&' +
        'Mittente=' + this.sistemaTesto(this.variabiliGlobali.MittenteMail) + '&' +
        'Privacy=' + this.sistemaTesto(sPrivacy);
    console.log('Richiede Firma:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  richiedeFirmaSegreteria(Squadra, Mail, Mittente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/RichiedeFirma?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idUtente=' + this.sistemaTesto(this.variabiliGlobali.idUtente) + '&' +
        'CodSquadra=' + this.sistemaTesto(this.variabiliGlobali.CodAnnoSquadra) + '&' +
        'Mail=' + this.sistemaTesto(Mail) + '&' +
        'Privacy=N' + '&' +
        'Mittente=' + this.sistemaTesto(Mittente); //  + this.sistemaTesto(this.variabiliGlobali.Privacy);
    // console.log('Richiede Firma:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  eliminaFirma(Squadra, idGiocatore, Genitore) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/EliminaFirma?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
      'idGenitore=' + this.sistemaTesto(Genitore);
    // console.log('Richiede Firma:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  convalidaFirma(Anno, Squadra, idGiocatore, Genitore) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/ConvalidaFirma?' +
        'idAnno=' + this.sistemaTesto(Anno) + '&' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
        'idGenitore=' + this.sistemaTesto(Genitore) + '&' +
        'Mittente=' + this.sistemaTesto(this.variabiliGlobali.MittenteMail);
    // console.log('Richiede Firma:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaNuovoIdCategoria(Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsCategorie.asmx/RitornaNuovoID?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaNuovoIdAllenatore(Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsAllenatori.asmx/RitornaNuovoID?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaNuovoIdDirigente(Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsDirigenti.asmx/RitornaNuovoID?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaNuovoIdArbitro(Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsArbitri.asmx/RitornaNuovoID?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  // REMINDER
  ritornaEventiReminder(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventiReminder.asmx/RitornaEventi?Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNuovoIDRem(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventiReminder.asmx/RitornaNuovoID?Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  salvaEventoReminder(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const ad = params.allDay === true ? 'S' : 'N';

    const url = this.variabiliGlobali.urlWS + 'wsEventiReminder.asmx/SalvaEvento?' + 
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idEvento=' + this.sistemaTesto(params.id) + '&' +
        'idTipologia=' + this.sistemaTesto(params.tipologiaEvento) + '&' +
        'Titolo=' + this.sistemaTesto(params.title) + '&' +
        'Inizio=' + this.sistemaTesto(params.start) + '&' +
        'Fine=' + this.sistemaTesto(params.end) + '&' +
        'TuttiIGiorni=' + ad + '&' +
        'ColorePrimario=' + this.sistemaTesto(params.color.primary) + '&' +
        'ColoreSecondario=' + this.sistemaTesto(params.color.secondary) + '&' +
        'metaLocation=' + this.sistemaTesto(params.meta.location) + '&' +
        'metaNotes=' + this.sistemaTesto(params.meta.notes) + '&' +
        'idPartita=' + this.sistemaTesto(params.idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaEventoReminder(Squadra, idEvento) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventiReminder.asmx/EliminaEvento?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idAnno=' + this.variabiliGlobali.Anno + '&' +
        'idEvento=' + idEvento;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  modificaEventoReminder(Squadra, params, start, end) {
    this.controlloPresenzaUtente(false);
    const ad = params.allDay === true ? 'S' : 'N';

    const url = this.variabiliGlobali.urlWS + 'wsEventiReminder.asmx/ModificaEvento?' + 
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idEvento=' + this.sistemaTesto(params.id) + '&' +
        'idTipologia=' + this.sistemaTesto(params.tipologiaEvento) + '&' +
        'Titolo=' + this.sistemaTesto(params.title) + '&' +
        'Inizio=' + start + '&' +
        'Fine=' + end + '&' +
        'TuttiIGiorni=' + ad + '&' +
        'ColorePrimario=' + this.sistemaTesto(params.color.primary) + '&' +
        'ColoreSecondario=' + this.sistemaTesto(params.color.secondary) + '&' +
        'metaLocation=' + this.sistemaTesto(params.meta.location) + '&' +
        'metaNotes=' + this.sistemaTesto(params.meta.notes) + '&' +
        'idPartita=' + this.sistemaTesto(params.idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  // CONVOCAZIONI
  ritornaEventiConvocazioni(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventiConvocazioni.asmx/RitornaEventi?Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNuovoIDConv(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventiConvocazioni.asmx/RitornaNuovoID?Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  salvaEventoConvocazioni(Squadra, params) {
    this.controlloPresenzaUtente(false);
    const ad = params.allDay === true ? 'S' : 'N';

    const url = this.variabiliGlobali.urlWS + 'wsEventiConvocazioni.asmx/SalvaEvento?' + 
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idEvento=' + this.sistemaTesto(params.id) + '&' +
        'idTipologia=' + this.sistemaTesto(params.tipologiaEvento) + '&' +
        'Titolo=' + this.sistemaTesto(params.title) + '&' +
        'Inizio=' + this.sistemaTesto(params.start) + '&' +
        'Fine=' + this.sistemaTesto(params.end) + '&' +
        'TuttiIGiorni=' + ad + '&' +
        'ColorePrimario=' + this.sistemaTesto(params.color.primary) + '&' +
        'ColoreSecondario=' + this.sistemaTesto(params.color.secondary) + '&' +
        'metaLocation=' + this.sistemaTesto(params.meta.location) + '&' +
        'metaNotes=' + this.sistemaTesto(params.meta.notes) + '&' +
        'idPartita=' + this.sistemaTesto(params.idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaEventoConvocazioni(Squadra, idEvento) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsEventiConvocazioni.asmx/EliminaEvento?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idAnno=' + this.variabiliGlobali.Anno + '&' +
        'idEvento=' + idEvento;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  modificaEventoConvocazioni(Squadra, params, start, end) {
    this.controlloPresenzaUtente(false);
    const ad = params.allDay === true ? 'S' : 'N';

    const url = this.variabiliGlobali.urlWS + 'wsEventiConvocazioni.asmx/ModificaEvento?' + 
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idEvento=' + this.sistemaTesto(params.id) + '&' +
        'idTipologia=' + this.sistemaTesto(params.tipologiaEvento) + '&' +
        'Titolo=' + this.sistemaTesto(params.title) + '&' +
        'Inizio=' + start + '&' +
        'Fine=' + end + '&' +
        'TuttiIGiorni=' + ad + '&' +
        'ColorePrimario=' + this.sistemaTesto(params.color.primary) + '&' +
        'ColoreSecondario=' + this.sistemaTesto(params.color.secondary) + '&' +
        'metaLocation=' + this.sistemaTesto(params.meta.location) + '&' +
        'metaNotes=' + this.sistemaTesto(params.meta.notes) + '&' +
        'idPartita=' + this.sistemaTesto(params.idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  caricaPartitaDaID(Squadra, idAnno, idPartita) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsPartite.asmx/RitornaPartitaDaID?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(idAnno) + '&' +
        'idPartita=' + this.sistemaTesto(idPartita);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  // SUPER USER
  creaNuovoDB(Squadra, DataScadenza, Mail, Nome, Cognome, Anno, idTipologia, idLicenza,
      Telefono, CAP, Citta, Indirizzo, Stima, PIVA, CF, DBP) {
    this.controlloPresenzaUtente(false);

    let mittente: string = this.variabiliGlobali.MittenteMail;
    if (this.variabiliGlobali.modalitaCreaDB === true) {
      mittente = 'info@incalcio.it';
    }
    const url = this.variabiliGlobali.urlWS + 'wsSuperUser.asmx/CreaDB?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'DataScadenza=' + this.sistemaTesto(DataScadenza) + '&' +
      'MailAdmin=' + this.sistemaTesto(Mail) + '&' +
      'NomeAdmin=' + this.sistemaTesto(Nome) + '&' +
      'CognomeAdmin=' + this.sistemaTesto(Cognome) + '&' +
      'Anno=' + this.sistemaTesto(Anno) + '&' +
      'idTipologia=' + this.sistemaTesto(idTipologia) + '&' +
      'idLicenza=' + this.sistemaTesto(idLicenza) + '&' +
      'Mittente=' + this.sistemaTesto(mittente) + '&' +
      'Telefono=' + this.sistemaTesto(Telefono) + '&' +
      'CAP=' + this.sistemaTesto(CAP) + '&' +
      'Citta=' + this.sistemaTesto(Citta) + '&' +
      'Indirizzo=' + this.sistemaTesto(Indirizzo) + '&' +
      'Stima=' + this.sistemaTesto(Stima) + '&' +
      'PIVA=' + this.sistemaTesto(PIVA) + '&' +
      'CF=' + this.sistemaTesto(CF) + '&' +
      'DBPrecompilato=' + this.sistemaTesto(DBP);
    // console.log('Nuovo DB:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaSquadreSuperUser() {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsSuperUser.asmx/RitornaSquadre';
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  modificaSquadraSuperUser(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsSuperUser.asmx/ModificaSquadra?' +
        'idSquadra=' + this.sistemaTesto(params.idSquadra) + '&' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'DataScadenza=' + this.sistemaTesto(params.DataScadenza) + '&' +
        'idTipologia=' + this.sistemaTesto(params.idTipologia) + '&' +
        'idLicenza=' + this.sistemaTesto(params.idLicenza) + '&' +
        'rateManuali=' + this.sistemaTesto(params.rateManuali === true ? 'S' : 'N') + '&' +
        'Cashback=' + this.sistemaTesto(params.cashback === true ? 'S' : 'N');
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaSquadraSuperUser(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsSuperUser.asmx/EliminaSquadra?' +
        'idSquadra=' + this.sistemaTesto(params.idSquadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  creaNuovoAnnoSuperUser(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsSuperUser.asmx/CreaNuovoAnno?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' + 
        'idSquadra=' + this.sistemaTesto(params.idSquadra) + '&' + 
        'NuovoAnno=' + this.sistemaTesto(params.NuovoAnno);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  SwitchStatoSuperUser(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsSuperUser.asmx/OnLineOffLineSquadra?' +
        'idSquadra=' + this.sistemaTesto(params.idSquadra) + '&' + 
        'idAnno=' + this.sistemaTesto(params.idAnno);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  importaAnagrafica(CodSquadra, Squadra, idAnno) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsSuperUser.asmx/ImportaAnagrafica?' +
      'CodiceSquadra=' + this.sistemaTesto(CodSquadra) + '&' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idAnno=' + this.sistemaTesto(idAnno)
      ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }
  // SUPER USER

  // GENITORI
  ritornaMails(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenitori.asmx/RitornaMails?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  salvaMails(Squadra, idUtente, Attiva1, Attiva2, Attiva3) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenitori.asmx/SalvaMails?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idUtente=' + this.sistemaTesto(idUtente) + '&' + 
        'Attiva1=' + this.sistemaTesto(Attiva1) + '&' + 
        'Attiva2=' + this.sistemaTesto(Attiva2) + '&' + 
        'Attiva3=' + this.sistemaTesto(Attiva3);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaIdGiocatore(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenitori.asmx/RitornaIdGiocatore?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaIdGiocatoreSez(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatoriSezione.asmx/RitornaDatiGiocatore?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  RitornaRicevuteGiocatore(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenitori.asmx/RitornaRicevuteGiocatore?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  RitornaRicevuteGiocatoreSez(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatoriSezione.asmx/RitornaRicevuteGiocatore?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaGenitori(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/RitornaUtentiGenitori?' +
        'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  RitornaDatiGiocatore(Squadra, idUtente) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenitori.asmx/RitornaDatiGiocatore?' +
        'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
        'idUtente=' + this.sistemaTesto(idUtente);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  
  // GENITORI

  ritornaNumeroFattura(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/RitornaNumeroFattura?' +
        'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  SalvaNumeroFattura(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/SalvaNumeroFattura?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'NumeroFattura=' + this.sistemaTesto(params.NumeroFattura)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroFirma(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroFirma?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroConvocazione(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroConvocazione?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroMail(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroMail?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroIscrizione(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroIscrizione?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroPrivacy(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroPrivacy?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroSollecito(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroSollecito?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroRicevutaStandard(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroRicevutaStandard?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroRicevutaScontrino(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroRicevutaScontrino?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroEMailAss(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroEMailAss?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroAssociato(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroAssociato?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaFileScheletroTestoAggConv(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/eliminaFileScheletroTestoAggConv?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroAssociato(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroAssociato?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroTestoAggConv(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroTestoAggConv?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletrEMailAss(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroEMailAss?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroConvocazione(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroConvocazione?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroMail(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroMail?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroRicevutaStandard(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroRicevutaStandard?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroRicevutaScontrino(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroRicevutaScontrino?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroIscrizione(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroIscrizione?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroPrivacy(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroPrivacy?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroSollecito(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroSollecito?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ritornaNomeFileScheletroFirma(Squadra) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsTemplates.asmx/ritornaNomeFileScheletroFirma?' +
        'Squadra=' + this.sistemaTesto(Squadra)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  converteImmagine(Immagine: string) {
    if (Immagine === undefined) {
        Immagine = '';
    }

    // this.controlloPresenzaUtente(false);
    let mo = '';
    if (Immagine.toUpperCase().indexOf('MULTIMEDIA') > -1) {
        mo = 'M';
    } else {
        mo = 'A';
    }
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/ConverteImmagine?' +
        'CodiceSquadra=' + this.sistemaTesto(this.variabiliGlobali.CodAnnoSquadra) + '&' +
        'NomeSquadra=' + this.sistemaTesto(this.variabiliGlobali.Squadra) + '&' +
        'MultimediaOAllegati=' + mo + '&' +
        'Immagine=' + this.sistemaTesto(Immagine)
        ;
    // console.log(url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  AggiornaSemafori(Squadra, idGiocatore) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/AggiornaSemafori?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore)
    ;
    // console.log('Aggiorna Semafori:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaDatiContatti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/RitornaDatiContatti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idCategoria=' + this.sistemaTesto(params.idCategoria)
    ;
    // console.log('Ritorna dati contatti:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  controllaFirma(params) {
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/ControllaFirma?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'Genitore=' + this.sistemaTesto(params.idGenitore);
    console.log('Controlla firma:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  aggiornaFirma(params) {
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/AggiornaFirma?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'Genitore=' + this.sistemaTesto(params.idGenitore) + '&' +
      'Privacy=' + this.sistemaTesto(params.Privacy);
    console.log('Aggiorna firma:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  calcolaCF(Cognome, Nome, DataNascita, Comune, Maschio) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaCF?' +
        'Cognome=' + this.sistemaTesto(Cognome) + '&' +
        'Nome=' + this.sistemaTesto(Nome) + '&' +
        'DataNascita=' + this.sistemaTesto(DataNascita) + '&' +
        'Comune=' + this.sistemaTesto(Comune) + '&' +
        'Maschio=' + this.sistemaTesto(Maschio); //  + this.sistemaTesto(this.variabiliGlobali.Privacy);
    // console.log('Richiede Firma:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  salvaLogAccessi(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/SalvaLogAccessi?' +
      'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
      'Descrizione=' + this.sistemaTesto(params.Descrizione)
      ;
    // console.log('Elimina Pagamento:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  aggiornaContatore(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsUtentiLocali.asmx/ErroriLogin?' +
      'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
      'Errore=' + this.sistemaTesto(params.Errore)
      ;
    // console.log('Elimina Pagamento:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  RistampaRicevutaScontrino(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RistampaRicevutaScontrino?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'NomeSquadra=' + this.sistemaTesto(params.NomeSquadra)+ '&' +
      'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
      'idGiocatore=' + this.sistemaTesto(params.idGiocatore) + '&' +
      'idPagamento=' + this.sistemaTesto(params.idPagamento) + '&' +
      'idUtente=' + this.sistemaTesto(params.idUtente);
    // console.log('Ritorna giocatori Categorie:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // REPORTS
  ritornaAnni(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsReports.asmx/RitornaAnni?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  StampaHTML(file) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/StampaHTML?' +
      'fileToPrint=' + this.sistemaTesto(file);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  stampaAnagrafica(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsReports.asmx/StampaAnagrafica?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'Tipologia=' + this.sistemaTesto(params.Tipologia) + '&' +
      'Dato=' + this.sistemaTesto(params.Dato) + '&' +
      'Certificato=' + this.sistemaTesto(params.Certificato) + '&' +
      'FirmePresenti=' + this.sistemaTesto(params.FirmePresenti) + '&' +
      'KitConsegnato=' + this.sistemaTesto(params.KitConsegnato);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  stampaPagamenti(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsReports.asmx/StampaPagamenti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'Modalita='  + this.sistemaTesto(params.Modalita);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  stampaQuote(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsReports.asmx/StampaQuote?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'Anno='  + this.sistemaTesto(params.Anno) + '&' +
      'QuotaPresente='  + this.sistemaTesto(params.QuotaPresente);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  salvaNota(Squadra, idGiocatore, Notelle) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/SalvaGiocatoriNote?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore) + '&' +
      'Notelle=' + this.sistemaTesto(Notelle);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaNota(Squadra, idGiocatore) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsGiocatori.asmx/RitornaGiocatoriNote?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idGiocatore=' + this.sistemaTesto(idGiocatore);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // MAILS
  ritornaMailsNuove(params) {
    // console.log('Ritorna mail nuove', params);
    // if (JSON.stringify(params) === JSON.stringify(this.vecchiParametriPerMail)) {
    //   return;
    // }
    // this.vecchiParametriPerMail = params;

    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/RitornaMails?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'Folder=' + this.sistemaTesto(params.Folder) + '&' +
        'Filter=' + this.sistemaTesto(params.Filter) + '&' +
        'Label=' + this.sistemaTesto(params.Label) + '&' +
        'SoloNuove=' + this.sistemaTesto(params.SoloNuove);
    // console.log('Controllo mailz:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  controllaMailsNuove(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/RitornaMails?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idAnno=' + this.sistemaTesto(params.idAnno) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'Folder=' + this.sistemaTesto(params.Folder) + '&' +
        'Filter=' + this.sistemaTesto(params.Filter) + '&' +
        'Label=' + this.sistemaTesto(params.Label) + '&' +
        'SoloNuove=' + this.sistemaTesto(params.SoloNuove);
    console.log('Controllo mailz:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  inviaMailNuova(params) {    
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/AggiungeMail?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'from=' + this.sistemaTesto(params.from) + '&' +
        'subject=' + this.sistemaTesto(params.subject) + '&' +
        'message=' + this.sistemaTesto(params.message) + '&' +
        'time=' + this.sistemaTesto(params.time) + '&' +
        'letto=' + this.sistemaTesto(params.letto) + '&' +
        'starred=' + this.sistemaTesto(params.starred) + '&' +
        'important=' + this.sistemaTesto(params.important) + '&' +
        'hasAttachments=' + this.sistemaTesto(params.hasAttachments) + '&' +
        'folder=' + this.sistemaTesto(params.folder) + '&' +
        'mailsTo=' + this.sistemaTesto(params.mailsTo) + '&' +
        'attachments=' + this.sistemaTesto(params.attachments) + '&' +     
        'labels=' + this.sistemaTesto(params.labels);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  } 

  ritornaUtentiSquadra(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/RitornaDestinatari?' +
        'Squadra=' + this.sistemaTesto(params);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  eliminaMessaggio(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/EliminaMsg?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'idMail=' + this.sistemaTesto(params.idMail);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  spostaFolder(params) {
    this.controlloPresenzaUtente(false);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/ImpostaFolderMsg?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'idMail=' + this.sistemaTesto(params.idMail) + '&' +
        'Folder=' + this.sistemaTesto(params.Folder);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ImpostaMsgComeLetto(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/ImpostaMsgComeLetto?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idMail=' + this.sistemaTesto(params.idMail) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }  

  ImpostaMsgPerPreferito(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/ImpostaMsgComePreferito?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idMail=' + this.sistemaTesto(params.idMail) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'Preferito=' + this.sistemaTesto(params.Preferito);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  } 

  ImpostaMsgPerImportante(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsMail.asmx/ImpostaMsgComeImportante?' +
        'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
        'idMail=' + this.sistemaTesto(params.idMail) + '&' +
        'idUtente=' + this.sistemaTesto(params.idUtente) + '&' +
        'Importante=' + this.sistemaTesto(params.Importante);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  // TAGS
  ritornaTag() {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsTags.asmx/RitornaTAGS';
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaTag(idTag) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsTags.asmx/eliminaTag?idTag=' + this.sistemaTesto(idTag);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }     

  salvaTag(dati) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsTags.asmx/salvaTag?';
      'idTag=' + this.sistemaTesto(dati.idTag) + '&' +
      'Descrizione=' + this.sistemaTesto(dati.Descrizione) + '&' +
      'Valore=' + this.sistemaTesto(dati.Valore) + '&' +
      'Query=' + this.sistemaTesto(dati.Query);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }     

  modificaTag(dati) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsTags.asmx/modificaTag?';
      'idTag=' + this.sistemaTesto(dati.idTag) + '&' +
      'Descrizione=' + this.sistemaTesto(dati.Descrizione) + '&' +
      'Valore=' + this.sistemaTesto(dati.Valore) + '&' +
      'Query=' + this.sistemaTesto(dati.Query);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }     

  // LETTORI NFC
  ritornaLettoriNFC(Squadra) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsNFC.asmx/RitornaLettoriNFC?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  eliminaLettoreNFC(Squadra, idLettore) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsNFC.asmx/EliminaLettoreNFC?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idLettore=' + this.sistemaTesto(idLettore);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }     

  salvaLettoreNFC(Squadra, dati) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsNFC.asmx/NuovoLettoreNFC?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'Descrizione=' + this.sistemaTesto(dati.Descrizione) + '&' +
      'IndirizzoIP=' + this.sistemaTesto(dati.IndirizzoIP);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }     

  modificaLettoreNFC(Squadra, dati) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsNFC.asmx/ModificaLettoreNFC?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' +
      'idLettore=' + this.sistemaTesto(dati.idLettore) + '&' +
      'Descrizione=' + this.sistemaTesto(dati.Descrizione) + '&' +
      'IndirizzoIP=' + this.sistemaTesto(dati.IndirizzoIP);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }     

  caricaCitta() {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsGenerale.asmx/RitornaCitta';
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }     

  // WIDGETS
  RitornaIscritti(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/RitornaIscritti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  RitornaIndicatori(Squadra) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/RitornaIndicatori?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  RitornaQuote(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/RitornaQuoteNonSaldate?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  RitornaProssimiEventi(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/RitornaProssimiEventi?' +
      'Squadra=' + this.sistemaTesto(params.Squadra) + '&' +
      'Limite=' + this.sistemaTesto(params.Limite);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  ritornaUltimeFirme(Squadra, Tutto) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/RitornaFirmeDaValidare?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
      'Tutte=' + this.sistemaTesto(Tutto);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaConteggi(Squadra) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/RitornaConteggi?' +
      'Squadra=' + this.sistemaTesto(Squadra) ;
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  // WIDGET THREADS
  PulisceDatiWidgets(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/PulisceDati?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  AggiornaDati(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/AggiornaDati?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  CreaIscritti(params) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/CreaIscritti?' +
      'Squadra=' + this.sistemaTesto(params.Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  CreaIndicatori(Squadra) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/CreaIndicatori?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  CreaQuoteNonSaldate(Squadra) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/CreaQuoteNonSaldate?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    // console.log('Ritorna arbitri:', url);
    const ritorno = this.httpclient.get(url);
    return ritorno;
  }

  CreaFirmeDaValidare(Squadra, Tutto) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/CreaFirmeDaValidare?' +
      'Squadra=' + this.sistemaTesto(Squadra) + '&' + 
      'Tutte=' + this.sistemaTesto(Tutto);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  CreaConteggi(Squadra) {
    this.controlloPresenzaUtente(true);
    const url = this.variabiliGlobali.urlWS + 'wsWidget.asmx/CreaConteggi?' +
      'Squadra=' + this.sistemaTesto(Squadra);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }
}
