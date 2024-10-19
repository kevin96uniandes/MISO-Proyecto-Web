import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlanService } from './plan.service';
import { environment } from '../../../environments/environment';
import { Contract } from './select-plan/Contract';

describe('PlanService', () => {
  let service: PlanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanService]
    });
    service = TestBed.inject(PlanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getActivePlan', () => {
    it('should return an Observable<any> with the active plan', () => {
      const dummyPlan = { id: 1, name: 'Basic Plan', active: true };
      const empresaId = 123;

      service.getActivePlan(empresaId).subscribe(plan => {
        expect(plan).toEqual(dummyPlan);
      });

      const req = httpMock.expectOne(`${environment.planUrl}get/${empresaId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyPlan);
    });
  });

  describe('#updateContract', () => {
    it('should update the contract and return an Observable<any>', () => {
      const dummyResponse = { success: true };
      const updateContract: Contract = { empresa_id: 123, new_plan_id: 456 };

      service.updateContract(updateContract).subscribe(response => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${environment.planUrl}update/contract`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        empresa_id: updateContract.empresa_id,
        new_plan_id: updateContract.new_plan_id
      });
      req.flush(dummyResponse);
    });
  });
});
