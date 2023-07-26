export class Client {
    id: number;
    trackingNumber: string;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    emailConfirmation: string;
    phoneType: string;
    areaCode: string;
    phoneNumber: string;
    salesPeriod: string;
    loanSettlementDate: string;
    salesAmountCtaDNICom: string;
    cuit: string;
    attachmentLink: string;
    CBU: string;
    BIPCredit: string;
    segmentAnalysis: string;
    financeAnalysis: string;
    observation: string;
    paymentMade: string;
    transferAmount: string;
    paymentReceiptImage: string;
    paymentObservation: string;

    constructor(
        id: number,
        trackingNumber: string,
        firstName: string,
        lastName: string,
        dni: string,
        email: string,
        emailConfirmation: string,
        phoneType: string,
        areaCode: string,
        phoneNumber: string,
        salesPeriod: string,
        loanSettlementDate: string,
        salesAmountCtaDNICom: string,
        cuit: string,
        attachmentLink: string,
        CBU: string,
        BIPCredit: string,
        segmentAnalysis: string,
        financeAnalysis: string,
        observation: string,
        paymentMade: string,
        transferAmount: string,
        paymentReceiptImage: string,
        paymentObservation: string) {

        this.id = id;
        this.trackingNumber = trackingNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.email = email;
        this.emailConfirmation = emailConfirmation;
        this.phoneType = phoneType;
        this.areaCode = areaCode;
        this.phoneNumber = phoneNumber;
        this.salesPeriod = salesPeriod;
        this.loanSettlementDate = loanSettlementDate;
        this.salesAmountCtaDNICom = salesAmountCtaDNICom;
        this.cuit = cuit;
        this.attachmentLink = attachmentLink;
        this.CBU = CBU;
        this.BIPCredit = BIPCredit;
        this.segmentAnalysis = segmentAnalysis;
        this.financeAnalysis = financeAnalysis;
        this.observation = observation;
        this.paymentMade = paymentMade;
        this.transferAmount = transferAmount;
        this.paymentReceiptImage = paymentReceiptImage;
        this.paymentObservation = paymentObservation;
    }
}