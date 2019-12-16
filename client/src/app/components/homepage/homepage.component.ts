import { Subscription } from 'rxjs';
import { HomepageService } from './../../core/services/homepage.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  public allUsers: number;
  public allLoans: number;
  public allRequests: number;
  public isGraphShowed = false;

  private subscriptions: Subscription[] = [];

  public dataSource: object;
  public styleObj: object;
  public chartObj: object;
    public innerWidth: number;
    public size = 'third';
    public allSizes = {
      firstSize: { width: '315px', height: '210px' },
      secondSize: { width: '650px', height: '350px' },
      thirdSize: { width: '950px', height: '600px' }
    };

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1000) {
        this.onSelectionChange('firstSize');
      } else if (this.innerWidth > 1000 && this.innerWidth < 1450) {
        this.onSelectionChange('secondSize');
      } else if (this.innerWidth > 1450) {
        this.onSelectionChange('thirdSize');
      }
    }




  constructor(private readonly homepageService: HomepageService) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1100) {
      this.size = 'firstSize';
    } else if (this.innerWidth > 1100 && this.innerWidth < 1450) {
      this.size = 'secondSize';
    } else if (this.innerWidth > 1450) {
      this.size = 'thirdSize';
    }

    this.subscriptions.push(this.homepageService
      .getAllUsers()
      .subscribe(data => this.allUsers = data.length));

    this.subscriptions.push(this.homepageService
      .getAllLoans()
      .subscribe(data => this.allLoans = data.length));

    this.subscriptions.push(this.homepageService
      .getAllRequests()
      .subscribe(data => {
        this.allRequests = data.length;
        this.isGraphShowed = true;
        this.createGraph();
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  createGraph() {
    this.dataSource = {
      chart: {
        caption: 'LendIt Current Data',
        xAxisName: 'Type',
        yAxisName: 'Amount',
        theme: 'fusion',
        bgColor: '#FFFFFF',
        bgAlpha: '100',
        borderColor: '#694873',
        borderThickness: '4',
        showBorder: '1',
        baseFontSize: '13',
      },
      data: [
        {
          label: 'Users',
          value: this.allUsers
        },
        {
          label: 'Loans',
          value: this.allLoans
        },
        {
          label: 'Active Requests',
          value: this.allRequests
        }
      ]
    };
    this.styleObj = this.allSizes[this.size];
  }

  getStyle(): object {
    return this.styleObj;
  }

  initialized($event): void {
    this.chartObj = $event.chart;
  }
  onSelectionChange(size: string): void {
    this.size = size;
    this.styleObj = this.allSizes[this.size];
  }
}
