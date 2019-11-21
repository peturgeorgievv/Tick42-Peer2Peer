export class CurrentLoanDTO {
	$requestId: string;
	$investorId: string;
	$suggestionId: string;
	$userId: string;
	amount: number;
	date: string;
	installment: number;
	interestRate: number;
	penalty: number;
	period: number;
	status: string;
	id?: string;
}
