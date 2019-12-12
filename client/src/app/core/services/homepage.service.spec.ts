import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HomepageService } from './homepage.service';

describe('HomepageService', () => {
  const homepageService = {
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

  let service: HomepageService;

  beforeEach((() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [],
      providers: [HomepageService]
    }).overrideProvider(HomepageService, { useValue: homepageService });

    service = TestBed.get(HomepageService);
  }));

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllUsers should be called once and return an observable', () => {
    const spyGetAllUsers = jest
      .spyOn(homepageService, 'getAllUsers')
      .mockImplementation(() => {
        return of();
      });

    service.getAllUsers();

    expect(spyGetAllUsers).toHaveBeenCalledTimes(1);
    expect(spyGetAllUsers).toReturnWith(of());
  });

  it('getAllLoans should be called once and return an observable', () => {
    const spyGetAllLoans = jest
      .spyOn(homepageService, 'getAllLoans')
      .mockImplementation(() => {
        return of();
      });

    service.getAllLoans();

    expect(spyGetAllLoans).toHaveBeenCalledTimes(1);
    expect(spyGetAllLoans).toReturnWith(of());
  });

  it('getAllRequests should be called once and return an observable', () => {
    const spyGetAllRequests = jest
      .spyOn(homepageService, 'getAllRequests')
      .mockImplementation(() => {
        return of();
      });

    service.getAllRequests();

    expect(spyGetAllRequests).toHaveBeenCalledTimes(1);
    expect(spyGetAllRequests).toReturnWith(of());
  });
});
