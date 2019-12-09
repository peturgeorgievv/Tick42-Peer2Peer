export class CurrentLoanDTO {
	$requestId: string;
	$investorId: string;
	$investorDocId: string;
	$suggestionId: string;
	$userId: string;
	$userDocId: string;
	amount: number;
	date: string;
	installment: number;
	interestRate: number;
	penalty: number;
	period: number;
	status: string;
	id?: string;
	email?: string;
}
