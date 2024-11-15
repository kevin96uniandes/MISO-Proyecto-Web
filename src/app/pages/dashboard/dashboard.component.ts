import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {MatDrawerContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatFormFieldModule, MatSuffix} from "@angular/material/form-field";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {TokenService} from "../../common/token.service";
import { StorageService } from '../../common/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {IAPrediction} from "./IAPrediction";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {ResponseChat} from "./ResponseChat";
import {DashboardService} from "./dashboard.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PlanService} from "../plan/plan.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatDrawerContainer,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatNavList,
    MatListItem,
    MatLine,
    NgOptimizedImage,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    CdkTextareaAutosize,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements AfterViewChecked {
  responses: ResponseChat[] = [];
  iaPredictionForm: FormGroup;
  @ViewChild('responseContainer') private responseContainer!: ElementRef;
  isLoading: boolean = false;
  activePlanId: number | null = null;
  isVisibleChatbot = false;

  menuUsers: any = {
    cliente: {
      'perfil': true,
      'incidentes': true,
      'agentes': true,
      'planes': true,
      'dashboard': true,
      'resportes': true,
      'facturas': true,
      'salir': true
    },
    agente: {
      'perfil': true,
      'incidentes': true,
      'agentes': false,
      'planes': false,
      'dashboard': false,
      'resportes': false,
      'facturas': false,
      'salir': true
    }
  };

  currentMenuUser = this.menuUsers['cliente']

  constructor(
    private tokenService: TokenService,
    private storageService: StorageService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private planService: PlanService

  ) {
    this.tokenService.startTokenValidationCheck();

    this.iaPredictionForm = this.formBuilder.group({
      context: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    console.log(decoded["user_type"]);
    const userType = decoded["user_type"];

    this.currentMenuUser = this.menuUsers[userType]
    console.log(this.currentMenuUser);

    this.getActivePlan();
  }

  ngAfterViewChecked() {
    if (this.activePlanId != null && this.activePlanId >= 2){
      this.isVisibleChatbot = true;
      this.scrollToBottom();
    }
  }

  logOut(){
    this.storageService.clear();
    this.tokenService.stopTokenValidationCheck();
  }

  sendRequest(iaPredict: IAPrediction) {
    if (iaPredict.context.trim()) {
      this.responses.push(
        new ResponseChat(
            'USER',
            iaPredict.context
          )
        );

      this.isLoading = true;

      this.dashboardService.predict(this.iaPredictionForm.value)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.responses.push(
              new ResponseChat(
                'IA',
                res.prediction
              )
            );
          },
          error: () => {
            this.isLoading = false;
          }
      })
    }

    this.iaPredictionForm.reset()
  }

  private scrollToBottom(): void {
    try {
      this.responseContainer.nativeElement.scrollTop = this.responseContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  getActivePlan() {
    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    const companyId = decoded["id_company"];
    this.planService.getActivePlan(companyId).subscribe({
        next: (response) => {
          this.activePlanId = response.plan_id;
          console.log('Plan activo' + this.activePlanId)
        },
        error: (error) => {
          console.error('Error al obtener el plan activo:', error);
          this.activePlanId = null;
        }
      }
    );
  }
}

