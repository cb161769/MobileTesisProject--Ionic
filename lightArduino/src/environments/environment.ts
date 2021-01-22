// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  Region:"us-west-2",
  COGNITO_POOL: {
    UserPoolId: "us-west-2_bq37iVUw7",
    ClientId: "32acgtdjbojl2s4f0q7k36l4ca"
  },
  DynamoBDEndPoints:{
    ULR:"https://b7k0fh82si.execute-api.us-west-2.amazonaws.com/dev",
    API_PATHS:{
      getDeviceReadings:"/IotDevice/getDeviceByUserName",
      createDevice: "/IotDevice/createDevice",
      getFares:"/IotDevice/fareConfiguration/getFares",
      getAllFares:"/IotDevice/fareConfiguration/getAllFares",
      configureDevice:"/IotDevice/configureDevice",
      graphQL:"https://b7k0fh82si.execute-api.us-west-2.amazonaws.com/dev/graphql"
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
