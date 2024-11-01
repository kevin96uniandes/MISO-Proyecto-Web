import { ComponentFixture, TestBed } from '@angular/core/testing';


import { CallrecorddetailsComponent } from './callrecorddetails.component';

import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateModule} from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorageService } from '../../../common/storage.service';
import { IncidentService } from '../incident.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


describe('CallRecordsDetailComponent', () => {
    let storageServiceSpy: jasmine.SpyObj<StorageService>;
    let incidentServiceSpy: jasmine.SpyObj<IncidentService>;
    let component: CallrecorddetailsComponent;
    let activatedRoute: ActivatedRoute;
    let mockRouter: jasmine.SpyObj<Router>;
    let translateService: any;
    let translateServiceMock: any;
    let fixture: ComponentFixture<CallrecorddetailsComponent>;
    let cdr: ChangeDetectorRef;


    beforeEach(async () => {
      translateService = jasmine.createSpyObj('TranslateService', ['use', 'get']);
      translateServiceMock = {
        currentLang: 'es',
        use: translateService.get,
        get: translateService.get.and.returnValue(of(''))
      };
      mockRouter = jasmine.createSpyObj('Router', ['navigate']); 
      translateServiceMock.get.and.returnValue(of({}));
      incidentServiceSpy = jasmine.createSpyObj('IncidentService', ['createIncident']);
      storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
      const activatedRouteSpy = { snapshot: { paramMap: { get: () => '1' } } };


      await TestBed.configureTestingModule({
        imports: [CallrecorddetailsComponent, ReactiveFormsModule, BrowserAnimationsModule, TranslateModule.forRoot()],
        
        providers: [
          { provide: IncidentService, useValue: incidentServiceSpy },
          { provide: Router, useValue: mockRouter },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          ChangeDetectorRef,
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: Location,
            useValue: { back: jasmine.createSpy('back') }, 
          }
        ],
        
      })
      .compileComponents();
  
      fixture = TestBed.createComponent(CallrecorddetailsComponent);
      component = fixture.componentInstance;
      cdr = TestBed.inject(ChangeDetectorRef);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    
    /*
    it('should have a defined form', () => {
      
      const selectedCall = {
        "nombre_grabacion": "the best record",
        "duracion": "120",
        "fecha_hora_llamada": Date.now()
      };

      expect(component.callForm).toBeTruthy();
    });
    */

  });