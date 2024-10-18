import { LangChangeEvent, TranslateModule, TranslateService } from "@ngx-translate/core";
import { StorageService } from "../../common/storage.service";
import { TokenService } from "../../common/token.service";
import { DashboardComponent } from "./dashboard.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let translateServiceMock: any;
  let translateService: any;

  beforeEach(async () => {
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['startTokenValidationCheck']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['getItem']);
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
        provideRouter([]) 
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start token validation check on init', () => {
    component.ngOnInit();
    expect(tokenServiceSpy.startTokenValidationCheck).toHaveBeenCalled();
  });

  it('should set language from storage on init', () => {
    mockStorageService.getItem.and.returnValue(JSON.stringify({ 'user_type': 'agente' })); 
    
    component.ngOnInit();
    
    expect(mockStorageService.getItem).toHaveBeenCalledWith('language');
  });


  it('should load currentMenuUser based on user_type from decoded token', () => {
    mockStorageService.getItem.and.returnValue(JSON.stringify({ 'user_type': 'agente' })); 
    component.ngOnInit();

    expect(component.currentMenuUser).toEqual(component.menuUsers['agente']);
  });

  it('should console log the user_type during ngOnInit', () => {
    const consoleSpy = spyOn(console, 'log');
    const decodedToken = JSON.stringify({ user_type: 'cliente' });
    mockStorageService.getItem.and.callFake((key: string) => {
      if (key === 'decodedToken') {
        return decodedToken;
      }
      return null;
    });

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith('cliente');
  });
});