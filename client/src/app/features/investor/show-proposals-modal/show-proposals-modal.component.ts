import { Subscription } from 'rxjs';
import { LoanSuggestionDTO } from './../../../common/models/loan-suggestion.dto';
import { InvestorService } from 'src/app/core/services/investor.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'firebase';

@Component({
  selector: 'app-show-proposals-modal',
  templateUrl: './show-proposals-modal.component.html',
  styleUrls: ['./show-proposals-modal.component.css']
})
export class ShowProposalsModalComponent implements OnInit, OnDestroy {
  @Input() user: User;

  private userProposalsSubscription: Subscription;

  public allSuggestions: LoanSuggestionDTO[];

  constructor(
    private readonly investorService: InvestorService,
    private readonly activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.userProposalsSubscription = this.investorService
      .getUserProposals(this.user.uid)
      .subscribe((suggestionData: LoanSuggestionDTO[]) => {
        this.allSuggestions = suggestionData;
      });
  }

  ngOnDestroy() {
    this.userProposalsSubscription.unsubscribe();
  }

  public rejectSuggestion(suggestionId: string): void {
    this.investorService.rejectLoanSuggestion(suggestionId);
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }
}
