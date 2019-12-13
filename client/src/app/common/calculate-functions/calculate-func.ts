import * as moment from 'moment';

export const calculateEndOfContractDate = (
  dueDate: string,
  period: number
): string => {
  return moment(dueDate)
    .add(period, 'M')
    .format('YYYY-MM-DD');
};

export const calculateInstallment = (
  amount: number,
  interestRate: number,
  period: number
): number => {
  return (amount * interestRate) / 100 / period + amount / period;
};

export const calculateNextDueDate = (
  createdOnDate: string,
  payments: number
): string => {
  const nextDueDate = moment(createdOnDate)
    .add(payments + 1, 'M')
    .format('YYYY-MM-DD');
  return nextDueDate;
};

export const overallAmount = (
  amount: number,
  interestRate: number,
  period: number
): number => {
  return amount * (1 + (interestRate / 100 / 12) * period);
};

export const calculateOverdueDays = (
  nextDueDate: string,
  currDate: string
): number => {
  return moment(currDate).diff(moment(nextDueDate), 'days');
};

export const calculatePenaltyAmount = (
  days: number,
  amount: number,
  penaltyInterest: number
): number => {
  const penalty = Math.pow(1 + penaltyInterest / 100 / 360, days);
  const penaltyAmountPerDay = (penalty - 1) * amount;

  return days * penaltyAmountPerDay;
};
