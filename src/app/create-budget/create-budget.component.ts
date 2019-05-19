import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { ApiserviceService } from '../apiservice.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { debug } from 'util';

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
}
@Component({
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.css'],
  providers: [ {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class CreateBudgetComponent implements OnInit {

  isLinear = false;
  incomeFormGroup: FormGroup;
  housingFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  transportFormGroup: FormGroup;
  educationalFormGroup: FormGroup;
  personalFormGroup: FormGroup;
  savingsFormGroup: FormGroup;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Income', 'Housing', 'Transportation', 'Education', 'Personal', 'Savings'];
  public pieChartData: SingleDataSet = [0, 0, 0, 0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = false;
  public totalValue = 0;
  public pieChartPlugins = [];
  constructor(private activate: ActivatedRoute , private _formBuilder: FormBuilder, private api: ApiserviceService, private route: Router) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  date = new FormControl(moment());
idvalue: any;
idsvalue: any;
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  ngOnInit() {
    this.idsvalue = {};
    this.idvalue = this.activate.snapshot.params['id'];
    this.api.getoneBudget(this.idvalue).subscribe(data => {
      console.log(data);
      this.incomeFormGroup.setValue({
        monthincctrl: data[0]['income'],
        otherincctrl: data[0]['other_income']
      });
      this.housingFormGroup.setValue({
        phonectrl: data[0]['phonecell'],
        cablectrl: data[0]['cabtvinternet'],
        waterctrl: data[0]['watgasele'],
        repairctrl: data[0]['repair_main'],
        homectrl: data[0]['homeins'],
        rentctrl: data[0]['rent'],
        mortctrl: data[0]['mortgage'],
        hoafeesctrl: data[0]['hoa']
      });
      this.transportFormGroup.setValue({
        carctrl: data[0]['car_pmt'],
        carinsctrl: data[0]['car_insu'],
        gasctrl: data[0]['gas_fuel'],
        carrepctrl: data[0]['car_repairs']
      });
      this.educationalFormGroup.setValue({
        schoolctrl: data[0]['school_supp'],
        loansctrl:  data[0]['stud_loans'],
        tuitionctrl: data[0]['colleg_tution']
      });
      this.personalFormGroup.setValue({
        groceriesctrl: data[0]['groc_hous'],
        clothingctrl: data[0]['clothing'],
        entertainctrl: data[0]['entert'],
        medicalctrl: data[0]['medical'],
        petctrl: data[0]['pet_supp'],
        otherctrl: data[0]['other_exp'],
      });
      this.savingsFormGroup.setValue({
        emergctrl: data[0]['emer_fund'],
        investctrl: data[0]['investment'],
        retirectrl: data[0]['retirement']
      });
      this.idsvalue.housid = data[0]['house_id'];
      this.idsvalue.eduid = data[0]['edu_id'];
      this.idsvalue.persid = data[0]['pers_id'];
      this.idsvalue.savid = data[0]['sav_id'];
      this.idsvalue.transid = data[0]['trans_id'];
      this.nextEducation();
      this.nextHousing();
      this.nextIncome();
      this.nextPersonal();
      this.nextTransportation();
    });
    this.incomeFormGroup = this._formBuilder.group({
      monthincctrl: ['', Validators.required],
      otherincctrl: ['']
    });
    this.housingFormGroup = this._formBuilder.group({
      phonectrl: [''],
      cablectrl: [''],
      waterctrl: [''],
      repairctrl: [''],
      homectrl: [''],
      rentctrl: [''],
      mortctrl: [''],
      hoafeesctrl: ['']
    });
    this.transportFormGroup = this._formBuilder.group({
      carctrl: [''],
      carinsctrl: [''],
      gasctrl: [''],
      carrepctrl: ['']
    });
    this.educationalFormGroup = this._formBuilder.group({
      schoolctrl: [''],
      loansctrl: [''],
      tuitionctrl: ['']
    });
    this.personalFormGroup = this._formBuilder.group({
      groceriesctrl: [''],
      clothingctrl: [''],
      entertainctrl: [''],
      medicalctrl: [''],
      petctrl: [''],
      otherctrl: [''],
    });
    this.savingsFormGroup = this._formBuilder.group({
      emergctrl: [''],
      investctrl: [''],
      retirectrl: ['']
    });
  }
  nextIncome() {
    const monthlyincome: number = +this.incomeFormGroup.value.monthincctrl;
    const otherincome: number = +this.incomeFormGroup.value.otherincctrl;
    const totalincome: number = monthlyincome + otherincome;
    this.pieChartData[0] = totalincome;
    this.calculateTotalValue();
  }
  nextHousing() {
    const mortgage: number = +this.housingFormGroup.value.mortctrl;
    const hoafees: number = +this.housingFormGroup.value.hoafeesctrl;
    const rent: number = +this.housingFormGroup.value.rentctrl;
    const homeins: number = +this.housingFormGroup.value.homectrl;
    const repair: number = +this.housingFormGroup.value.repairctrl;
    const water: number = +this.housingFormGroup.value.waterctrl;
    const cabletv: number = +this.housingFormGroup.value.cablectrl;
    const phone: number = +this.housingFormGroup.value.phonectrl;
    this.pieChartData[1] = mortgage + hoafees + rent + homeins + repair + water + cabletv + phone;
    this.calculateTotalValue();
  }
  nextTransportation() {
    const carpayment: number = +this.transportFormGroup.value.carctrl;
    const carinsurance: number = +this.transportFormGroup.value.carinsctrl;
    const gasfuel: number = +this.transportFormGroup.value.gasctrl;
    const carrepairs: number = +this.transportFormGroup.value.carrepctrl;
    this.pieChartData[2] = carpayment + carinsurance + gasfuel + carrepairs;
    this.calculateTotalValue();
  }
  calculateTotalValue() {
    this.totalValue = (+this.pieChartData[0]) -
    ((+this.pieChartData[1]) + (+this.pieChartData[2])  + (+this.pieChartData[3]) +
    (+this.pieChartData[4]) + (+this.pieChartData[5]));
    console.log(this.pieChartData[0]);
    this.nextEducation();
      this.nextHousing();
      this.nextIncome();
      this.nextPersonal();
      this.nextTransportation();
  }
  nextEducation() {
    const schoolsupp: number = +this.educationalFormGroup.value.schoolctrl;
    const studloans: number = +this.educationalFormGroup.value.loansctrl;
    const collegtuition: number = +this.educationalFormGroup.value.tuitionctrl;
    this.pieChartData[3] = schoolsupp + studloans + collegtuition;
    this.calculateTotalValue();
  }
  nextPersonal() {
    const groceries: number = +this.personalFormGroup.value.groceriesctrl;
    const clothing: number = +this.personalFormGroup.value.clothingctrl;
    const entertainment: number = +this.personalFormGroup.value.entertainctrl;
    const medical: number = +this.personalFormGroup.value.medicalctrl;
    const petsupplies: number = +this.personalFormGroup.value.petctrl;
    const otherexp: number = +this.personalFormGroup.value.otherctrl;
    this.pieChartData[4] = groceries + clothing + entertainment + medical + petsupplies + otherexp;
    console.log(this.pieChartData[4]);
    console.log(groceries , clothing , entertainment , medical , petsupplies , otherexp);
    this.calculateTotalValue();

  }
  SubmitValue() {
      const finaldata =  {...this.incomeFormGroup.value, ...this.housingFormGroup.value,
       ...this.transportFormGroup.value, ...this.educationalFormGroup.value, ...this.personalFormGroup.value,
     ...this.savingsFormGroup.value};
      const date = new Date(this.date.value);
      const month = date.getFullYear() + '-' + ((date.getMonth() + 1).toString().length < 2
      ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + (date.getDate());
     finaldata['date'] = month;
     finaldata['budget'] = 'budget';
     this.api.postBudget(finaldata).subscribe(resp => {
       console.log(resp);
     });
  this.route.navigate(['']) .then(() => {
    window.location.reload();
  });
  }
  UpdateValue(id) {
    const finaldata =  {...this.incomeFormGroup.value, ...this.housingFormGroup.value,
      ...this.transportFormGroup.value, ...this.educationalFormGroup.value, ...this.personalFormGroup.value,
    ...this.savingsFormGroup.value, ...this.idsvalue};
    // tslint:disable-next-line:no-debugger
    const date = new Date(this.date.value);
    const month = date.getFullYear() + '-' + ((date.getMonth() + 1).toString().length < 2
    ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + (date.getDate());
   finaldata['date'] = month;
    console.log(finaldata);
    finaldata['budget'] = 'updatebudget';
    finaldata['id'] = id;
    finaldata['eduid'] = this.idsvalue.eduid;
    finaldata['housid'] = this.idsvalue.housid;
    finaldata['persid'] =  this.idsvalue.persid;
    finaldata['savid'] = this.idsvalue.savid;
    finaldata['transid'] = this.idsvalue.transid;
    this.api.updateBudget(finaldata).subscribe(resp => {
      // tslint:disable-next-line:no-debugger
      // debugger;
      console.log(resp);
    });
    this.route.navigate(['']) .then(() => {
      window.location.reload();
    });
  }
  nextSavings() {
    const emergfund: number = +this.savingsFormGroup.value.emergctrl;
    const investment: number = +this.savingsFormGroup.value.investctrl;
    const retirement: number = +this.savingsFormGroup.value.retirectrl;
    this.pieChartData[5] = emergfund + investment + retirement;
    this.calculateTotalValue();

  }
}
