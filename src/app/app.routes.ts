import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from "./pages/dashboard/home/home.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { AuthGuard } from "./pages/auth/auth.guard";
import { DashboardGuard } from "./pages/dashboard/dashboard.guard";
import { FormComponent } from './pages/incident/form/form.component';
import { RankingComponent } from './pages/incident/ranking/ranking.component';
import { UserQueryComponent } from './pages/incident/user-query/user-query.component';
import { ListAgentsComponent } from './pages/list/list-agents/list-agents.component';
import { SelectPlanComponent } from './pages/plan/select-plan/select-plan.component';
import { RegisterClientComponent } from './pages/register/register-client/register-client.component';
import { RegisterAgentComponent } from './pages/register/register-agent/register-agent.component';
import { ListComponent } from './pages/incident/list/list.component';
import { DetailComponent } from './pages/incident/detail/detail.component';
import { CallrecorddetailsComponent } from './pages/incident/callrecorddetails/callrecorddetails.component';
import { RoleGuard } from './pages/dashboard/role.guard';
import { ClientProfileComponent } from './pages/profile/client-profile/client-profile.component';
import { DetailInvoiceComponent } from './pages/invoice/detail-invoice/detail-invoice.component';
import { PaymentMethodComponent } from './pages/invoice/payment-method/payment-method.component';
import { BoardComponent } from './pages/board/board.component';
import { ReportComponent } from './pages/report/report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent },
      { path: '**', redirectTo: 'dashboard/home' },
      { path: 'user-query', component: UserQueryComponent, canActivate: [RoleGuard], data: { role: 'agente' }  },
      { path: 'incident', component: FormComponent, canActivate: [RoleGuard], data: { role: 'agente' } },
      { path: 'ranking', component: RankingComponent, canActivate: [RoleGuard], data: { role: 'agente' } },
      { path: 'incident/list', component: ListComponent },
      { path: 'incident/detail/:id', component: DetailComponent },
      { path: 'list/agents', component: ListAgentsComponent, data: { role: 'cliente' }  },
      { path: 'register/agent', component: RegisterAgentComponent, data: { role: 'cliente' }  },
      { path: 'plans', component: SelectPlanComponent, data: { role: 'cliente' }  },
      { path: 'details-call', component: CallrecorddetailsComponent, data: { role: 'cliente' } },
      { path: 'board', component: BoardComponent, data: { role: 'cliente' }},
      { path: 'report', component: ReportComponent, data: { role: 'cliente' }}
      { path: 'profile', component: ClientProfileComponent},
      { path: 'invoice', component: DetailInvoiceComponent, canActivate: [RoleGuard], data: { role: 'cliente' }  },
      { path: 'invoice/payment-method/:invoice_id', component: PaymentMethodComponent, canActivate: [RoleGuard], data: { role: 'cliente' }  }
      { path: 'list/agents', component: ListAgentsComponent }
    ]
  },
  { path: 'register/client', component: RegisterClientComponent },
  { path: '', redirectTo:'/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
