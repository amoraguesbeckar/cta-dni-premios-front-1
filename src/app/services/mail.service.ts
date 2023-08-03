import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecordPatch } from '../models/recordPatch.model';
import { patchDTO } from '../models/patchdto.model';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private httpClient: HttpClient) { }

  public sendEmail(json: any): Observable<any> {
    return this.httpClient.post(environment.logicAppMailAzure, json);
  }

  public sendMails(recordsToBePatched: RecordPatch[]) {
    console.log('sendMails')
     //Agregar envío de mail iterando cada actualización
    recordsToBePatched.map(record=>
      {
        if(recordNeedsToBeNotified(record))
        {
          console.log('needs to be notified')
          let resolution=this.getResolution(record.patchDTO[0].value)
          console.log('Customer Name ' +record.customerName)
          let mailJson = {
            "properties": {
              "Customer": record.customerName,
              "Email": record.mail,
              "Resolution": resolution,
              "Observation": resolution=='C'?record.patchDTO[0].value:' ',
            }
          };
          this.httpClient.post(environment.logicAppMailAzure, mailJson).subscribe(response=>console.log(response),error=>console.error('Error: '+error));
        }
      
       
        
        
      })
    
  }
  getResolution(value: string) {
    console.log('get Resolution')
    let resolutionLetter=''
    switch(value)
    {
      case 'Aprobado':
        resolutionLetter='A'
        break;

      case 'Desaprobado':
        resolutionLetter='B'
        break;
      
      case 'Observado':
         resolutionLetter='C'
         break;


    }
    console.log(resolutionLetter)
    return resolutionLetter;
  }
}

function recordNeedsToBeNotified(record: RecordPatch) {
  let needsToBeNotified=false;
  for(let i=0;i<record.patchDTO.length;i++)
  {
    
    if(record.patchDTO[i].path=='/SegmentAnalysis')
      {
         needsToBeNotified=true
      }
  }
 
    return needsToBeNotified;
    
}
