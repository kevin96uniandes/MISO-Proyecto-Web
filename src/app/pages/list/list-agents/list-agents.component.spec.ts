import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListAgentsComponent } from './list-agents.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ListService } from '../list.service';
import { StorageService } from '../../../common/storage.service';

describe('ListAgentsComponent', () => {
  let component: ListAgentsComponent;
  let fixture: ComponentFixture<ListAgentsComponent>;
  let router: Router;
  let translateService: any;
  let translateServiceMock: any;
  let listAgentServiceMock: jasmine.SpyObj<ListService>;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  const mockAgents = [
    {
      nombre_usuario: 'user1',
      numero_identificacion: '123',
      nombre_completo: 'User One',
      telefono: '123456789',
      correo_electronico: 'user1@example.com',
    },
    {
      nombre_usuario: 'user2',
      numero_identificacion: '456',
      nombre_completo: 'User Two',
      telefono: '987654321',
      correo_electronico: 'user2@example.com',
    }
  ];

  beforeEach(async () => {

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

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ListAgentsComponent
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: ListService, useValue: listServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
       ]

    }).compileComponents();

    listAgentServiceMock = TestBed.inject(ListService) as jasmine.SpyObj<ListService>;
    storageServiceMock = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    storageServiceMock.getItem.and.returnValue(JSON.stringify({ id_company: 2 }));
    listAgentServiceMock.getAgentsByIdCompany.and.returnValue(of(mockAgents));

    fixture = TestBed.createComponent(ListAgentsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch agents on init and set the data source', () => {
    expect(listAgentServiceMock.getAgentsByIdCompany).toHaveBeenCalledWith(2);
    expect(component.dataAgents.data.length).toBe(2); 
  });

  it('should set paginator and sort after view initialization', () => {
    const paginator = component.paginator;
    const sort = component.sort;

    expect(component.dataAgents.paginator).toBe(paginator);
    expect(component.dataAgents.sort).toBe(sort);
  });

  it('should filter data correctly when applyFilter is called', () => {
    const event = { target: { value: 'user1' } } as unknown as Event;
    component.applyFilter(event);

    expect(component.dataAgents.filter).toBe('user1');
    expect(component.dataAgents.filteredData.length).toBe(1);
    expect(component.dataAgents.filteredData[0].nombre_usuario).toBe('user1');
  });

  it('should navigate to register agent when createAgent is called', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.createAgent();
    expect(routerSpy).toHaveBeenCalledWith(['/dashboard/register/agent']);
  });
});
