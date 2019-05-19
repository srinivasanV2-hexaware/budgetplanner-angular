import { Component, OnInit, Input } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input ('title')
  title: any;
   constructor(private route: Router) { }
  ngOnInit() {
  }
  AddNewBudget() {
  this.route.navigate(['new']);
  }
}
