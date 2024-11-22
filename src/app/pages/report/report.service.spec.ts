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

  describe('sendReportByEmail', () => {
    it('should call POST and return a Blob response', () => {
      const mockEmailData = { email: 'test@example.com', reportId: '12345' };
      const mockBlobResponse = new Blob(['Email sent'], { type: 'text/plain' });

      service.sendReportByEmail(mockEmailData).subscribe((response) => {
        expect(response).toEqual(mockBlobResponse);
        expect(response instanceof Blob).toBeTrue();
      });

      const req = httpMock.expectOne(`${environment.reportUrl}sendemail`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEmailData);

      req.flush(mockBlobResponse);
    });

    it('should handle an error response gracefully', () => {
      const mockEmailData = { email: 'test@example.com', reportId: '12345' };
      const mockError = new ErrorEvent('Bad Request');

      service.sendReportByEmail(mockEmailData).subscribe({
        next: () => fail('Expected an error, not a success response'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        },
      });

      const req = httpMock.expectOne(`${environment.reportUrl}sendemail`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEmailData);

      req.error(mockError, { status: 400, statusText: 'Bad Request' });
    });

  });
});
