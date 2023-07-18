export class patchDTO {

    op: string = "replace";
    path: string;
    value: string;

    constructor(path: string, value: string) {
        this.path = path
        this.value = value
    }
}