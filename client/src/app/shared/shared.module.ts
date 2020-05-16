import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvestmentBadgePipe } from './pipes/investment-badge.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [InvestmentBadgePipe, SpinnerComponent],
  imports: [FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  exports: [FormsModule, ReactiveFormsModule, InvestmentBadgePipe, NgxSpinnerModule, SpinnerComponent]
})
export class SharedModule {}
