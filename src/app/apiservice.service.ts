import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';


@Injectable()
export class ApiserviceService {
  applicationUrl: string;
  constructor(private http:HttpClient) {
    this.applicationUrl = 'http://localhost:8080/budget-planner-php/';
  }
  postBudget(body: any){
  const httpoptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  }
  return this.http.post(this.applicationUrl + 'create.php', body, httpoptions).pipe(map(res => res));
  }

}
