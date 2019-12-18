import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestDataDTO } from './../../../common/models/request-data.dto';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ProposeSuggestionDTO } from './../../../common/models/propose-suggestion.dto';

@Component({
  selector: 'app-propose-modal',
  templateUrl: './propose-modal.component.html',
  styleUrls: ['./propose-modal.component.css']
})
export class ProposeModalComponent implements OnInit {
  public addLoanSuggestion: FormGroup;

  @Input() requestData: RequestDataDTO;
  @Output() public readonly createSuggestion: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.addLoanSuggestion = this.formBuilder.group({
      interestRate: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      penalty: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      period: [{ value: this.requestData.period, disabled: true }, [Validators.required]],
      amount: [{ value: this.requestData.amount, disabled: true }, [Validators.required]]
    });
  }

  public emitSuggsetion(suggestion: ProposeSuggestionDTO) {
    const suggestionToAdd: ProposeSuggestionDTO = {
      ...suggestion,
      period: this.requestData.period,
      amount: this.requestData.amount
    };

    this.createSuggestion.emit(suggestionToAdd);
    this.addLoanSuggestion.reset({
      period: this.requestData.period,
      amount: this.requestData.amount
    });
    this.activeModal.close();
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }
}
