import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarEventAction } from 'angular-calendar';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';

/* import { CalendarService } from './calendar.service'; */
import { CalendarEventModel } from './event.model';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { ApiService } from '../../services/api.service';
import { VariabiliGlobali } from 'app/global.component';
import { DatePipe } from '@angular/common';
import { EventActionAllungata, VistaMese } from './action.model';

@Component({
    selector     : 'calendar',
    templateUrl  : './calendar.component.html',
    styleUrls    : ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CalendarComponent implements OnInit
{
    riapreMaschera = false;
    appoID = -1;
    idPartita = -1;
    appoEvent;
    ultimaAzione = '';
    actions: EventActionAllungata[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    events: CalendarEventModel[];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    view: string;
    viewDate: Date;
    editPartita = false;

    constructor(
        private _matDialog: MatDialog,
        private variabiliGlobali: VariabiliGlobali,
        private datepipe: DatePipe,
        private apiService: ApiService,
        // private _calendarService: CalendarService
    )
    {
        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = {date: startOfDay(new Date())};

        this.actions = [
            {
                label  : '<i class="material-icons s-16">edit</i>',
                onClick: ({event}: { event: CalendarEventModel }): void => {
                    this.editEvent('edit', event);
                }
            },
            {
                label  : '<i class="material-icons s-16">delete</i>',
                onClick: ({event}: { event: CalendarEventModel }): void => {
                    this.deleteEvent(event);
                }
            }
        ];

        /**
         * Get events from service/server
         */
        this.setEvents();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        /**
         * Watch re-render-refresh for updating db
        this.refresh.subscribe(updateDB => {
            if ( updateDB )
            {
                this._calendarService.updateEvents(this.events);
            }
        }); 

        this._calendarService.onEventsUpdated.subscribe(events => {
            this.setEvents();
            this.refresh.next();
        });
         */
        this.setEvents();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set events
     */
    setEvents(): void
    {
        // this.events = this._calendarService.events.map(item => {
        //     item.actions = this.actions;
        //     return new CalendarEventModel(item);
        // });

        this.events = new Array();
        const params = { Squadra: this.variabiliGlobali.CodAnnoSquadra };
        this.apiService.ritornaEventiConvocazioni(params)
        .map(response => response.text())
        .subscribe(
            data => {
            if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR') === -1) {
                    const righe = data2.split('§');
                    // console.log(righe);
                    const a = new Array();
                    righe.forEach(element => {
                        if (element && element !== '') {
                            const campi = element.split(';');

                            const d1 = new Date(this.datepipe.transform(campi[3], 'yyyy-MM-dd'));
                            const o1 = this.datepipe.transform(campi[3], 'HH:mm:ss');
                            const d2 = new Date(this.datepipe.transform(campi[4], 'yyyy-MM-dd'));
                            const o2 = this.datepipe.transform(campi[4], 'HH:mm:ss');

                            const item: CalendarEventModel = {
                                id: +campi[0],
                                idTipologia: +campi[1],
                                title : campi[2],
                                start : d1,
                                oraStart: o1,
                                end   : d2,
                                oraEnd: o2,
                                allDay: campi[5] === 'S' ? true : false,
                                color : {
                                    primary  : campi[6],
                                    secondary: campi[7]
                                },
                                meta  :
                                    {
                                        location: campi[8],
                                        notes   : campi[9]
                                    },
                                idPartita: +campi[10]
                            };
                            
                            // item.start = this.datepipe.transform(item.start, 'yyyy-MM-dd hh:mm:ss');
                            // item.end = this.datepipe.transform(item.start, 'yyyy-MM-dd hh:mm:ss');
                            // console.log(item);

                            a.push(item);
                        }
                    });
                    this.events = a; // JSON.parse(JSON.stringify(a));
                    // console.log(this.events);
                    this.refresh.next();
                } else {
                    // console.log(data2);
                }
            } else {
                // console.log('Nessun dato ritornato');
            }
        });
    }

    /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
    beforeMonthViewRender({header, body}): void
    {
        /**
         * Get the selected day
         */
        const _selectedDay = body.find((_day) => {
            if (_day && _day.date && this.selectedDay.date) {
                return _day.date.getTime() === this.selectedDay.date.getTime();
            } else {
                return null;
            }
        });

        if ( _selectedDay )
        {
            /**
             * Set selected day style
             * @type {string}
             */
            _selectedDay.cssClass = 'cal-selected';
        }

    }

    /**
     * Day clicked
     *
     * @param {MonthViewDay} day
     */
    dayClicked(day: VistaMese): void
    {
        const date: Date = day.date;
        const events: CalendarEventModel[] = day.events;

        if ( isSameMonth(date, this.viewDate) )
        {
            if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
            {
                this.activeDayIsOpen = false;
            }
            else
            {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.selectedDay = day;
        // console.log(day);
        this.refresh.next();
    }

    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void
    {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next(true);
    }

    /**
     * Delete Event
     *
     * @param event
     */
    deleteEvent(event): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Eliminare l\'evento ?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                const eventIndex = this.events.indexOf(event);

                this.apiService.eliminaEventoConvocazioni(this.variabiliGlobali.CodAnnoSquadra, event.id)
                .map(response2 => response2.text())
                .subscribe(
                    data => {
                    if (data) {
                        const data2 = this.apiService.prendeSoloDatiValidi(data);
                        if (data2.indexOf('ERROR') === -1) {
                            this.events.splice(eventIndex, 1);
                            this.refresh.next(true);
                            this.variabiliGlobali.mostraMessaggio('Evento eliminato', false);
                        } else {
                            // console.log(data2);
                        }
                    }
                });

            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
    editEvent(action: string, event: CalendarEventModel): void
    {
        this.ultimaAzione = 'EDIT';
        const eventIndex = this.events.indexOf(event);

        console.log('Edit', event);
        const d1 = this.datepipe.transform(event.start , 'yyyy-MM-dd');
        const d = this.datepipe.transform(d1 + ' ' + event.oraStart , 'yyyy-MM-dd HH:mm');
        const o = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
        const dataMessa = new Date(d).getTime();
        const dataAttuale = new Date(o).getTime();
        // console.log(d, o);
        if (dataAttuale > dataMessa) {
            this.variabiliGlobali.mostraMessaggio('Non si può eliminare oppure modificare un evento terminato', false);
            return;
        }

        // console.log(event);
        if (event.idTipologia === 1) {
            // this.selectedDay.date = event.start;
            // console.log('EVENTO:', event);
            this.appoID = event.id;
            this.idPartita = event.idPartita;
            this.editPartita = true;
        } else {
            this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
                panelClass: 'event-form-dialog',
                data      : {
                    event : event,
                    action: action
                }
            });

            this.dialogRef.afterClosed()
                .subscribe(response => {
                    if ( !response )
                    {
                        return;
                    }
                    // console.log('Chiusa maschera');
                    const actionType: string = response[0];
                    const formData: FormGroup = response[1];
                    switch ( actionType )
                    {
                        /**
                         * Save
                         */
                        case 'save':
                            this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());

                            const ds =  new Date(this.datepipe.transform(this.events[eventIndex].start, 'yyyy-MM-dd') + ' ' + this.events[eventIndex].oraStart).getTime();
                            const de =  new Date(this.datepipe.transform(this.events[eventIndex].end, 'yyyy-MM-dd') + ' ' + this.events[eventIndex].oraEnd).getTime();
                            const fs = this.datepipe.transform(ds, 'yyyy-MM-dd HH:mm:ss');
                            const fe = this.datepipe.transform(de, 'yyyy-MM-dd HH:mm:ss');
    
                            this.events[eventIndex].start = new Date(fs);
                            this.events[eventIndex].end = new Date(fe);

                            // console.log(this.events[eventIndex]);
                            // return;

                            this.apiService.modificaEventoConvocazioni(this.variabiliGlobali.CodAnnoSquadra, this.events[eventIndex], fs, fe)
                            .map(response2 => response2.text())
                            .subscribe(
                                data => {
                                if (data) {
                                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                                    if (data2.indexOf('ERROR') === -1) {
                                        this.refresh.next(true);
                                        this.variabiliGlobali.mostraMessaggio('Evento modificato', false);
                                    } else {
                                        // console.log(data2);
                                    }
                                }
                            });

                            break;
                        /**
                         * Delete
                         */
                        case 'delete':

                            this.deleteEvent(event);

                            break;
                    }
                });
        }
    }

    /**
     * Add Event
     */
    addEvent(): void
    {
        if (!this.selectedDay) {
            this.variabiliGlobali.mostraMessaggio('Prima selezionare una data', false);
            return;
        }

        this.idPartita = -1;
        this.ultimaAzione = 'ADD';
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                action: 'new',
                date  : this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                // console.log('After closed:', response);
                if ( !response )
                {
                    return;
                }
                const newEvent = response.getRawValue();
                const newEvent2 = response.getRawValue();
                
                // console.log(this.datepipe.transform(newEvent.start, 'yyyy-MM-dd') + ' ' + newEvent.orastart);
                // console.log(this.datepipe.transform(newEvent.end, 'yyyy-MM-dd') + ' ' + newEvent.oraend);

                const ds =  new Date(this.datepipe.transform(newEvent.start, 'yyyy-MM-dd') + ' ' + newEvent.orastart).getTime();
                const de =  new Date(this.datepipe.transform(newEvent.end, 'yyyy-MM-dd') + ' ' + newEvent.oraend).getTime();
                const fs = this.datepipe.transform(ds, 'yyyy-MM-dd HH:mm:ss');
                const fe = this.datepipe.transform(de, 'yyyy-MM-dd HH:mm:ss');
                newEvent.start = fs;
                newEvent.end = fe;

                // console.log(newEvent);
                // return;

                if (newEvent.tipologiaEvento === 1) {
                    this.appoID = newEvent.id;
                    this.appoEvent = newEvent;                    
                    this.riapreMaschera = !this.riapreMaschera;
                    this.editPartita = true;
                } else {
                    this.apiService.salvaEventoConvocazioni(this.variabiliGlobali.CodAnnoSquadra, newEvent)
                    .map(response2 => response2.text())
                    .subscribe(
                        data => {
                        if (data) {
                            const data2 = this.apiService.prendeSoloDatiValidi(data);
                            if (data2.indexOf('ERROR') === -1) {
                                // console.log(data2);
                                newEvent2.actions = this.actions;
                                this.events.push(newEvent2);
                                this.refresh.next(true);

                                this.setEvents();
    
                                this.variabiliGlobali.mostraMessaggio('Nuovo evento creato', false);
                            } else {
                                // console.log(data2);
                            }
                        }
                    });
                }
            });
    }

    chiusuraMaschera(e) {
        // console.log('Chiusura maschera:', e);

        this.selectedDay = null;
        this.idPartita = null;
        this.editPartita = false;

        if (e === '') {
            return;
        }

        const c = e.split(';');
        const ds =  new Date(this.datepipe.transform(c[1], 'yyyy-MM-dd') + ' ' + c[2]); // .getTime();
        const fs = this.datepipe.transform(ds, 'yyyy-MM-dd HH:mm:ss');

        const item: CalendarEventModel = {
            id: +this.appoID,
            idTipologia: 1,
            title : c[0],
            start : ds,
            oraStart: '',
            end   : ds,
            oraEnd: '',
            allDay: false,
            color : {
                primary  : '#a00',
                secondary: '#a0a'
            },
            meta  :
                {
                    location: c[4],
                    notes   : c[3]
                },
            idPartita: +c[5]
        };
        const orig = item;
        this.appoEvent = item;
        this.appoEvent.start = fs;
        this.appoEvent.end = fs;
        this.appoEvent.tipologiaEvento = 1;
        
        // console.log(this.appoEvent);
        // return;
        switch (this.ultimaAzione) {
            case 'ADD':
                this.apiService.salvaEventoConvocazioni(this.variabiliGlobali.CodAnnoSquadra, this.appoEvent)
                .map(response2 => response2.text())
                .subscribe(
                    data => {
                    if (data) {
                        const data2 = this.apiService.prendeSoloDatiValidi(data);
                        if (data2.indexOf('ERROR') === -1) {
                            // console.log(data2);
                            orig.actions = this.actions;
                            this.events.push(orig);
                            this.refresh.next(true);

                            this.setEvents();
                            this.variabiliGlobali.mostraMessaggio('Nuova convocazione creata', false);
                        } else {
                            // console.log(data2);
                        }
                    }
                });
                break;
            case 'EDIT':
                this.apiService.modificaEventoConvocazioni(this.variabiliGlobali.CodAnnoSquadra, this.appoEvent, fs, fs)
                .map(response2 => response2.text())
                .subscribe(
                    data => {
                    if (data) {
                        const data2 = this.apiService.prendeSoloDatiValidi(data);
                        if (data2.indexOf('ERROR') === -1) {
                            // console.log(data2);
                            orig.actions = this.actions;
                            this.events.push(orig);
                            this.refresh.next(true);

                            this.setEvents();
                            this.variabiliGlobali.mostraMessaggio('Convocazione modificata', false);
                        } else {
                            // console.log(data2);
                        }
                    }
                });
                break;
        }
        this.ultimaAzione = '';
        this.selectedDay = '';
        this.idPartita = -1;
    }
}
