import { Routes } from '@angular/router';
import { FormLogin } from './components/auth/form-login/form-login';
import { FormRegister } from './components/auth/form-register/form-register';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { DashboardForm } from './components/dashboard/dashboard-form/dashboard-form';
import { authGuard } from './guard/auth-guard';
export const routes: Routes = [
    {
        path: 'login',
        component: FormLogin
    },
    {
        path: 'register',
        component: FormRegister
    },
    {
        path: 'forgot-password',
        component: ForgotPassword
    },
    {
        path: 'dashboard',
        component: DashboardForm,
        canActivate: [authGuard],
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];