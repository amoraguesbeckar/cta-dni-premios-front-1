import { patchDTO } from "./patchdto.model";

export class RecordPatch {

    dni: string;
    cuit:string;
    patchDTO: patchDTO[];
    customerName:string;
    mail:string;
   
    constructor(dni: string, cuit:string,unPatchDTO: patchDTO[],customerName:string,mail:string) {
        this.dni = dni
        this.cuit=cuit
        this.patchDTO = unPatchDTO
        this.customerName=customerName
        this.mail=mail
    }

   
}