export class AllPaymentsDTO {
	$requestId: string;
	$userId: string;
	$investorId: string;
	$investorDocId: string;
	amount: number;
	date: string;
	overdue: number;
}
