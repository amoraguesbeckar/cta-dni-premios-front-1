import { Component, OnInit } from '@angular/core';
import { Client } from './models/client.model';
import { ClientService } from './services/client.service';
import { MailService } from './services/mail.service';
import { patchDTO } from './models/patchdto.model';
import { RecordPatch } from './models/recordPatch.model';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertService } from './services/alert.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Cuenta dni Premios';

  clients: Client[] = [];
  recordsToBePatched: RecordPatch[] = [];
  segmentAnalysisCompleted: boolean = false;

  //Filters 
  selectedSegmentAnalysis: string = '';
  filteredClients: Client[] = [];

  //Spinner
  spinner: boolean = false;

  //Modals
  selectedClient: Client | null = null;
  showModal: boolean = false;
  modalType!: string;
  observation: string = '';
  imageModal: string = '';
  paymentObservation = '';

  //CharactersAllowed
  maxCharacterCount: number = 1000;
  characterCount: number = 0;

  //Save
  isSaving: boolean = false;
  buttonText: string = 'Guardar cambios';


  constructor(public clientService: ClientService, public mailService: MailService, public alertService: AlertService) {

    this.selectedClient = new Client(0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Pendiente', '', '', '', '', '', '');
    this.filteredClients = this.clients;
  }

  ngOnInit() {
    this.loadData();
  }

  parseToNumber(value: string | undefined): number {
    return value !== undefined ? parseFloat(value) : 0;
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

  isFinanceActionDisabled(client: Client, action: string): boolean {
    if (client.segmentAnalysis === 'Pendiente' || client.segmentAnalysis === 'Rechazado') {
      return true;
    } else if (action === 'accept') {
      return client.financeAnalysis === 'Aprobado' || client.financeAnalysis === 'Rechazado';
    } else if (action === 'reject') {
      return client.financeAnalysis === 'Aprobado' || client.financeAnalysis === 'Rechazado';
    }
    return false;
  }


  handleAnalysis(client: Client, type: string) {
    switch (type) {
      case "segmentAnalysisApproved":
        client.segmentAnalysis = 'Aprobado';
        const patchDTORecord = new patchDTO('/SegmentAnalysis', client.segmentAnalysis)
        const recordToBePatched = new RecordPatch(client.dni, client.cuit, patchDTORecord)
        this.recordsToBePatched.push(recordToBePatched);
        this.segmentAnalysisCompleted = true;
        break;

      case "segmentAnalysisRejected":
        client.segmentAnalysis = 'Rechazado';
        const patchDTORecordSegmentReject = new patchDTO('/SegmentAnalysis', client.segmentAnalysis)
        const recordToBePatchedSegmentReject = new RecordPatch(client.dni, client.cuit, patchDTORecordSegmentReject);
        this.recordsToBePatched.push(recordToBePatchedSegmentReject);
        break;

      case "financeAnalysisApproved":
        client.financeAnalysis = 'Aprobado';
        client.paymentObservation = this.paymentObservation;
        console.log(client);
        this.closeModal();
        const patchDTOFinanceRecordApproved = new patchDTO('/FinanceAnalysis', client.financeAnalysis)
        const recordToBePatchedFinanceApproved = new RecordPatch(client.dni, client.cuit, patchDTOFinanceRecordApproved);
        this.recordsToBePatched.push(recordToBePatchedFinanceApproved);
        break;

      case "financeAnalysisRejected":
        client.financeAnalysis = 'Rechazado';
        const patchDTOFinanceRecordRejected = new patchDTO('/FinanceAnalysis', client.financeAnalysis)
        const recordToBePatchedFinanceRejected = new RecordPatch(client.dni, client.cuit, patchDTOFinanceRecordRejected);
        this.recordsToBePatched.push(recordToBePatchedFinanceRejected);
        break;
    }
  }

  updateAnalysis(client: Client, segmentAnalysisNumber: number, json: string) {
    this.clientService.handleAction(json).subscribe(
      (response) => {
        this.handleMailSending(client, segmentAnalysisNumber)
      },
      (error) => {
        console.error("Error en updateAnalysis:", error);
        this.alertService.alert("error", "Ocurrió un problema al actualizar los datos. Por favor, intentá nuevamente más tarde");
      }
    );
  }

  handleMailSending(client: Client, segmentAnalysisNumber: number) {
    try {
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
    } catch (error) {
      console.error("Error en handleMailSending:", error);
      this.alertService.alert("error", "Ocurrió un problema al enviar el correo electrónico. Por favor, intentá nuevamente más tarde");
    }
  }

  observeClient(selectedClient: Client | null) {
    if (selectedClient) {
      selectedClient.segmentAnalysis = 'Observado';
      selectedClient.observation = this.observation;

      const patchDTOObservation = new patchDTO('/Observation', selectedClient.observation);
      const recordToBePatchedObservation = new RecordPatch(selectedClient.dni, selectedClient.cuit, patchDTOObservation);
      this.recordsToBePatched.push(recordToBePatchedObservation);

      const patchDTOObservationSegmento = new patchDTO('/SegmentAnalysis', 'Observado');
      const recordToBePatchedObservationSegmento = new RecordPatch(selectedClient.dni, selectedClient.cuit, patchDTOObservationSegmento);
      this.recordsToBePatched.push(recordToBePatchedObservationSegmento);
      this.filterClientsBySegmentAnalysis();
    }
    this.closeModal();
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
  openModal(type: string, client?: Client, imageUrl?: string): void {
    this.selectedClient = client || null;
    this.imageModal = imageUrl ? imageUrl : '';
    this.showModal = true;
    this.modalType = type;

    if (type === "Observation") {
      this.observation = client?.observation || '';
      this.updateCharacterCount(this.observation);
    }

    if (type === "PaymentConfirmation") {
      this.paymentObservation = client?.paymentObservation || '';
      this.updateCharacterCount(this.paymentObservation);
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  updateCharacterCount(observation: string): void {
    this.characterCount = observation.length;
  }

  onFileSelected(event: any, client: Client): void {
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();
    const newFileName = `comprobante_pago_${client.lastName}_${client.dni}.${fileExtension}`;
    const renamedFile = new File([file], newFileName, { type: file.type });
    const reader = new FileReader();

    reader.onloadend = () => {
      client.paymentReceiptImage = reader.result as string;
    };

    if (renamedFile) {
      reader.readAsDataURL(renamedFile);
    }
  }


  //Save
  saveChanges() {

    try {
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
        this.loadData();
      }, 3000);
    } catch (error) {
      console.error("Error en saveChanges:", error);
      this.alertService.alert("error", "Ocurrió un problema al guardar los cambios. Por favor, intentá nuevamente más tarde");
    }
  }

  loadData() {
    try {
      this.spinner = true;
      this.clientService.getClients().subscribe(
        (response) => {
          this.clients = response.result
          this.filteredClients = this.clients;
          this.spinner = false;
        },
        (error) => {
          console.error("Error en loadData:", error);
          this.alertService.alert("error", "Ocurrió un problema al cargar los datos. Por favor, intentá nuevamente más tarde.");
          this.spinner = false;
        }
      );
    } catch (error) {
      console.error("Error en loadData:", error);
      this.alertService.alert("error", "Ocurrió un problema al cargar los datos. Por favor, intentá nuevamente más tarde.");
      this.spinner = false;
    }
  }

  areSegmentsComplete(): boolean {
    return this.filteredClients.every(
      (c) => c.segmentAnalysis === 'Approved' || c.segmentAnalysis === 'Rejected'
    );
  }

  exportToExcel() {
    const currentDate = new Date();

    const clientsData = [
      ['Hace la cuenta - Datos descargados el día: ' + currentDate.toLocaleString()],
      ['Nombre', 'Apellido', 'DNI', 'Correo electrónico', 'Tipo de teléfono', 'Código de área',
        'Número de teléfono', 'Período de la promoción', 'Fecha de liquidación préstamo',
        'Monto de ventas por Cuenta DNI Comercios', 'CUIT', 'Link del adjunto', 'CBU',
        'Crédito BIP', 'Análisis de segmento', 'Observación', '¿Pago realizado?', 'Importe a transferir'],

      ...this.clients.map(client => [client.firstName, client.lastName, client.dni, client.email,
      client.phoneType, client.areaCode, client.phoneNumber, client.salesPeriod, client.loanSettlementDate,
      client.salesAmountCtaDNICom, client.cuit, client.attachmentLink, client.CBU, client.BIPCredit,
      client.segmentAnalysis, client.observation, client.paymentMade, client.transferAmount]),
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(clientsData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const fileName = `Hace la cuenta - ${formattedDate}-${formattedTime}.xlsx`;
    const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelFile, fileName);
  }
}