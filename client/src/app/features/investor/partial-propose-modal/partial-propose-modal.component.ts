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
  @Output() public readonly createPartialSuggestion: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.addPartialLoanSuggestion = this.formBuilder.group({
      interestRate: ['', [Validators.required, Validators.min(0)]],
      penalty: ['', [Validators.required, Validators.min(0)]],
      period: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.min(1)]]
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
