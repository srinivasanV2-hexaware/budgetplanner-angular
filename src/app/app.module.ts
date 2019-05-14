import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { ListBudgetComponent } from './list-budget/list-budget.component';
import { EditBudgetComponent } from './edit-budget/edit-budget.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { HeaderComponent } from './header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatToolbarModule, MatInputModule, MatProgressBarModule, MatListModule, MatIconModule, MatBottomSheetModule, MatStepperModule, MatFormFieldModule, MatTableModule, MatPaginatorModule, MatGridListModule } from '@angular/material';
import { NotfoundComponent } from './notfound/notfound.component';
import { ChartsModule } from 'ng2-charts';

import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    CreateBudgetComponent,
    ListBudgetComponent,
    EditBudgetComponent,
    StatisticsComponent,
    HeaderComponent,
    NotfoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatGridListModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
