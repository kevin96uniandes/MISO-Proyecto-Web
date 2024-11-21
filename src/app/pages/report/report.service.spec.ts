import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { environment } from '../../../environments/environment';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService],
    });

    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveReport', () => {
    it('should call POST and return a Blob response', () => {
      const mockReportData = { name: 'Sample Report' };
      const mockBlobResponse = new Blob(['test'], { type: 'application/pdf' });

      service.saveReport(mockReportData).subscribe((response) => {
        expect(response).toEqual(mockBlobResponse);
        expect(response instanceof Blob).toBeTrue();
      });

      const req = httpMock.expectOne(`${environment.reportUrl}generate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockReportData);

      req.flush(mockBlobResponse);
    });
  });
});
