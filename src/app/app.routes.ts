import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NgModule } from '@angular/core';
import {HomeComponent} from "./pages/dashboard/home/home.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {AuthGuard} from "./pages/auth/auth.guard";
import {DashboardGuard} from "./pages/dashboard/dashboard.guard";
import { FormComponent } from './pages/incident/form/form.component';
import { RegisterClientComponent } from './pages/register/register-client/register-client.component';
import { RegisterAgentComponent } from './pages/register/register-agent/register-agent.component';
import { ListAgentsComponent } from './pages/list/list-agents/list-agents.component';

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
  { path: 'register/client', component: RegisterClientComponent },
  { path: 'register/agent', component: RegisterAgentComponent },
  { path: 'list/agents', component: ListAgentsComponent },
  { path: '', redirectTo:'/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
