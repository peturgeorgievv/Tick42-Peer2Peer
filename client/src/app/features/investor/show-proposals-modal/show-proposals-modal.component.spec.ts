import { LoanSuggestionDTO } from './../../../common/models/loan-suggestion.dto';
import { InvestorModule } from './../investor.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowProposalsModalComponent } from './show-proposals-modal.component';
import { of } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { InvestorService } from '../../../core/services/investor.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ShowProposalsModalComponent', () => {
  let investorService;
  let activeModal;

  let testUser;

  let fixture: ComponentFixture<ShowProposalsModalComponent>;
  let component: ShowProposalsModalComponent;

  beforeEach(async () => {
    jest.clearAllMocks();

    testUser = {
      uid: '1'
    };

    investorService = {
      getUserProposals() {
        return of();
      },
      rejectLoanSuggestion() {
        return of();
      }
    };

    activeModal = {
      dismiss() {}
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, SharedModule, InvestorModule],
      declarations: [],
      providers: [InvestorService, NgbActiveModal]
    })
      .overrideProvider(InvestorService, { useValue: investorService })
      .overrideProvider(NgbActiveModal, { useValue: activeModal })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProposalsModalComponent);
    component = fixture.componentInstance;
    component.user = testUser;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit()', () => {
    it('should subscribe to investorService.getUserProposals() once with the correct data', done => {
      const testLoanRequests = new LoanSuggestionDTO();

      const spyGetAllSuggestions = jest
        .spyOn(investorService, 'getUserProposals')
        .mockImplementation(() => of([testLoanRequests]));

      component.ngOnInit();

      expect(spyGetAllSuggestions).toHaveBeenCalledTimes(1);
      expect(component.allSuggestions[0]).toBe(testLoanRequests);
      done();
    });
  });

  describe('rejectSuggestion()', () => {
    it('should call to investorService.rejectLoanSuggestion() once with the correct data', done => {
      const suggestionId = '1';

      const spyRejectSuggestion = jest
        .spyOn(investorService, 'rejectLoanSuggestion')
        .mockImplementation(() => of());

      component.rejectSuggestion(suggestionId);

      expect(spyRejectSuggestion).toHaveBeenCalledTimes(1);
      expect(spyRejectSuggestion).toHaveBeenCalledWith(suggestionId);
      done();
    });
  });

  describe('closeModal()', () => {
    it('should call to activeModal.dismiss() once', done => {
      const spyActiveModal = jest
        .spyOn(activeModal, 'dismiss')
        .mockImplementation(() => {});

      component.closeModal();

      expect(spyActiveModal).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
