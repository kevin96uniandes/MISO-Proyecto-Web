/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, flush, tick} from '@angular/core/testing';
import { ClientProfileComponent } from './client-profile.component';
import { ProfileService } from '../profile.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../common/storage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../auth/user';



describe('ClientProfileComponent', () => {
  let component: ClientProfileComponent;
  let fixture: ComponentFixture<ClientProfileComponent>;
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

  const mockIncidences = [
    {
      id: 123,
      codigo: 'INC-001',
      descripcion: 'Error in production system',
      asunto: 'System malfunction',
      fecha_creacion: new Date('2024-11-19T08:30:00'),
      fecha_actualizacion: new Date('2024-11-19T10:00:00'),
      canal_id: 1,
      canal_nombre: 1,
      usuario_creador_id: 1,
      usuario_asignado_id: 1,
      persona_id: 1,
      estado_id: 1,
      tipo_id: 1
    },
    {
      id: 124,
      codigo: 'INC-002',
      descripcion: 'Error in production system',
      asunto: 'System malfunction',
      fecha_creacion: new Date('2024-11-19T08:30:00'),
      fecha_actualizacion: new Date('2024-11-19T10:00:00'),
      canal_id: 1,
      canal_nombre: 1,
      usuario_creador_id: 1,
      usuario_asignado_id: 1,
      persona_id: 1,
      estado_id: 1,
      tipo_id: 1
    }
  ]

  const mockUser: User = {
    id: 1,
    id_persona: 1,
    id_empresa: 1,
    id_tipousuario: 1,
    nombre_usuario: 'jdoe',
    contrasena: 'securePassword123',
    fecha_creacion: new Date('2024-01-01T00:00:00'),
    fecha_actualizacion: new Date('2024-11-16T12:00:00'),
    es_activo: true
  };

  const userId = 1;



  beforeEach(async () =>  {
    
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getAgentsByIdCompany', 'getIncidences', 'getUser']);
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
  profileServiceMock.getIncidences.and.returnValue(of(mockIncidences));
  profileServiceMock.getUser.and.returnValue(of(mockUser));

  fixture = TestBed.createComponent(ClientProfileComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();

});
  
it('should create', () => {
  expect(component).toBeTruthy();
});

it('should fetch agents', () => {
  expect(profileServiceMock.getAgentsByIdCompany).toHaveBeenCalledWith(2);
  expect(component.dataAgents.data.length).toBe(2); 
});

it('should fetch user', () => {
  expect(profileServiceMock.getUser).toHaveBeenCalled();
});

it('should fetch incidences', () => {
  expect(profileServiceMock.getIncidences).toHaveBeenCalled();
});

});
