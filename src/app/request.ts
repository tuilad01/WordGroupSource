
export class Request {
    name?: string;
    childName?: string;
    childValue?: string;
    page?: number = null;
    limit?: number;
    fromDate?: string;
    toDate?: string;
    notInGroup: boolean = false;
    notInWord: boolean = false;

    constructor(name:string = "", childName:string = "", childValue:string = "", page:number = null, limit:number = 0, fromDate:string = "", toDate:string = "", notInGroup: boolean = false, notInWord: boolean = false) {
        this.name = name;
        this.childName = childName;
        this.childValue = childValue;
        this.page = page;
        this.limit = limit;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.notInGroup = notInGroup;
        this.notInWord = notInWord;
    }

    public paramsUrl() {
        let params: string[] = [];
        if (this.name) {
            params.push(`name=${this.name}`);
        }

        if(this.childName && this.childValue) {
            params.push(`${this.childName}=${this.childValue}`)
        }

        if(this.page != null && this.limit) {
            params.push(`page=${this.page}`);
            params.push(`limit=${this.limit}`);
        }

        if(this.fromDate && this.toDate) {
            params.push(`fromDate=${this.fromDate}`);
            params.push(`toDate=${this.toDate}`);
        }

        return params.join('&');
    }
  }
  

