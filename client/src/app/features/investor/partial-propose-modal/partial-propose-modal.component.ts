import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BalanceDataDTO } from './../../../common/models/balance-data.dto';
import { RequestDataDTO } from './../../../common/models/request-data.dto';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProposeSuggestionDTO } from './../../../common/models/propose-suggestion.dto';

@Component({
  selector: 'app-partial-propose-modal',
  templateUrl: './partial-propose-modal.component.html',
  styleUrls: ['./partial-propose-modal.component.css']
})
export class PartialProposeModalComponent implements OnInit {
  @Input() requestData: RequestDataDTO;
  @Input() userBalanceData: BalanceDataDTO;
  @Output() public readonly createPartialSuggestion: EventEmitter<
    any
  > = new EventEmitter();

  public addPartialLoanSuggestion: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addPartialLoanSuggestion = this.formBuilder.group({
      interestRate: [
        '',
        [Validators.required, Validators.min(1), Validators.max(1000)]
      ],
      penalty: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)]
      ],
      period: [
        { value: this.requestData.period, disabled: true },
        [Validators.required]
      ],
      amount: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.requestData.amount)
        ]
      ]
    });
  }

  public emitPartialSuggestion(suggestion: ProposeSuggestionDTO) {
    const suggestionToAdd = {
      ...suggestion,
      period: this.requestData.period
    };

    this.createPartialSuggestion.emit(suggestionToAdd);
    this.addPartialLoanSuggestion.reset();
    this.activeModal.close();
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }
}
