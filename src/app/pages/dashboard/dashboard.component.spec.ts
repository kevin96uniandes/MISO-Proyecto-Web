import { LangChangeEvent, TranslateModule, TranslateService } from "@ngx-translate/core";
import { StorageService } from "../../common/storage.service";
import { TokenService } from "../../common/token.service";
import { DashboardComponent } from "./dashboard.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";
import {of, throwError} from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import {DashboardService} from "./dashboard.service";
import {PlanService} from "../plan/plan.service";
import {FormControl, FormGroup} from "@angular/forms";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockPlanService: jasmine.SpyObj<PlanService>;
  let translateServiceMock: any;
  let translateService: any;

  beforeEach(async () => {
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['startTokenValidationCheck','stopTokenValidationCheck']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['getItem', 'clear']);
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['predict']);
    mockPlanService = jasmine.createSpyObj('PlanService', ['getActivePlan'])
    mockStorageService.getItem.and.returnValue(JSON.stringify({ 'user_type': 'agente' }));

    translateService = jasmine.createSpyObj('TranslateService', ['use', 'get', 'setDefaultLang']);
    translateServiceMock = {
      currentLang: 'es',
      onLangChange: new EventEmitter<LangChangeEvent>(),
      setDefaultLang: translateService.setDefaultLang.and.returnValue(of({})),
      use: translateService.get,
      get: translateService.get.and.returnValue(of('')),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };

    translateServiceMock.get.and.returnValue(of({}));
    translateServiceMock.use.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent, BrowserAnimationsModule
      ],
      providers: [
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: StorageService, useValue: mockStorageService },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: PlanService, useValue: mockPlanService },
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.iaPredictionForm = new FormGroup({
      context: new FormControl('')
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start token validation check on init', () => {
    mockPlanService.getActivePlan.and.returnValue(of({'plan_id': 1}));
    component.ngOnInit();
    expect(tokenServiceSpy.startTokenValidationCheck).toHaveBeenCalled();
  });

  it('should set language from storage on init', () => {
    mockStorageService.getItem.and.returnValue(JSON.stringify({ 'user_type': 'agente' }));
    mockPlanService.getActivePlan.and.returnValue(of({'plan_id': 1}));
    component.ngOnInit();

    expect(mockStorageService.getItem).toHaveBeenCalledWith('language');
  });


  it('should load currentMenuUser based on user_type from decoded token', () => {
    mockStorageService.getItem.and.returnValue(JSON.stringify({ 'user_type': 'agente' }));
    mockPlanService.getActivePlan.and.returnValue(of({'plan_id': 1}));
    component.ngOnInit();

    expect(component.currentMenuUser).toEqual(component.menuUsers['agente']);
  });

  it('should show ia chat when active plan is greater than 2', () => {
    const decodedToken = JSON.stringify({ user_type: 'cliente' });
    mockStorageService.getItem.and.callFake((key: string) => {
      if (key === 'decodedToken') {
        return decodedToken;
      }
      return null;
    });
    mockPlanService.getActivePlan.and.returnValue(of({'plan_id': 2}));
    component.ngOnInit()
    component.ngAfterViewChecked();

    expect(component.isVisibleChatbot).toBeTruthy();
  });

  it('should stop validate token when logout', () => {
    component.logOut()
    expect(mockStorageService.clear).toHaveBeenCalled();
    expect(tokenServiceSpy.stopTokenValidationCheck).toHaveBeenCalled();
  });

  it('debería añadir una respuesta de usuario y hacer la solicitud cuando el contexto no está vacío', () => {
    component.iaPredictionForm.setValue({ context: 'Hola IA' });
    mockDashboardService.predict.and.returnValue(of({ prediction: 'Respuesta de IA' }));

    component.sendRequest(component.iaPredictionForm.value);

    expect(component.responses).toContain(jasmine.objectContaining({ type: 'USER', context: 'Hola IA' }));
    expect(component.isLoading).toBeFalse();
    expect(component.responses).toContain(jasmine.objectContaining({ type: 'IA', context: 'Respuesta de IA' }));
  });

  it('debería establecer isLoading en true mientras espera la respuesta y en false después', () => {
    component.iaPredictionForm.setValue({ context: 'Test' });
    const response = { prediction: 'Predicción exitosa' };
    mockDashboardService.predict.and.returnValue(of(response));

    component.sendRequest(component.iaPredictionForm.value);
    expect(component.isLoading).toBeFalse();
  });

  it('debería restablecer el formulario después de enviar la solicitud', () => {
    component.iaPredictionForm.setValue({ context: 'Otro mensaje' });
    mockDashboardService.predict.and.returnValue(of({ prediction: 'Predicción IA' }));

    component.sendRequest(component.iaPredictionForm.value);
    expect(component.iaPredictionForm.value.context).toBeNull();
  });

  it('debería manejar un error y establecer isLoading en false', () => {
    component.iaPredictionForm.setValue({ context: 'Hola IA' });
    mockDashboardService.predict.and.returnValue(throwError(() => new Error('Error')));

    component.sendRequest(component.iaPredictionForm.value);

    expect(component.isLoading).toBeFalse();
  });

  it('debería manejar el error y establecer activePlanId como null', () => {
    // Configurar el servicio simulado para devolver un error
    const mockError = new Error('Error en la solicitud');
    mockPlanService.getActivePlan.and.returnValue(throwError(() => mockError));

    spyOn(console, 'error'); // Espiar el método console.error

    component.getActivePlan();

    // Comprobar que activePlanId se establece en null
    expect(component.activePlanId).toBeNull();

    // Verificar que el error se haya registrado en la consola
    expect(console.error).toHaveBeenCalledWith('Error al obtener el plan activo:', mockError);
  });
});
