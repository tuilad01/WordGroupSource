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

    const stringDate = mm + '/' + dd + '/' + yyyy;
    return stringDate;
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
}

String.prototype.queryRequest = function () {
    const request = {
        name: "",
        fromDate: "",
        toDate: "",
        childName: "",
        childValue: "",
        notInGroup: false,
        notInWord: false
    };
    const query = this.trim();

    const regex_getExtend = /\[(date:|datefrom:|dateto:|groupname:|wordname:|notin)(.+?)\]/gi
    const regex_query = /(?:\[.+\])?\s?(.+)/gi

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
                request.fromDate = now.toStringDate();
                request.toDate = now.addDays(1).toStringDate();
                break;
              default:
                break;
            }
            break;
          case "datefrom:":
            request.fromDate = result[2];
            break;
          case "dateto:":
            request.toDate = result[2];
            break;
          case "groupname:":
            request.childName = "groupname";
            request.childValue = result[2];
            break;
          case "wordname:":
            request.childName = "wordname";
            request.childValue = result[2];
            break;
          case "notin:":
            switch (result[2]) {
                case "group":                
                    request.notInGroup = true;
                break;
                case "word":
                    request.notInWord = true;
                break;
                default:
                break;
            }
            break;
          default:
            break;
        }
      }
    } while (result);


    const name = regex_query.exec(query);
    if (name && name[1]) {
      request.name = name[1];
    }

    return request;
}

