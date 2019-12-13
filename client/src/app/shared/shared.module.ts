import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvestmentBadgePipe } from './pipes/investment-badge.pipe';

@NgModule({
  declarations: [InvestmentBadgePipe],
  imports: [FormsModule, ReactiveFormsModule],
  exports: [FormsModule, ReactiveFormsModule, InvestmentBadgePipe]
})
export class SharedModule {}
