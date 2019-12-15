import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { InvestorService } from './investor.service';

describe('InvestorService', () => {
  const investorService = {
    getAllLoanRequests() {
      return of();
    },
    createLoanSuggestion() {
      return of();
    },
    addSuggestionId() {
      return of();
    },
    getUserInvestments() {
      return of();
    },
    getUserDocData() {
      return of();
    },
    getPayments() {
      return of();
    }
  };

  let service: InvestorService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [],
      providers: [InvestorService]
    }).overrideProvider(InvestorService, { useValue: investorService });

    service = TestBed.get(InvestorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllLoanRequests should be called once and return observable', () => {
    const spyGetAllLoanRequests = jest
      .spyOn(investorService, 'getAllLoanRequests')
      .mockImplementation(() => {
        return of();
      });

    service.getAllLoanRequests();

    expect(spyGetAllLoanRequests).toHaveBeenCalledTimes(1);
    expect(spyGetAllLoanRequests).toReturnWith(of());
  });

  it('createLoanSuggestion should be called once and return observable', () => {
    const loanData = 'testData';
    const spyCreateLoanSuggestion = jest
      .spyOn(investorService, 'createLoanSuggestion')
      .mockImplementation(() => {
        return of();
      });

    service.createLoanSuggestion(loanData);

    expect(spyCreateLoanSuggestion).toHaveBeenCalledTimes(1);
    expect(spyCreateLoanSuggestion).toReturnWith(of());
  });

  it('addSuggestionId should be called once and return observable', () => {
    const refId = 'testrefId';
    const spyAddSuggestionId = jest
    .spyOn(investorService, 'addSuggestionId')
    .mockImplementation(() => {
      return of();
    });

    service.addSuggestionId(refId);

    expect(spyAddSuggestionId).toHaveBeenCalledTimes(1);
    expect(spyAddSuggestionId).toReturnWith(of());
  });

  it('getUserInvestments should be called once and return observable', () => {
    const userId = 'testUserId';
    const spyGetUserInvestments = jest
    .spyOn(investorService, 'getUserInvestments')
    .mockImplementation(() => {
      return of();
    });

    service.getUserInvestments(userId);

    expect(spyGetUserInvestments).toHaveBeenCalledTimes(1);
    expect(spyGetUserInvestments).toReturnWith(of());
  });

  it('getUserDocData should be called once and return observable', () => {
    const userDocId = 'testUserDocId';
    const spyGetUserDocData = jest
    .spyOn(investorService, 'getUserDocData')
    .mockImplementation(() => {
      return of();
    });

    service.getUserDocData(userDocId);

    expect(spyGetUserDocData).toHaveBeenCalledTimes(1);
    expect(spyGetUserDocData).toReturnWith(of());
  });

  it('getPayments should be called once and return observable', () => {
    const suggestionId = 'testsuggestionId';
    const userId = 'testUserId';
    const spyGetPayments = jest
    .spyOn(investorService, 'getPayments')
    .mockImplementation(() => {
      return of();
    });

    service.getPayments(suggestionId, userId);

    expect(spyGetPayments).toHaveBeenCalledTimes(1);
    expect(spyGetPayments).toReturnWith(of());
  });
});
