import { Component, OnInit } from '@angular/core';
import { Client } from './models/client.model';
import { ClientService } from './services/client.service';
import { MailService } from './services/mail.service';
import { patchDTO } from './models/patchdto.model';
import { RecordPatch } from './models/recordPatch.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Cuenta dni Premios';

  clients: Client[] = [];
  recordsToBePatched: RecordPatch[] = [];

  //Filters
  selectedSegmentAnalysis: string = '';
  filteredClients: Client[] = [];

  //Spinner
  spinner: boolean = true;

  //Modals
  selectedClient: Client | null = null;
  showModal: boolean = false;
  showObservationModal: boolean = false;
  observationText: string = '';

  //CharactersAllowed
  maxCharacterCount: number = 1000;
  characterCount: number = 0;

  //Save
  isSaving: boolean = false;
  buttonText: string = 'Guardar cambios';

  constructor(public clientService: ClientService, public mailService: MailService) {

    this.selectedClient = new Client(0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Pendiente', '', '', '', '');
    this.filteredClients = this.clients;
  }

  ngOnInit() {

    this.clientService.getClients().subscribe(
      (response) => {
        this.clients = response.result
        this.filteredClients = this.clients;
        this.spinner = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //ActionManagment
  isButtonDisabled(client: Client, action: string): boolean {
    if (action === 'accept') {
      return client.segmentAnalysis === 'Aprobado' || client.segmentAnalysis === 'Rechazado';
    } else if (action === 'reject') {
      return client.segmentAnalysis === 'Rechazado' || client.segmentAnalysis === 'Aprobado';
    }
    return false;
  }


  handleAnalysis(client: Client, type: string) {

    switch (type) {
      case "segmentAnalysisApproved":
        client.segmentAnalysis = 'Aprobado';
        const patchDTORecord = new patchDTO('/SegmentAnalysis', client.segmentAnalysis)
        const recordToBePatched = new RecordPatch(client.dni, client.cuit, patchDTORecord)
        this.recordsToBePatched.push(recordToBePatched)
        break;

      case "segmentAnalysisRejected":
        client.segmentAnalysis = 'Rechazado';
        const patchDTORecordSegmentReject = new patchDTO('/SegmentAnalysis', client.segmentAnalysis)
        const recordToBePatchedSegmentReject = new RecordPatch(client.dni, client.cuit, patchDTORecordSegmentReject)
        this.recordsToBePatched.push(recordToBePatchedSegmentReject)
        break;

      case "financeAnalysisApproved":
        client.financeAnalysis = 'Aprobado';
        const patchDTOFinanceRecordApproved = new patchDTO('/FinanceAnalysis', client.financeAnalysis)
        const recordToBePatchedFinanceApproved = new RecordPatch(client.dni, client.cuit, patchDTOFinanceRecordApproved)
        this.recordsToBePatched.push(recordToBePatchedFinanceApproved)
        break;

      case "financeAnalysisRejected":
        client.financeAnalysis = 'Rechazado';
        const patchDTOFinanceRecordRejected = new patchDTO('/FinanceAnalysis', client.financeAnalysis)
        const recordToBePatchedFinanceRejected = new RecordPatch(client.dni, client.cuit, patchDTOFinanceRecordRejected)
        this.recordsToBePatched.push(recordToBePatchedFinanceRejected)
        break;
    }
  }

  updateAnalysis(client: Client, segmentAnalysisNumber: number, json: string) {

    this.clientService.handleAction(json).subscribe(
      (response) => {
        this.handleMailSending(client, segmentAnalysisNumber)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleMailSending(client: Client, segmentAnalysisNumber: number) {

    let mailJson = {
      properties: {
        Customer: client.firstName + client.lastName,
        Email: client.email,
        Resolution: segmentAnalysisNumber,
        Observation: '',
      }
    };

    this.mailService.sendEmail(JSON.stringify(mailJson)).subscribe(
      (response) => {

      },
      (error) => {
        console.error(error);
      }
    );
  }



  observeClient(selectedClient: Client | null) {
    if (selectedClient) {
      selectedClient.segmentAnalysis = 'Observado';
      selectedClient.observation = this.observationText;
      const patchDTOObservation = new patchDTO('/Observation', selectedClient.observation)
      const recordToBePatchedObservation = new RecordPatch(selectedClient.dni, selectedClient.cuit, patchDTOObservation)
      this.recordsToBePatched.push(recordToBePatchedObservation)
      const patchDTOObservationSegmento = new patchDTO('/SegmentAnalysis', 'Observado')
      const recordToBePatchedObservationSegmento = new RecordPatch(selectedClient.dni, selectedClient.cuit, patchDTOObservationSegmento)
      this.recordsToBePatched.push(recordToBePatchedObservationSegmento)
      this.filterClientsBySegmentAnalysis();
    }
    this.closeObservationModal();
  }


  //Filters
  filterClientsBySegmentAnalysis() {
    this.updateClients();
  }

  updateClients() {
    if (this.selectedSegmentAnalysis) {
      this.filteredClients = this.clients.filter(client => client.segmentAnalysis === this.selectedSegmentAnalysis);
    } else {
      this.filteredClients = this.clients;
    }
  }


  //Modals
  openModal(client: Client) {
    this.selectedClient = client;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  openObservationModal(client: Client): void {
    this.selectedClient = client;
    this.observationText = client.observation;
    this.showObservationModal = true;
  }

  closeObservationModal(): void {
    this.showObservationModal = false;
  }

  updateCharacterCount(): void {
    this.characterCount = this.observationText.length;
  }

  //Save
  saveChanges() {

    this.clientService.patchRecords(this.recordsToBePatched);
    //Agregar envío de mail iterando cada actualización

    /* 
    let mailJson = {
      "properties": {
        "Customer": this,
        "Email": "amoragues@provinciamicrocreditos.com",
        "Resolution": "2",
        "Observation": "Lalallalalalalalalala",
      }
    };
    this.mailService.sendEmail(mailJson).subscribe((response)=>console.log(response),error=>console.error(error))
    */
    this.isSaving = true;
    this.buttonText = 'Guardando...';
    this.recordsToBePatched = [];
    setTimeout(() => {
      this.isSaving = false;
      this.buttonText = 'Guardar cambios';
      this.ngOnInit()
    }, 3000);
  }
}