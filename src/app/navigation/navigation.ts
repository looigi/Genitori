import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'home',
                title    : 'Home',
                translate: 'NAV.HOME.TITLE',
                type     : 'item',
                icon     : 'home',
                url      : '/home',
            },
            {
                id       : 'genitori',
                title    : 'genitori',
                translate: 'NAV.GENITORI.TITLE',
                type     : 'collapsable',
                icon     : 'child_care',
                children : [
                    {
                        id        : 'scelta_mails',
                        title     : 'scelta_mails',
                        translate: 'NAV.SCELTA_MAILS.TITLE',
                        type      : 'item',
                        icon     : 'alternate_emails',
                        url       : '/scelta_mails',
                        exactMatch: true
                    },
                    {
                        id        : 'documentazione',
                        title     : 'documentazione',
                        translate: 'NAV.DOCUMENTAZIONE.TITLE',
                        type      : 'item',
                        icon     : 'library_books',
                        url       : '/documentazione',
                        exactMatch: true
                    },
                    {
                        id        : 'contatti',
                        title     : 'Contatti',
                        translate: 'NAV.CONTATTI.TITLE',
                        type      : 'item',
                        icon     : 'account_circle',
                        url       : '/contatti',
                        exactMatch: true
                    },
                ]
            },
        ]
    }
];
