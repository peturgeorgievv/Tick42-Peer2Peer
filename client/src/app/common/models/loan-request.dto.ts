export class LoanRequestDTO {
	$requestId: string;
	$userId: string;
	amount: number;
	period: number;
	partial: boolean;
	status: string;
}
