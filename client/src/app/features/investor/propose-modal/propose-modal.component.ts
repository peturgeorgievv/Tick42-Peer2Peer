import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-propose-modal',
  templateUrl: './propose-modal.component.html',
  styleUrls: ['./propose-modal.component.css']
})
export class ProposeModalComponent implements OnInit {
  public addLoanSuggestion: FormGroup;

  @Input() requestData;
  @Output() public readonly createSuggestion: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.addLoanSuggestion = this.formBuilder.group({
      interestRate: ['', [Validators.required, Validators.min(1)]],
      penalty: ['', [Validators.required, Validators.min(1)]],
      period: [{ value: this.requestData.period, disabled: true }, [Validators.required]],
      amount: [{ value: this.requestData.amount, disabled: true }, [Validators.required]]
    });
  }

  public emitSuggsetion(suggestion) {
    const suggestionToAdd = {
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
