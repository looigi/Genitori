import { CalendarEventModel } from './event.model';

export interface EventActionAllungata {
    id?: string | number;
    label: string;
    cssClass?: string;
    a11yLabel?: string;
    onClick({ event, sourceEvent }: {
        event: CalendarEventModel;
        sourceEvent: MouseEvent | KeyboardEvent;
    }): any;
}
export interface WeekDay {
    date: Date;
    day: number;
    isPast: boolean;
    isToday: boolean;
    isFuture: boolean;
    isWeekend: boolean;
    cssClass?: string;
}
export interface VistaMese<MetaType = any> extends WeekDay {
    inMonth: boolean;
    events: CalendarEventModel[];
    backgroundColor?: string;
    badgeTotal: number;
    meta?: MetaType;
}

