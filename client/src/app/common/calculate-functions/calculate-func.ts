import * as moment from 'moment';

export const calculateInstallment = (amount, interestRate, period) => {
	return amount * interestRate / 100 / period + amount / period;
};

export const calculateNextDueDate = (dueDate) => {
	const currMonth = moment().month();
	const dueDateMonth = moment(dueDate).month();
	const nextDueDate = moment(dueDate).add(currMonth - dueDateMonth + 1, 'M').format('YYYY-MM-DD');
	return nextDueDate;
};

export const calculateOverdue = (dueDate, amount, penalty, interestRate, period) => {
	const currMonth = moment().month();
	const dueDateMonth = moment(dueDate).month();
	const nextDueDate = moment(dueDate).add(currMonth - dueDateMonth + 1, 'M').format('YYYY-MM-DD');
	const currDateDay = moment().date();
	const currDueDateDay = moment(nextDueDate).date();

	const overdue = (currDateDay - currDueDateDay) * penalty * (amount * interestRate / 100 / period + amount / period);
	return overdue;

	// const currDateMonth = moment().month();
	// const currDueDateMonth = moment(currDueDate).month();
};
