import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-partial-propose-modal',
  templateUrl: './partial-propose-modal.component.html',
  styleUrls: ['./partial-propose-modal.component.css']
})
export class PartialProposeModalComponent implements OnInit {
  public addPartialLoanSuggestion: FormGroup;

  @Output() public readonly createPartialSuggestion: EventEmitter<any> = new EventEmitter();
  @Input() requestData;

  constructor(private readonly formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.requestData.amount);



    this.addPartialLoanSuggestion = this.formBuilder.group({
      interestRate: ['', [Validators.required]],
      penalty: ['', [Validators.required]],
      period: [{value: this.requestData.period, disabled: true}, [Validators.required]],
      amount: [{value: this.requestData.amount, disabled: true}, [Validators.required]]
    });
  }

  public emitPartialSuggestion(suggestion) {
    const suggestionToAdd = {
      ...suggestion
    };

    this.createPartialSuggestion.emit(suggestionToAdd);
    this.addPartialLoanSuggestion.reset();
  }

}
