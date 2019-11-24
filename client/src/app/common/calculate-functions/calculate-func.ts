import * as moment from 'moment';

export const calculateEndOfContractDate = (dueDate: string, period: number): string => {
	return moment(dueDate).add(period, 'M').format('YYYY-MM-DD');
};

export const calculateInstallment = (amount: number, interestRate: number, period: number): number => {
	return amount * interestRate / 100 / period + amount / period;
};

export const calculateNextDueDate = (dueDate: string, payments: number): string => {
	const currMonth = moment().month();
	const dueDateMonth = moment(dueDate).month();
	const nextDueDate = moment(dueDate).add(currMonth - dueDateMonth + payments + 1, 'M').format('YYYY-MM-DD');
	return nextDueDate;
};

export const overallAmount = (amount: number, interestRate: number, period: number): number => {
	return amount * (1 + interestRate / 100 / 12 * period);
};

export const calculateOverdueDays = (nextDueDate: string, currDate: string) => {
	// next Due Date
	return moment(currDate).diff(moment(nextDueDate), 'days');
};

export const calculatePenaltyAmount = (days: number, amount: number, penaltyInterest: number) => {
	// penalty int - interestRate + penalty rate
	// totalAmount - only debt

	const penalty = Math.pow(1 + penaltyInterest / 100 / 360, days);
	const penaltyAmountPerDay = (penalty - 1) * amount;

	return days * penaltyAmountPerDay;
};
