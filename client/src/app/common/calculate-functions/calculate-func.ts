import * as moment from 'moment';

export const calculateInstallment = (amount, interestRate, period) => {
	return amount * interestRate / 100 / period + amount / period;
};

export const calculateNextDueDate = (dueDate, payments) => {
	const currMonth = moment().month();
	const dueDateMonth = moment(dueDate).month(); // payments
	const nextDueDate = moment(dueDate).add(currMonth - dueDateMonth + payments + 1, 'M').format('YYYY-MM-DD');
	return nextDueDate;
};

export const calculateOverdue = (dueDate, amount, penalty, interestRate, period, payment) => {
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
