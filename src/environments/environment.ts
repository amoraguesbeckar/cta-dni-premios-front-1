// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  logicAppMailAzure: "https://prod-36.eastus2.logic.azure.com/workflows/036de051cfde41f285358783dd3fa3db/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RINigHhkXmPiUALk5sYivRzqoYSdLwOswhLjF_lwfyg",
  api: "https://cta-dni-premios-backtst.azurewebsites.net/api/CuentaDNIPremios",
  //api:"https://localhost:7080/api/CuentaDNIPremios"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with A