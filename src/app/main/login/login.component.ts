import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ApiService } from 'app/services/api.service';
import { VariabiliGlobali } from 'app/global.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class LoginComponent implements OnInit, AfterViewInit
{
    loginForm: FormGroup;
    hover;
    campiMemorizzati;
    squadre;
    sceltaSuperUser = false;
    fuseConfig: any;
    interval;
    logoGlobale;
    immSfondo = undefined;
    idAnno = -1;
    memorizza = true;

    vecchioMilli = 0;
    quantiClick = 0;
    attivatoEaster = false;
    apreEaster = false;

    // listaUtentiRilevati;
    // listaUtenti;
    errMsg = '';
    valueMemorizza = false;
  
    caricaFirma = false;
    idPerFirma = '';
  
    privacyPolicy = false;
    testoPolicyPrivacy = '';
    
    creaDB = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private http: HttpClient,
        private _fuseConfigService: FuseConfigService,
        private activatedRoute: ActivatedRoute,
        private _fuseSidebarService: FuseSidebarService,
        private apiService: ApiService,
        public variabiliGlobali: VariabiliGlobali,
        private router: Router,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        
        this.route.queryParams.subscribe(params => {
            // Esempio di chiamata: 
            // http://localhost:4200/login?firma=true&id=123&genitore=1&squadra=Ponte_Di_Nona&anno=2

            // console.log(params);

            /* const creaDB = params['CreaDB'];
            if (creaDB && creaDB !== '') {
                this.creaDB = true;
            } */
            // console.log('Creazione DB:', creaDB);

            const firma: string = params['firma'];
            const id: string = params['id'];
            const genitore: string = params['genitore'];
            const squadra: string = params['squadra'];
            const anno: string = params['anno'];
            
            // console.log(firma, id);
            if (firma && firma !== '') {
                if (id === '' || genitore === '' || squadra === '' || anno === '') {
                    // Valori non validi arrivati
                } else {
                    this.variabiliGlobali.codiceFirma = firma;
                    this.variabiliGlobali.idPerFirma = id;
                    this.variabiliGlobali.genitorePerFirma = genitore;
                    this.variabiliGlobali.Squadra = squadra;
                    this.variabiliGlobali.Anno = anno;
                    this.variabiliGlobali.Utente = 'AUTO';

                    this.caricaFirma = true;
                    this.idPerFirma = id;

                    // alert('Valido');
                }
            }
        });        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
        
/**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        
        /* this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if ( this.fuseConfig.layout.width === 'boxed' )
                {
                    this.document.body.classList.add('boxed');
                }
                else
                {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for ( let i = 0; i < this.document.body.classList.length; i++ )
                {
                    const className = this.document.body.classList[i];

                    if ( className.startsWith('theme-') )
                    {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            }); */
    }

    ngAfterViewInit() {
        this.interval = setInterval(() => {
            if (this.variabiliGlobali.urlWS !== undefined && this.variabiliGlobali.urlPerUpload !== undefined) {
                // console.log(this.variabiliGlobali.urlWS, this.variabiliGlobali.urlPerUpload);

                clearInterval(this.interval);

                if (this.caricaFirma === true) {
                    const dove = 'firma';
                    this.router.navigate([dove]);
                    return;
                }

                /* if (this.creaDB === true) {
                    this.variabiliGlobali.modalitaCreaDB = true;
                    const dove = 'nuova_societa';
                    this.router.navigate([dove]);
                    return;
                } */
        
                // this.videoPath = 'http://looigi.no-ip.biz:92/Multimedia/videoLogin.mp4';
                this.immSfondo = this.variabiliGlobali.caricaImmSfondoGlobale();
                // console.log(this.immSfondo);
                this.logoGlobale = this.variabiliGlobali.prendeLogoGlobale();

                let emailM = '';
                let passM = '';

                // setTimeout(() => {
                const m = localStorage.getItem('GC_Memorizza');
                if (+m === 1) {
                    // console.log('Memorizza:', m, localStorage.getItem('GC_UserName'));
                    this.valueMemorizza = true;
                    this.memorizza = true;
                    emailM = localStorage.getItem('GC_UserName');
                    passM = localStorage.getItem('GC_Password');
                    this.idAnno = +localStorage.getItem('GC_Anno');
                } else {
                    this.valueMemorizza = false;
                    this.memorizza = false;
                    emailM = '';
                    passM = '';
                    this.idAnno = -1;
                }

                this.loginForm = this._formBuilder.group({
                    email   : [emailM, [Validators.required, Validators.email]],
                    password: [passM, Validators.required]
                });          
                
                this.http.get(this.variabiliGlobali.urlWS + 'Scheletri/privacyPolicy.txt?d=' + new Date(), 
                {responseType: 'text'}).subscribe(res => {
                    // this.fileHtml = this.sanitizer.bypassSecurityTrustHtml(res);
                    this.testoPolicyPrivacy = res;
                });
                // }, 1000);
            }
            
            // this.variabiliGlobali.consideraIlRitorno = true;            
        }, 1000);
    }

    scriveLogAccessi(idUtente, descrizione) {
        this.apiService.salvaLogAccessi({
            idUtente: idUtente,
            Descrizione: descrizione
        })
        .map(response => response.text())
        .subscribe(
        data => {
            // this.requestInProgress = false;
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                // console.log(data2);
                if (data2.indexOf('ERROR') === -1) {
                }
            }
        });  
    }

    aggiornaContatore(idUtente, Errore) {
        this.apiService.aggiornaContatore({
            idUtente: idUtente,
            Errore: Errore
        })
        .map(response => response.text())
        .subscribe(
        data => {
            // this.requestInProgress = false;
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                // console.log(data2);
                if (data2.indexOf('ERROR') > -1) {
                    this.variabiliGlobali.mostraMessaggio('L\'utenza è stata bloccata', false);                    
                }
            }
        });  
    }

    login(): void {
        const username = this.loginForm.value.email;

        this.apiService.login({
          Utente: username
        })
        .map(response => response.text())
        .subscribe(
          data => {
            // this.requestInProgress = false;
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                // alert(data2);
                if (data2.indexOf('ERROR') === -1) {
                    const tutto = data2.split('|');
                    // alert(tutto);

                    const licenze = tutto[2].split('§');
                    const ll = new Array();
                    licenze.forEach(element => {
                        if (element) {
                            const e = element.split(';');
                            const l = {
                                id: e[0],
                                Descrizione: e[1],
                                Codice: e[2],
                                Preso: false
                            };
                            ll.push(l);
                        }
                    });
                    this.variabiliGlobali.ListaLicenze = ll;

                    const squadre = tutto[1].split('§');
                    const utenze = tutto[0].split('§');

                    const campi = utenze[0].split(';');

                    const password = this.loginForm.value.password;
                    if (password !== campi[5]) {
                        this.errMsg = 'Password non valida';
                        // console.log(campi);
                        const t = campi[1];
                        this.scriveLogAccessi(t, this.errMsg);
                        this.aggiornaContatore(t, 'S');
                    } else {
                        // if (campi[8] === '0') {
                        if (this.variabiliGlobali.AccedeASquadra !== '') {
                            // console.log(squadre, utenze);
                            // console.log('Super User. Faccio Scegliere la squadra');
                            this.squadre = new Array();
                            this.hover = new Array();
                            squadre.forEach(element => {
                                if (element) {
                                    const sq = element.split(';');
                                    if (sq[1] === this.variabiliGlobali.AccedeASquadra) {
                                        const s = {
                                            idSquadra: +sq[0],
                                            Squadra: sq[1],
                                            DataScadenza: sq[2],
                                            Tipologia: sq[3],
                                            Licenza: sq[4],
                                            idTipologia: +sq[5],
                                            idLicenza: +sq[6]
                                        };
                                        this.squadre.push(s);
                                        this.hover.push(false);
                                    }
                                }
                            });

                            this.campiMemorizzati = campi;
                            // console.log(this.squadre);
                            // this.sceltaSuperUser = true;

                            this.sceltaSquadra(this.squadre[0].idSquadra, this.squadre[0].Squadra);
                        } else {
                            let scadutaLicenza = false;
                            squadre.forEach(element => {
                                if (element) {
                                    const sq = element.split(';');
                                    // console.log(sq[1], campi[10]);
                                    if (sq[1] === campi[10]) {
                                        this.variabiliGlobali.ScadenzaLicenza = sq[2];
                                        const dataScadenza = new Date(sq[2]);
                                        const oggi = new Date();
                                        const days = Math.floor((oggi.getTime() - dataScadenza.getTime()) / 1000 / 60 / 60 / 24);

                                        // this.variabiliGlobali.mostraMessaggio('Giorni: ' + days, false);

                                        if (days < - 15) {
                                            // Tutto a posto
                                        } else {
                                            if (days >= -15 && days < 0) {
                                                this.variabiliGlobali.mostraMessaggio('La licenza sta per scadere<br /><br />Giorni mancanti: ' + Math.abs(days), false);
                                            } else {
                                                if (days === 0) {
                                                    this.variabiliGlobali.mostraMessaggio('La licenza scade oggi', false);
                                                } else {
                                                    if (days > 2) {
                                                        scadutaLicenza = true;
                                                        this.variabiliGlobali.mostraMessaggio('La licenza è scaduta.<br />Impossibile accedere', false);
                                                    } else {
                                                        this.variabiliGlobali.mostraMessaggio('La licenza è scaduta', false);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });

                            if (!scadutaLicenza || campi[8] === '0') {
                                if (campi[8] === '0') {
                                    this.variabiliGlobali.CodiceSquadra = '';
                                    this.variabiliGlobali.Squadra = '';
                                } else {
                                    this.variabiliGlobali.CodiceSquadra = campi[9];
                                    this.variabiliGlobali.Squadra = campi[10];
                                }

                                this.passaACaricare(campi);
                            }
                        }
                    }
                } else {
                    this.errMsg = data2;
                }
            }
          },
          (error) => {
            // this.requestInProgress = false;
    
            if (error instanceof Error) {
              this.errMsg = 'An error occurred:' + error.message;
            }
          }
        );
    }

    sceltaSquadra(e, s) {
        this.variabiliGlobali.CodiceSquadra = e.toString().trim();
        this.variabiliGlobali.Squadra = s;
        // console.log(this.squadre);
        this.squadre.forEach(element => {
            if (+e === +element.idSquadra) {
                this.campiMemorizzati[13] = element.idTipologia;
                this.campiMemorizzati[14] = element.idLicenza;
            }
        });

        // console.log(e, s, this.campiMemorizzati);
        this.passaACaricare(this.campiMemorizzati);
    }

    passaACaricare(campi): void {
        // console.log(password, campi[5]);
        // console.log(dati);

        // this.mostraScelta = false;

        // console.log('Dati:', campi);
        this.variabiliGlobali.Anno = campi[0];
        this.variabiliGlobali.idUtente = campi[1];
        this.variabiliGlobali.Utente = campi[2];
        this.variabiliGlobali.Cognome = campi[3];
        this.variabiliGlobali.Nome = campi[4];
        this.variabiliGlobali.Password = campi[5];
        this.variabiliGlobali.EMail = campi[6];
        this.variabiliGlobali.Tipologia = this.variabiliGlobali.prendeTipologia(+campi[8]);
        console.log('Tipologia: ', this.variabiliGlobali.Tipologia);
        this.idAnno = campi[0];
        this.variabiliGlobali.PasswordScaduta = campi[11];
        this.variabiliGlobali.Telefono = campi[12];
        this.variabiliGlobali.idCategoria = campi[7];
        this.variabiliGlobali.idTipologiaPermessi = +campi[13];
        while (this.variabiliGlobali.Squadra.indexOf(' ') > -1) {
            this.variabiliGlobali.Squadra = this.variabiliGlobali.Squadra.replace(' ', '_');
        }
        let anno = this.variabiliGlobali.Anno;
        if (anno !== '') {
            for (let i = anno.length + 1; i <= 4; i++) {
                anno = '0' + anno;
            }
        }
        for (let i = this.variabiliGlobali.CodiceSquadra.length + 1; i <= 5; i++) {
            this.variabiliGlobali.CodiceSquadra = '0' + this.variabiliGlobali.CodiceSquadra;
        }
        if (campi[8] === '0' && this.variabiliGlobali.AccedeASquadra === '') {
            this.variabiliGlobali.CodAnnoSquadra = '';
        } else {
            this.variabiliGlobali.CodAnnoSquadra = anno + '_' + this.variabiliGlobali.CodiceSquadra;
        }
        this.variabiliGlobali.idTipologia = campi[8];
        this.variabiliGlobali.idLicenza = +campi[14];
        this.variabiliGlobali.AmmOriginale = campi[15] === 'S' ? true : false;
        this.variabiliGlobali.mailComunicazioni = campi[16];
        this.variabiliGlobali.pwdComunicazioni = campi[17];

        console.log('ID Licenza', this.variabiliGlobali.idLicenza);

        // console.log('Tipologia:', this.variabiliGlobali.idTipologiaPermessi);
        // console.log('Licenza:', this.variabiliGlobali.idLicenza);

        localStorage.setItem('GC_Anno', this.idAnno.toString());
        localStorage.setItem('GC_UserName', this.loginForm.value.email);
        localStorage.setItem('GC_Password', this.loginForm.value.password);
        /* localStorage.setItem('GC_CodAnnoSquadra', this.variabiliGlobali.CodAnnoSquadra);
        localStorage.setItem('GC_Squadra', this.variabiliGlobali.Squadra); */

        this.variabiliGlobali.caricaImmSfondo();

        if (campi[8] !== '0' || this.variabiliGlobali.AccedeASquadra !== '') {
            this.caricaImpostazioniGenerali();

            this.variabiliGlobali.caricaPermessi(this.apiService, true);
        } else {
            
            // if (this.variabiliGlobali.aprePrimaPagina === true) {
            if (+this.variabiliGlobali.PasswordScaduta === 1) {
                this.variabiliGlobali.Utente = '';
                const dove = 'reset-password-2';
                this.router.navigate([dove]);
            } else {
                const dove = 'home';
                this.router.navigate([dove]);
            }
            // }

            // const dove = 'home';
            // this.router.navigate([dove]);
        }

        setTimeout(() => {
            if (+this.variabiliGlobali.PasswordScaduta !== 1) {
                this.scriveLogAccessi(this.variabiliGlobali.idUtente, 'OK');
                this.aggiornaContatore(this.variabiliGlobali.idUtente, 'N');
                this.variabiliGlobali.AccedeASquadra = '';
            }
        }, 3000);
    }

    caricaImpostazioniGenerali(): void {
        this.apiService.ritornaImpostazioni(this.variabiliGlobali.CodAnnoSquadra, this.variabiliGlobali.idUtente)
        .map(response => response.text())
        .subscribe(
            data => {
            // this.requestInProgress = false;
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    // console.log('Impostazioni', data2);
                    const righe = data2.split('§');
                    // righe.forEach(element => {
                    //     if (element !== '') {
                    const element2 = righe[0].split(';');

                    this.variabiliGlobali.DescrizioneAnno = element2[1];
                    this.variabiliGlobali.Coordinate = element2[3] + ';' + element2[4] ;
                    this.variabiliGlobali.Indirizzo = element2[5];
                    this.variabiliGlobali.CampoSquadra = element2[6];
                    this.variabiliGlobali.NomePolisportiva = element2[7];
                    this.variabiliGlobali.idSquadra = element2[8];
                    this.variabiliGlobali.idCampo = element2[9];

                    this.variabiliGlobali.Mail = element2[10];
                    this.variabiliGlobali.PEC = element2[11];
                    this.variabiliGlobali.Telefono2 = element2[12];
                    this.variabiliGlobali.PIva = element2[13];
                    this.variabiliGlobali.CodiceFiscale = element2[14];
                    this.variabiliGlobali.CodiceUnivoco = element2[15];
                    this.variabiliGlobali.SitoWeb = element2[16];

                    this.variabiliGlobali.MittenteMail = element2[17];
                    // console.log(this.variabiliGlobali.MittenteMail);

                    this.variabiliGlobali.NumerazioneManuale = (element2[18] === 'S' ? true : false);
                    // console.log(element2, this.variabiliGlobali.GestionePagamenti);
                    //     }
                    // });
                    this.variabiliGlobali.EsisteFirmaUtente = (element2[19] === 'S' ? true : false);
                    this.variabiliGlobali.urlFirmaUtente = element2[20];
                    // console.log(this.variabiliGlobali.EsisteFirmaUtente, this.variabiliGlobali.urlFirmaUtente);

                    this.variabiliGlobali.meseLicenza = element2[21];
                    this.variabiliGlobali.annoLicenza = element2[22];

                    this.variabiliGlobali.CostoScuolaCalcio = element2[23] ? +(element2[23].replace(',', '.')) : 0;
                    this.variabiliGlobali.WidgetSelezionati = element2[24];
                    this.variabiliGlobali.suffisso = element2[25];
                    this.variabiliGlobali.iscrFirmaEntrambi = (element2[26] === 'S' ? true : false);
                    this.variabiliGlobali.stampaModuloAssociato = (element2[27] === 'S' ? true : false);
                    this.variabiliGlobali.PercCashBack = element2[28] ? +(element2[28].replace(',', '.')) : 10;
                    this.variabiliGlobali.rateManuali = (element2[29] === 'S' ? true : false);
                    this.variabiliGlobali.pagamentiRegistrati = (element2[30] === 'S' ? true : false);
                    this.variabiliGlobali.Cashback = (element2[31] === 'S' ? true : false);
                } else {
                    this.variabiliGlobali.mostraMessaggio(data2, false);
                }
            }
        });
    }

    cambioStatoMemorizza(e): void {
        // setTimeout(() => {
          this.memorizza = e.checked;
          // console.log(e);
          if (this.memorizza === true) {
            localStorage.setItem('GC_Memorizza', '1');
          } else {
            localStorage.setItem('GC_Memorizza', '0');
          }
        // }, 100);
    }
                
    // login(): void {
    //     // console.log('login', this.loginForm.value.email, this.loginForm.value.password);
    //     const dove = 'home';
    //     this.router.navigate([dove]);
    // }

    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    passwordPersa(): void {
        // [routerLink]="'forgot-password-2'"
        const dove = 'forgot-password-2';
        this.router.navigate([dove]);
    }

    easter() {
        const ora = Date.now();
        if ((ora - this.vecchioMilli) < 1000 || this.vecchioMilli === 0) {
            // console.log(ora - this.vecchioMilli);
            this.quantiClick += 1;
            this.vecchioMilli = ora;
            if (this.quantiClick > 2) {
                this.quantiClick = 0;
                this.attivatoEaster = true;
            }
        } else {
            this.attivatoEaster = false;
            this.quantiClick = 0;
            this.vecchioMilli = 0;
        }
        // console.log(ora);
    }

    easter2() {
        if (this.attivatoEaster === true) {
            const ora = Date.now();
            // console.log(ora - this.vecchioMilli);
            if ((ora - this.vecchioMilli) > 2000) {
                this.apreEaster = true;
                this.quantiClick = 0;
            } else {
                this.quantiClick = 0;
                this.attivatoEaster = false;
            }
        } else {
            this.quantiClick = 0;
            this.attivatoEaster = false;
        }
    }

    chiudiEaster() {
        this.attivatoEaster = false;
        this.quantiClick = 0;
        this.vecchioMilli = 0;
        this.apreEaster = false;
    }

    onNavigate(url){
        window.open(url, '_blank');
    }
}
