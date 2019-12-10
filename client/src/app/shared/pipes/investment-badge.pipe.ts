import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'investmentBadge'
})
export class InvestmentBadgePipe implements PipeTransform {
	transform(investmentValue: any, ...args: any[]): any {
		return investmentValue < 5000 ? 'Novice' : investmentValue < 50000 ? 'Master' : 'Shark';
	}
}
