
export class Request {
    name?: string;
    childName?: string;
    childValue?: string;
    page?: number = null;
    limit?: number;
    fromDate?: string;
    toDate?: string;

    constructor(name:string = "", childName:string = "", childValue:string = "", page:number = null, limit:number = 0, fromDate:string = "", toDate:string = "") {
        this.name = name;
        this.childName = childName;
        this.childValue = childValue;
        this.page = page;
        this.limit = limit;
        this.fromDate = fromDate;
        this.toDate = toDate;
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
  

