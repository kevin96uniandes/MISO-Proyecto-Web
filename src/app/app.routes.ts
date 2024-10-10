import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NgModule } from '@angular/core';
import {HomeComponent} from "./pages/dashboard/home/home.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {AuthGuard} from "./pages/auth/auth.guard";
import {DashboardGuard} from "./pages/dashboard/dashboard.guard";
import { FormComponent } from './pages/incident/form/form.component';
import { RankingComponent } from './pages/incident/ranking/ranking.component';
import { UserQueryComponent } from './pages/incident/user-query/user-query.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent },
      { path: '**', redirectTo: 'dashboard/home' }
    ]
  },
  { path: 'incident', component: FormComponent },
  { path: 'user-query', component: UserQueryComponent },
  { path: 'ranking', component: RankingComponent },
  { path: '', redirectTo:'/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
