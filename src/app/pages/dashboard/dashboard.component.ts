import { Component } from '@angular/core';
import {RouterModule} from "@angular/router";
import {MatDrawerContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatSuffix} from "@angular/material/form-field";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatDrawerContainer, MatIcon, MatIconButton, MatSuffix, MatNavList, MatListItem, MatLine, NgOptimizedImage],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
