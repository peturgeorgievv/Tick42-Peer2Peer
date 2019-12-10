import { UsersService } from './../../../core/services/users.service';
import { CurrentLoanDTO } from './../../../common/models/current-loan.dto';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-show-details-modal',
	templateUrl: './show-details-modal.component.html',
	styleUrls: [ './show-details-modal.component.css' ]
})
export class ShowDetailsModalComponent implements OnInit {
	@Input() userId;
	public loans: CurrentLoanDTO[];

	constructor(private readonly usersService: UsersService, private readonly activeModal: NgbActiveModal) {}

	ngOnInit() {
		this.usersService.getUserLoans(this.userId).subscribe((loansData: CurrentLoanDTO[]) => {
			this.loans = loansData;
		});
	}

	public closeModal(): void {
		this.activeModal.dismiss();
	}
}
