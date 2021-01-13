// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  Region:"us-west-2",
  COGNITO_POOL: {
    UserPoolId: "us-west-2_x4KmeZGtV",
    ClientId: "545gjcv1mutaa1tjsldukem3k7"
  },
  DynamoBDEndPoints:{
    ULR:"https://gp94zysn52.execute-api.us-west-2.amazonaws.com/dev",
    API_PATHS:{
      getDeviceReadings:"/IotDevice/getDeviceByUserName",
      createDevice: "/IotDevice/createDevice"
    }
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
