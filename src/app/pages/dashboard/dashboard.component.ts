import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import {MatDrawerContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatSuffix} from "@angular/material/form-field";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {TokenService} from "../../common/token.service";
import { StorageService } from '../../common/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, MatSidenavModule, MatDrawerContainer, MatIcon, MatIconButton, MatSuffix, MatNavList, MatListItem, MatLine, NgOptimizedImage],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

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
    private translate: TranslateService

  ) {
    this.tokenService.startTokenValidationCheck();
  }

  ngOnInit(): void {
    const lang = this.storageService.getItem("language")
    this.translate.use(lang || 'es')

    let decoded = JSON.parse(this.storageService.getItem("decodedToken")!!);
    console.log(decoded["user_type"]);
    const userType = decoded["user_type"];

    this.currentMenuUser = this.menuUsers[userType]
    console.log(this.currentMenuUser);

  }
}
