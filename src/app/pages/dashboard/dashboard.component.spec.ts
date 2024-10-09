import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from "@angular/common/http";

import { DashboardComponent } from './dashboard.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {NgOptimizedImage} from "@angular/common";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        NgOptimizedImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
