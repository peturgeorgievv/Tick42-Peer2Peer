import * as moment from 'moment';

export const calculateEndOfContractDate = (dueDate: string, period: number) => {
	return moment(dueDate).add(period, 'M').format('YYYY-MM-DD');
};

export const calculateInstallment = (amount: number, interestRate: number, period: number) => {
	return amount * interestRate / 100 / period + amount / period;
};

export const calculateNextDueDate = (dueDate: string, payments: number) => {
	const currMonth = moment().month();
	const dueDateMonth = moment(dueDate).month(); // payments
	const nextDueDate = moment(dueDate).add(currMonth - dueDateMonth + payments + 1, 'M').format('YYYY-MM-DD');
	return nextDueDate;
};

export const calculateOverdue = (
	dueDate: string,
	amount: number,
	penalty: number,
	interestRate: number,
	period: number,
	payment: number
) => {
	const currMonth = moment().month();
	const dueDateMonth = moment(dueDate).month();
	const nextDueDate = moment(dueDate).add(currMonth - dueDateMonth + payment + 1, 'M').format('YYYY-MM-DD');
	if (moment(nextDueDate).date() < moment().date() && moment(nextDueDate).month() <= moment().month()) {
		console.log(moment(nextDueDate).date(), moment().date(), moment(nextDueDate).month(), moment().month());
		const currDateDay = moment().date();
		const currDueDateDay = moment(nextDueDate).date();

		const overdue =
			(currDateDay - currDueDateDay) * penalty * (amount * interestRate / 100 / period + amount / period);
		return overdue;
	}
	return 0;
};
