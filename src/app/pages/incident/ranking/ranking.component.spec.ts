import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IncidentService } from '../incident.service';
import { RankingComponent } from './ranking.component';
import { Person } from '../../auth/person';
import { Product } from '../product';
import { Call } from '../calls';
import { Incident } from '../incident';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('RankingComponent', () => {
  let component: RankingComponent;
  let fixture: ComponentFixture<RankingComponent>;
  let incidentServiceMock: any;
  let routerMock: any;

  beforeEach(waitForAsync(() => {
    incidentServiceMock = jasmine.createSpyObj('IncidentService', ['getIncidentByIdPerson', 'getCallsByIdPerson', 'getProductsByPerson']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    incidentServiceMock.getIncidentByIdPerson.and.returnValue(of([]));  
    incidentServiceMock.getCallsByIdPerson.and.returnValue(of([]));    
    incidentServiceMock.getProductsByPerson.and.returnValue(of([])); 

    TestBed.configureTestingModule({
      imports: [
        RankingComponent,
        MatPaginatorModule,
        MatTableModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        { provide: IncidentService, useValue: incidentServiceMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingComponent);
    component = fixture.componentInstance;
    component.person = { id: 1 } as Person;  
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load incidents data and set paginator', () => {
    const mockIncidents: Incident[] = [
      { 
        id: 1, 
        codigo: 'INC001', 
        descripcion: 'Descripción de incidente', 
        asunto: 'Problema con el sistema', 
        fecha_creacion: new Date(), 
        fecha_actualizacion: new Date(), 
        canal_id: 2, 
        usuario_creador_id: 1, 
        usuario_asignado_id: 2, 
        persona_id: 1, 
        estado_id: 1, 
        tipo_id: 1 
      }
    ];
    incidentServiceMock.getIncidentByIdPerson.and.returnValue(of(mockIncidents));

    component.ngAfterViewInit();

    expect(component.dataIncidents.data).toEqual(mockIncidents);
    expect(component.dataIncidents.paginator).toBe(component.paginatorIncidents);
  });

  it('should load calls data and set paginator', () => {
    const mockCalls: Call[] = [
      { 
        id: 1, 
        nombre_grabacion: 'call001.wav', 
        duracion: '00:05:23', 
        fecha_hora_llamada: new Date(), 
        fecha_creacion: new Date(), 
        fecha_actualizacion: new Date(), 
        incidencia_id: 1, 
        persona_id: 1, 
        usuario_id: 2 
      }
    ];
    
    incidentServiceMock.getCallsByIdPerson.and.returnValue(of(mockCalls));

    component.ngAfterViewInit();

    expect(component.dataCalls.data).toEqual(mockCalls);
    expect(component.dataCalls.paginator).toBe(component.paginatorCalls);
  });

  it('should load products data and set paginator', () => {
    const mockProducts: Product[] = [
      { 
        descripcion: 'Producto A', 
        fecha_actualizacion: '2023-10-01', 
        fecha_creacion: '2023-01-01', 
        id: 1, 
        nombre_producto: 'Laptop', 
        tipo: 'Electrónico' 
      }
    ];
    
    incidentServiceMock.getProductsByPerson.and.returnValue(of(mockProducts));

    component.ngAfterViewInit();

    expect(component.dataProducts.data).toEqual(mockProducts);
    expect(component.dataProducts.paginator).toBe(component.paginatorProducts);
  });

  it('should navigate to create incident with person data', () => {
    component.createIncident();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard/incident'], { state: { person: component.person } });
  });
});
