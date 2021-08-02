import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';

import { MatColors } from '@fuse/mat-colors';

import { CalendarEventModel } from '../event.model';
import { VariabiliGlobali } from 'app/global.component';
import { ApiService } from '../../../services/api.service';
import { DatePipe } from '@angular/common';

@Component({
    selector     : 'calendar-event-form-dialog',
    templateUrl  : './event-form.component.html',
    styleUrls    : ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CalendarEventFormDialogComponent implements OnInit
{
    action: string;
    event;
    eventForm: FormGroup;
    dialogTitle: string;
    presetColors = MatColors.presets;
    tipologia = -1;
    nuovoId = -1;
    datiTipologie = [{ id: 2, Descrizione: 'Reminder'}];
    dataCorretta = true;

    /**
     * Constructor
     *
     * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private variabiliGlobali: VariabiliGlobali,
        private datepipe: DatePipe,
        private apiService: ApiService,
        private _formBuilder: FormBuilder
    )
    {
        // console.log('Apertura maschera', _data);
        this.event = _data.event;
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = this.event.title;
            this.tipologia = this.event.idTipologia;
            this.nuovoId = +this.event.id;
            // console.log('Modifica evento:', this.event);
        }
        else
        {
            this.dialogTitle = 'Nuovo Evento';
            this.event = new CalendarEventModel({
                start: _data.date,
                end  : _data.date
            });
        }
    }

    ngOnInit() {
        this.cambioData(null);
        if ( this.action !== 'edit' ) {
            const params = { Squadra: this.variabiliGlobali.CodAnnoSquadra };
            this.apiService.ritornaNuovoIDRem(params)
            .map(response => response.text())
            .subscribe(
                data => {
                if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                    if (data2.indexOf('ERROR') === -1) {
                        this.nuovoId = +data2;
                        this.event.id = +data2;

                        this.eventForm = this.createEventForm();

                        this.tipologia = 2;

                        // console.log('Nuovo ID:', this.nuovoId);
                    } else {
                        this.variabiliGlobali.mostraMessaggio('Problemi nel rilevare il nuovo ID', false);
                    }
                }
            });    
        } else {
            this.eventForm = this.createEventForm();

            this.tipologia = 2;
        }
    }

    cambioData(e) {
        setTimeout(() => {
            const ee = this.event.start;
            const d = this.datepipe.transform(ee, 'yyyy-MM-dd') + ' ' + this.event.oraStart;
            const o = this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
            const dataMessa = new Date(d).getTime();
            const dataAttuale = new Date(o).getTime();
            // console.log(d, o, dataMessa, dataAttuale, dataMessa - dataAttuale);
            if (dataAttuale > dataMessa) {
                this.dataCorretta = false;
            } else {
                const ff = this.event.end;
                const d2 = this.datepipe.transform(ff, 'yyyy-MM-dd') + ' ' + this.event.oraEnd;
                const dataFineMessa = new Date(d2).getTime();
                console.log(d, d2);
                if (dataMessa > dataFineMessa) {
                    this.dataCorretta = false;
                } else {
                    this.dataCorretta = true;
                }
            }            
        }, 100);
    }

    chiudiMaschera(e) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    selezioneTipologia(e) {
        if (e) {
            this.tipologia = e;
        }
    }

    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createEventForm(): FormGroup
    {
        // console.log('CreateEventForm', this.nuovoId);
        
        return new FormGroup({
            id: new FormControl(this.nuovoId),
            tipologiaEvento: new FormControl(this.tipologia),
            title : new FormControl(this.event.title),
            start : new FormControl(this.event.start),
            orastart: new FormControl(this.event.oraStart),
            end   : new FormControl(this.event.end),
            oraend: new FormControl(this.event.oraEnd),
            allDay: new FormControl(this.event.allDay),
            color : this._formBuilder.group({
                primary  : new FormControl(this.event.color.primary),
                secondary: new FormControl(this.event.color.secondary)
            }),
            meta  :
                this._formBuilder.group({
                    location: new FormControl(this.event.meta.location),
                    notes   : new FormControl(this.event.meta.notes)
                })
        });
    }
}
