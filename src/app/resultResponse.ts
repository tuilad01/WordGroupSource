export class ResultResponse {
  error: string[];
  saved: any[];

  handleError() {
    let resultError = [];
    const regex = /\w+(?=")/g;
    for (let i = 0; i < this.error.length; i++) {
      const err = this.error[i];
      const field = regex.exec(err)[0];
      if (!field) continue;

      resultError.push(field);
    }
    return resultError;
  }
}
