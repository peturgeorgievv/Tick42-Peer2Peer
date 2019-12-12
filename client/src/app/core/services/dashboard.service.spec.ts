import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  const dashboardService = {
    getUserDocData() {
      return of();
    },
    addOrRemoveMoney() {
      return of();
    },
    getCurrentUserInvestments() {
      return of();
    },
    getCurrentUserLoans() {
      return of();
    }
  };

  let service: DashboardService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [],
      providers: [DashboardService]
    }).overrideProvider(DashboardService, { useValue: dashboardService });

    service = TestBed.get(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUserDocData should be called once and return observable', () => {
    const userDocId = 'testId';
    const spyGetUserDocData = jest
      .spyOn(dashboardService, 'getUserDocData')
      .mockImplementation(() => {
        return of();
      });

    service.getUserDocData(userDocId);

    expect(spyGetUserDocData).toHaveBeenCalledTimes(1);
    expect(spyGetUserDocData).toReturnWith(of());
  });

  it('addOrRemoveMoney should be called once and return observable', () => {
    const userDocId = 'testId';
    const spyAddOrRemoveMoney = jest
      .spyOn(dashboardService, 'addOrRemoveMoney')
      .mockImplementation(() => {
        return of();
      });

    service.addOrRemoveMoney(userDocId);

    expect(spyAddOrRemoveMoney).toHaveBeenCalledTimes(1);
    expect(spyAddOrRemoveMoney).toReturnWith(of());
  });

  it('getCurrentUserInvestments should be called once and return observable', () => {
    const userDocId = 'testId';
    const spyGetCurrentUserInvestments = jest
      .spyOn(dashboardService, 'getCurrentUserInvestments')
      .mockImplementation(() => {
        return of();
      });

    service.getCurrentUserInvestments(userDocId);

    expect(spyGetCurrentUserInvestments).toHaveBeenCalledTimes(1);
    expect(spyGetCurrentUserInvestments).toReturnWith(of());
  });

  it('getCurrentUserLoans should be called once and return observable', () => {
    const userDocId = 'testId';
    const spyGetCurrentUserLoans = jest
      .spyOn(dashboardService, 'getCurrentUserLoans')
      .mockImplementation(() => {
        return of();
      });

    service.getCurrentUserLoans(userDocId);

    expect(spyGetCurrentUserLoans).toHaveBeenCalledTimes(1);
    expect(spyGetCurrentUserLoans).toReturnWith(of());
  });
});
