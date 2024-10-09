import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { FormComponent } from './incident/form/form.component';

export const routes: Routes = [
    { path: '', redirectTo:'/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'incident', component: FormComponent },
    { path: '**', redirectTo: '/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }