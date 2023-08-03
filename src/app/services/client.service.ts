import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecordPatch } from '../models/recordPatch.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private httpClient: HttpClient) { }

  public handleAction(json: any): Observable<any> {
    return this.httpClient.get(environment.api, json);
  }

  public getClients(): Observable<any> {
    return this.httpClient.get(environment.api);
  }

  public async patchRecords(recordsToBePatched: RecordPatch[]) {

    recordsToBePatched.map(record => {
      
      if(record.cuit.length==0)
        record.cuit=''
      this.httpClient.patch(environment.api + '/' + record.dni + '/' + record.cuit, record.patchDTO).subscribe((response) => { console.log(response) }, error =>{console.error('error ' + error.message);throw new Error()} )
    
      
    })
    
  }
}
