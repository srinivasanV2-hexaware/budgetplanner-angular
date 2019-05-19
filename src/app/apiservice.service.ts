import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';


@Injectable()
export class ApiserviceService {
  applicationUrl: string;
  constructor(private http:HttpClient) {
    this.applicationUrl = 'http://localhost/budgetplanner/';
  }
  postBudget(body: any) {
  const httpoptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  return this.http.post(this.applicationUrl + 'create.php', body, httpoptions).pipe(map(res => res));
  }
  updateBudget(body: any) {
    const httpoptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.applicationUrl + 'update.php', body, httpoptions).pipe(map(res => res));
    }
  getBudget(): Observable<BudgetElement[]> {
    const httpoptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.get<BudgetElement[]>(this.applicationUrl + 'view.php').pipe(map(res => res));
}
getoneBudget(id): Observable<BudgetElement[]> {
      const httpoptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      return this.http.get<BudgetElement[]>(this.applicationUrl + 'view.php?id=' + id).pipe(map(res => res));
      }
      getBudgetMonth(date): Observable<BudgetElement[]> {
        const httpoptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
          })
        };
        return this.http.get<BudgetElement[]>(this.applicationUrl + 'view.php?date=' + date).pipe(map(res => res));
        }
 deleteBudget(id) {
  const httpoptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  return this.http.get<BudgetElement[]>(this.applicationUrl + 'view.php?id=' + id + '&delete=budget').pipe(map(res => res));
 }
}
export interface BudgetElement {
  period: string;
  income: number;
  othincome: number;
}
