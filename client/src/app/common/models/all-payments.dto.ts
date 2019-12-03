export class AllPaymentsDTO {
	$requestId: string;
	$userId: string;
	$investorId: string;
	$investorDocId: string;
	$suggestionId: string;
	amount: number;
	date: string;
	overdue: number;
}
