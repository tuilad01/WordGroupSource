interface Date {
    toStringDate(): string;
    addDays(days: number): Date;
}

interface String {
    queryRequest(): any;
}

Date.prototype.toStringDate = function () {
    const date = this;

    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!
    const yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    const stringDate = yyyy + '-' + mm + '-' + dd;
    return stringDate;
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
}

String.prototype.queryRequest = function () {
    const request = {
        name: "",
        fromdate: "",
        todate: "",
        childName: "",
        childValue: "",
        haschild: null,
    };
    const query = this.trim();

    const regex_getExtend = /\[(date:|datefrom:|dateto:|groupname:|wordname:|haschild:)(.+?)\]/gi
    const regex_query = /(.+)/gi

    if (!query) {
      return request;
    }

    let result;

    do {
      result = regex_getExtend.exec(query);
      if (result) {
        switch (result[1]) {
          case "date:":
            switch (result[2]) {
              case "today":
                const now = new Date();
                request.fromdate = now.toStringDate();
                request.todate = now.addDays(1).toStringDate();
                break;
              default:
                break;
            }
            break;
          case "datefrom:":
            request.fromdate = result[2];
            break;
          case "dateto:":
            request.todate = result[2];
            break;
          case "groupname:":
            request.childName = "groupname";
            request.childValue = result[2];
            break;
          case "wordname:":
            request.childName = "wordname";
            request.childValue = result[2];
            break;
          case "haschild:":
            request.haschild = result[2];
            break;
          default:
            break;
        }
      }
    } while (result);


    const name = query.replace(/\[(.+?)\]/gi,'').trim();    
   
    if (name) {
      request.name = name;
    }

    return request;
}