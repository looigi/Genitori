import { CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';

export class CalendarEventModel
{
    id: number;
    idTipologia: number;
    start: Date;
    oraStart: string;
    end?: Date;
    oraEnd: string;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: {
        location: string,
        notes: string
    };
    idPartita: number;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data?)
    {
        this.id = data.id || -1;
        this.idTipologia = data.idTipologia || -1;
        data = data || {};
        this.start = new Date(data.start) || startOfDay(new Date());
        this.oraStart = '00:00';
        this.end = new Date(data.end) || endOfDay(new Date());
        this.oraEnd = '00:00';
        this.title = data.title || '';
        this.color = {
            primary  : data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || true,
            afterEnd   : data.resizable && data.resizable.afterEnd || true
        };
        this.actions = data.actions || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes   : data.meta && data.meta.notes || ''
        };
        this.idPartita = data.idPartita || -1;
    }
}
