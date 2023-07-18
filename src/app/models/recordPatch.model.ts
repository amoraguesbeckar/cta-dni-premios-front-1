import { patchDTO } from "./patchdto.model";

export class RecordPatch {

    dni: string;
    cuit:string;
    patchDTO: patchDTO;

    constructor(dni: string, cuit:string,unPatchDTO: patchDTO) {
        this.dni = dni
        this.cuit=cuit
        this.patchDTO = unPatchDTO
    }
}