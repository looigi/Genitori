import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { LoginComponent } from './login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { VariabiliGlobali } from 'app/global.component';
import { HttpClient } from '../../../../src/app/services/httpclient.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ApiService } from 'app/services/api.service';
import { ForgotPassword2Module } from 'app/main/forgot-password-2/forgot-password-2.module';
import { DatePickerModule } from 'app/componenti/datepicker/DatePickerModule';

const routes = [
    {
        path     : 'login',
        component: LoginComponent
    },
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule,

        HttpModule,
        HttpClientModule,
        ForgotPassword2Module,
        DatePickerModule
    ],
    providers: [
        VariabiliGlobali,
        HttpClient,
        ApiService
    ],
    exports     : [
        LoginComponent
    ]
})

export class LoginModule
{
}
