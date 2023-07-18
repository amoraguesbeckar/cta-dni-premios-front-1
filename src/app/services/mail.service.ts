import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private httpClient: HttpClient) { }

  public sendEmail(json: any): Observable<any> {
    return this.httpClient.post(environment.logicAppMailAzure, json);
  }
}