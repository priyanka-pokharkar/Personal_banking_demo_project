import { TestBed } from '@angular/core/testing';
import { CardsOverviewComponent } from './cards-overview.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DASHBOARD_CONSTANTS } from '../../dashboard.constant';

describe('CardsOverviewComponent', () => {
  let component: CardsOverviewComponent;
  let fixture: any;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsOverviewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CardsOverviewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests pending
    httpMock.verify();
  });

  it('should create the component', () => {
    // Handle the initial pending HTTP request triggered by toSignal
    const req = httpMock.expectOne('http://localhost:4202/assets/data/aem-mock-data.json');
    req.flush({ content: [] });
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should fetch AEM data and merge it correctly with fallback constants', () => {
    const req = httpMock.expectOne('http://localhost:4202/assets/data/aem-mock-data.json');
    expect(req.request.method).toBe('GET');

    const mockApiResponse = {
      content: [
        {
          screenContent: [
            { key: 'header', title: 'Updated Banking Title', emptyValue: '' },
          ]
        }
      ]
    };

    req.flush(mockApiResponse);
    fixture.detectChanges();

    const result = component.revampFallback();
    expect(result).toBeDefined();
  });

  it('should handle HTTP error gracefully and fallback to DASHBOARD_CONSTANTS', () => {
    const req = httpMock.expectOne('http://localhost:4202/assets/data/aem-mock-data.json');
    
    // Simulate an HTTP failure / network error
    req.error(new ProgressEvent('Network error'));
    fixture.detectChanges();

    const result = component.revampFallback();
    expect(result).toEqual(DASHBOARD_CONSTANTS);
  });

  it('should fallback to DASHBOARD_CONSTANTS if screenContent is not an array', () => {
    const req = httpMock.expectOne('http://localhost:4202/assets/data/aem-mock-data.json');
    
    // Pass a response where screenContent is missing or not an array
    req.flush({ content: [{ screenContent: null }] });
    fixture.detectChanges();

    const result = component.revampFallback();
    expect(result).toEqual(DASHBOARD_CONSTANTS);
  });
});