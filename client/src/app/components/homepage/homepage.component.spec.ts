import { SharedModule } from './../../shared/shared.module';
import { HomepageService } from './../../core/services/homepage.service';
import { HomepageComponent } from './homepage.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FusionChartsModule } from 'angular-fusioncharts';

describe('HomepageComponent', () => {
  let homepageService;

  let fixture: ComponentFixture<HomepageComponent>;
  let component: HomepageComponent;

  beforeEach(async () => {

    homepageService = {
      getAllUsers() {
        return of();
      },

      getAllLoans() {
        return of();
      },

      getAllRequests() {
        return of();
      }
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, SharedModule, FusionChartsModule],
      declarations: [HomepageComponent],
      providers: [
        HomepageService,
      ]
    })
      .overrideProvider(HomepageService, { useValue: homepageService })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit()', () => {
    it('should subscribe to HomepageService.getAllUsers once with the correct data', done => {

      const testLength = [{}, {}];

      const spyGetAllUsers = jest
        .spyOn(homepageService, 'getAllUsers')
        .mockImplementation(() => of(testLength));

      component.ngOnInit();

      expect(spyGetAllUsers).toHaveBeenCalledTimes(1);
      expect(spyGetAllUsers).toHaveReturnedTimes(1);
      expect(component.allUsers).toBe(2);
      done();
    });

    it('should subscribe to HomepageService.getAllLoans once with the correct data', done => {

      const testLength = [{}, {}];

      const spyGetAllLoans = jest
        .spyOn(homepageService, 'getAllLoans')
        .mockImplementation(() => of(testLength));

      component.ngOnInit();

      expect(spyGetAllLoans).toHaveBeenCalledTimes(1);
      expect(spyGetAllLoans).toHaveReturnedTimes(1);
      expect(component.allLoans).toBe(2);
      done();
    });

    it('should subscribe to HomepageService.getAllRequests once with the correct data', done => {

      const testLength = [{}, {}];

      const spyGetAllRequests = jest
        .spyOn(homepageService, 'getAllRequests')
        .mockImplementation(() => of(testLength));

      component.ngOnInit();

      expect(spyGetAllRequests).toHaveBeenCalledTimes(1);
      expect(spyGetAllRequests).toHaveReturnedTimes(1);
      expect(component.allRequests).toBe(2);
      done();
    });
  });
});
