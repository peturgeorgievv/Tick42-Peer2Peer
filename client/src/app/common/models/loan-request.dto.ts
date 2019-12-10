export class LoanRequestDTO {
	$requestId: string;
	$userId: string;
	$userDocId: string;
	amount: number;
	period: number;
	dateSubmited: string;
	partial: boolean;
	status: string;
}
