import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './auth/login/login';
import { authGuard } from './auth/guards/auth.guard';
import { Enquete } from './pages/enquete/enquete';
import { NgModule } from '@angular/core';
import { Register } from './auth/register/register';
import { Email } from './components/email/email';
import { Enquetes } from './pages/enquetes/enquetes';
import { ResponsesList } from './responses-list/responses-list';
export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth/login', component: Login },
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'enquetes', component: Enquetes, canActivate: [authGuard] },
    { path: 'enquetes/:id_enquete', component: Enquete, data: { renderMode: 'client' } },
    { path: 'register', component: Register },
    { path: 'emails', component: Email, canActivate: [authGuard] },
    { path: 'dashboard', component: Home, canActivate: [authGuard] },
    {path : "responses", component:ResponsesList,  canActivate: [authGuard]}
  ];
  
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}