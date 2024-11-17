/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClientProfileComponent } from './client-profile.component';
import { ProfileService } from '../profile.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ClientProfileComponent', () => {
  let component: ClientProfileComponent;
  let fixture: ComponentFixture<ClientProfileComponent>;
  let router: Router;
  let translateService: any;
  let translateServiceMock: any;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(waitForAsync(() => {
    
    const listServiceSpy = jasmine.createSpyObj('ListService', ['getAgentsByIdCompany']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    translateService = jasmine.createSpyObj('TranslateService', ['use', 'get']);

    translateServiceMock = {
      currentLang: 'es',
      onLangChange: new EventEmitter<LangChangeEvent>(),
      use: translateService.get,
      get: translateService.get.and.returnValue(of('')),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };

    translateServiceMock.get.and.returnValue(of({})); 
    translateServiceMock.use.and.returnValue(of({}));

    

    TestBed.configureTestingModule({
      imports: [ ClientProfileComponent, NoopAnimationsModule, ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: ProfileService, useValue: listServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
       ]
    })
    
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */

  
});
