import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListAgentsComponent } from './list-agents.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ListAgentsComponent', () => {
  let component: ListAgentsComponent;
  let fixture: ComponentFixture<ListAgentsComponent>;
  let router: Router;

  beforeEach(async () => {
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAgentsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct displayedColumns', () => {
    expect(component.displayedColumns).toEqual(['acciones', 'identificacion', 'nombreCompleto', 'correoElectronico', 'telefono']);
  });

  it('should initialize dataSource with AGENTES_DATA', () => {
    expect(component.dataSource.data.length).toBe(10);
  });

  it('should navigate to create agent page when createAgent is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.createAgent();
    expect(navigateSpy).toHaveBeenCalledWith(['/register/agent']);
  });

  it('should filter dataSource when applyFilter is called', () => {
    const event = { target: { value: 'Melisent' } } as unknown as Event;
    component.applyFilter(event);

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].nombreCompleto).toBe('Melisent Done');
  });

  it('should reset to the first page after applying a filter', () => {
    const paginatorSpy = spyOn(component.paginator, 'firstPage');
    const event = { target: { value: 'Melisent' } } as unknown as Event;
    component.applyFilter(event);

    expect(paginatorSpy).toHaveBeenCalled();
  });
});
