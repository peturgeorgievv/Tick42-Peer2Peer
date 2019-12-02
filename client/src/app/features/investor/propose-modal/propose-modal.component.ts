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

  constructor(private readonly formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addLoanSuggestion = this.formBuilder.group({
      interestRate: ['', [Validators.required]],
      penalty: ['', [Validators.required]],
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
    this.addLoanSuggestion.reset();
  }
}
