import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-partial-propose-modal',
  templateUrl: './partial-propose-modal.component.html',
  styleUrls: ['./partial-propose-modal.component.css']
})

export class PartialProposeModalComponent implements OnInit {
  public addPartialLoanSuggestion: FormGroup;

  @Input() requestData;
  @Input() userBalanceData;
  @Output() public readonly createPartialSuggestion: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.addPartialLoanSuggestion = this.formBuilder.group({
      interestRate: ['', [Validators.required, Validators.min(1)]],
      penalty: ['', [Validators.required, Validators.min(1)]],
      period: [{ value: this.requestData.period, disabled: true }, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(this.requestData.amount)]]
    });
  }

  public emitPartialSuggestion(suggestion) {
    const suggestionToAdd = {
      ...suggestion
    };

    this.createPartialSuggestion.emit(suggestionToAdd);
    this.addPartialLoanSuggestion.reset();

    this.activeModal.close();
  }

  public closeModal(): void {
    this.activeModal.dismiss();
  }

}
