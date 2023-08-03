import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecordPatch } from '../models/recordPatch.model';

@Injectable({
  providedIn: 'root'
})
export class BlobService {

  constructor(private httpClient: HttpClient) { }

  public postFile(file: any): Observable<any> {
    return this.httpClient.post(environment.blob, file);
  }

  /*
  public getFile(imageName: any): Observable<any> {
    return this.httpClient.get(environment.blob+"/imageName");
  }
   */

}
