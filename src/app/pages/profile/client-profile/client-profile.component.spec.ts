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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';


describe('ClientProfileComponent', () => {
  let component: ClientProfileComponent;
  let fixture: ComponentFixture<ClientProfileComponent>;
  let router: Router;
  let translateService: any;
  let translateServiceMock: any;
  let storageServiceMock: jasmine.SpyObj<StorageService>;
  let profileServiceMock: jasmine.SpyObj<ProfileService>;

  const mockAgents = [
    {
      id: 1,
      nombre_usuario: 'user1',
      numero_identificacion: '123',
      nombre_completo: 'User One',
      telefono: '123456789',
      correo_electronico: 'user1@example.com',
    },
    {
      id: 2,
      nombre_usuario: 'user2',
      numero_identificacion: '456',
      nombre_completo: 'User Two',
      telefono: '987654321',
      correo_electronico: 'user2@example.com',
    }
  ];

  beforeEach(async () =>  {
    
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getAgentsByIdCompany']);
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

    
    await TestBed.configureTestingModule({
      imports: [ 
        ClientProfileComponent, 
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
       ]
    }).compileComponents();
  
  profileServiceMock = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
  storageServiceMock = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  storageServiceMock.getItem.and.returnValue(JSON.stringify({ id_company: 2 }));
  profileServiceMock.getAgentsByIdCompany.and.returnValue(of(mockAgents));

  fixture = TestBed.createComponent(ClientProfileComponent);
  component = fixture.componentInstance;
  router = TestBed.inject(Router);
  fixture.detectChanges();

});
  
it('should create', () => {
  expect(component).toBeTruthy();
});
  
});
