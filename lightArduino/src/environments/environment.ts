// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  Region: 'us-west-2',
  COGNITO_POOL: {
    UserPoolId: 'us-west-2_XdKA6T2aU',
    ClientId: '7sk5eptvdnktubqjh2edeisi8h',
    identityPoolId: 'us-west-2:b948b6e5-5514-471b-9549-2fa4e5331a93'
  },
  LoggerEndPoints: {
    ULR: 'https://u4jh03inyb.execute-api.us-west-2.amazonaws.com/dev',
    DatabaseLogger: '/IotDevice/CreateLog'
  },
  DynamoBDEndPoints: {
    ULR: 'https://u4jh03inyb.execute-api.us-west-2.amazonaws.com/dev',
     API_PATHS: {
      getDeviceReadings: '/IotDevice/getDeviceByUserName',
      createDevice: '/IotDevice/createDevice',
      getFares: '/IotDevice/fareConfiguration/getFares',
      getAllFares: '/IotDevice/fareConfiguration/getAllFares',
      configureDevice: '/IotDevice/configureDevice',
      graphQL: 'https://u4jh03inyb.execute-api.us-west-2.amazonaws.com/dev/graphQL',
      graphQlQuery: 'https://u4jh03inyb.execute-api.us-west-2.amazonaws.com/dev/query',
      getDeviceWeekly: '/IotDevice/getDeviceWeekly/',
      getDeviceRelays: '/IotDevice/getDeviceRelays/',
      addDeviceConfiguration: '/IotDevice/addDeviceConfiguration',
      getArduinoDeviceConfiguration: '/IotDevice/getArduinoDeviceConfiguration',
      getDeviceConfiguration: '/IotDevice/getDeviceConfiguration',
      getDeviceReadingsByCurrentYear: '/IotDevice/getAllDeviceReadingsByMonth',
      getDeviceReadingsByGivenDay: '/IotDevice/getAllDeviceReadingsByGivenDay',
      getDeviceReadingsByGivenMonth: '/IotDevice/getAllDeviceReadingsByGivenMonth',
      DeviceCriteria: {
        Monthly: {
          getAllDeviceReadingsByGivenParametersMonthly: '/IotDevice/getAllDeviceReadingsByGivenParametersMonthly/'
        }
      },
      ConnectionsCriteria: {
        Monthly: {
          getAllDeviceReadingsByGivenParametersMonthly: '/IotDevice/Connections/getAllDeviceReadingsByGivenParametersMonthly/'
        }
      },
      Tensorflow: {
        PredictNexMonth: '/IotDevice/Tensorflow/PredictConsumption/'
      },

      Connections: {
        ConnectionReadingsCurrentWeek: '/IotDevice/Connections/getConnectionReadingsCurrentWeek',
        ConnectionsGetAllDeviceReadingsByGivenMonth: '/IotDevice/Connections/getAllDeviceReadingsByGivenMonth',
        ConnectionsGetConnectionYearly: '/IotDevice/Connections/GetConnectionYearly/allConfig',
        ConnectionsGetReadingsByGivenYear: '/IotDevice/Connections/GetConnectionsReadingsByGivenDay'
      }
    }
  },
  AWSIOTEndPoints: {
    httpEndPoint: 'a3grg8s0qkek3y-ats.iot.us-west-2.amazonaws.com',
    region: 'us-west-2',
    AWSIoTTopics: {
      turnOnDeviceOne: '/turnOnDeviceOne',
      turnOffDeviceOne: '/turnOffDeviceOne',
      turnOnDeviceTwo: '/turnOnDeviceTwo',
      turnOffDeviceTwo: '/turnOffDeviceTwo',
      turnOnDeviceThree: '/turnOnDeviceThree',
      turnOffDeviceThree: '/turnOffDeviceThree',
      turnOnDeviceFour: '/turnOnDeviceFour',
      turnOffDeviceFour: '/turnOffDeviceFour',
      turnOnAllDevices: '/turnOnAllDevices',
      turnOffAllDevices: '/turnOffAllDevices'
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
