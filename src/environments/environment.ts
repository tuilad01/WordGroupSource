// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //baseUrl: 'https://wordgroup123.herokuapp.com',
  baseUrl: '//192.168.1.167:4000',
  wordUrl: '//192.168.1.167:4000/word',
  groupUrl: '//192.168.1.167:4000/group',
  settings: {
    cacheLocal: "cacheLocal",
    groupLocal: "groupLocal",
    wordLocal: "wordLocal",
    learnLocal: "learnLocal",
    learnAllLocal: "learnAllLocal"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
