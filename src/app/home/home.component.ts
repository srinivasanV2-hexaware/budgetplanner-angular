import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDatepickerInputEvent } from '@angular/material';
import { ApiserviceService } from '../apiservice.service';
import { Observable } from 'rxjs';
import {MatDatepicker} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { Router } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})

export class HomeComponent implements OnInit {

  constructor( private api: ApiserviceService, private route: Router) { }

  displayedColumns: string[] = ['period', 'income', 'othincome', 'educational', 'housing', 'savings', 'personal',
  'transportation', 'expense', 'profit', 'actions'];
  dataSource = new MatTableDataSource<BudgetElement>();
  date = new FormControl(moment());
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalvalue: any;
  lossvalue: any;
  
  ngOnInit() {
    // tslint:disable-next-line:radix
    const reducer = (accumulator, element) => {return (accumulator + parseInt(element.transport + element.personals + element.savings
      + element.housings + element.schooling ));
    };
    // tslint:disable-next-line:radix
    // tslint:disable-next-line:max-line-length
    const minreducer = (accumulator, element) => {return (+(accumulator) + ((element.income + element.other_income) - (element.transport + element.personals + element.savings + element.housings + element.schooling )));
    };
     this.api.getBudget().subscribe(data => {
    if (data.length > 0) {
     this.totalvalue = data.reduce(reducer, 0);
     this.lossvalue = data.reduce(minreducer, 0);
     this.dataSource.data = data;
    }
     });
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // tslint:disable-next-line:radix
     // tslint:disable-next-line:max-line-length
    const reducer = (accumulator, element) => {return (accumulator + parseInt(element.transport + element.personals + element.savings + element.housings + element.schooling ));
    };
    // tslint:disable-next-line:radix
    // tslint:disable-next-line:max-line-length
    const minreducer = (accumulator, element) => {return (+(accumulator) + ((element.income + element.other_income) - (element.transport + element.personals + element.savings + element.housings + element.schooling )));
    };
    const datepick = new Date(event.value['_d']);
    const month = (datepick.getMonth() + 1).toString().length === 1 ? '0' + (datepick.getMonth() + 1) : (datepick.getMonth() + 1);
   const finalfulldate = datepick.getFullYear() + '-' + (month);
    this.api.getBudgetMonth(finalfulldate).subscribe(data => {
    this.dataSource.data = data;
    this.paginator._changePageSize(this.paginator.pageSize);
    this.totalvalue = data.reduce(reducer, 0);
     this.lossvalue = data.reduce(minreducer, 0);
     });
  }
  budgetEdit(id) {
    console.log(id);
    this.route.navigate(['update/' + id]);
  }
  budgetDelete(id) {
    console.log(id);
    this.api.deleteBudget(id).subscribe();
    this.route.navigate(['']) .then(() => {
      window.location.reload();
    });
    // window.location.reload();
  }


}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface BudgetElement {
  period: string;
  income: number;
  othincome: number;
}
