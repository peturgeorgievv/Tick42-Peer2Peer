export class LoanSuggestionDTO {
  $requestId: string;
  $investorId: string;
  $investorDocId: string;
  $suggestionId: string;
  $userId: string;
  amount: number;
  dateSubmited: string;
  interestRate: number;
  penalty: number;
  email?: string;
  period: number;
  status: string;
}
