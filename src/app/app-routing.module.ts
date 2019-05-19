import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBudgetComponent } from './list-budget/list-budget.component';
import { EditBudgetComponent } from './edit-budget/edit-budget.component';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
path: '', component: HomeComponent}, {path: 'view', component: ListBudgetComponent},
{path: 'update/:id', component: CreateBudgetComponent},
{path: 'new', component: CreateBudgetComponent},
{path: '**', component: NotfoundComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
