export class LoanSuggestionDTO {
	$requestId: string;
	$investorId: string;
	$suggestionId: string;
	$userId: string;
	amount: number;
	interestRate: number;
	penalty: number;
	email?: string;
	period: number;
	status: string;
}
