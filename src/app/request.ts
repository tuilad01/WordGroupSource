
export class Request {
    name?: string;
    childName?: string;
    childValue?: string;
    page?: number = null;
    limit?: number;
    fromdate?: string;
    todate?: string;
    notInGroup: boolean = false;
    notInWord: boolean = false;

    paramsUrl: () => string;

    constructor(name: string = "", childName: string = "", childValue: string = "", page: number = null, limit: number = 0, fromdate: string = "", todate: string = "", notInGroup: boolean = false, notInWord: boolean = false) {
        this.name = name;
        this.childName = childName;
        this.childValue = childValue;
        this.page = page;
        this.limit = limit;
        this.fromdate = fromdate;
        this.todate = todate;
        this.notInGroup = notInGroup;
        this.notInWord = notInWord;
        const self = this;
        self.paramsUrl = function () {
            let params = [];
            if (this.name) {
                params.push(`name=${this.name}`);
            }

            if (this.childName && this.childValue) {
                params.push(`${this.childName}=${this.childValue}`)
            }

            if (this.page != null && this.limit) {
                params.push(`page=${this.page}`);
                params.push(`limit=${this.limit}`);
            }

            if (this.fromdate && this.todate) {
                params.push(`fromdate=${this.fromdate}`);
                params.push(`todate=${this.todate}`);
            }

            return params.join('&');
        }
    }
}


