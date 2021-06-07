import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import AWS from 'aws-sdk';
@Injectable({
  providedIn: 'root'
})
export class AwsSdkService {

  constructor() {

  }
  async publishMessage(topic?, payload?){
   AWS.config.update({
     accessKeyId : 'AKIASPGTV7NO4BDCYK5V',
     secretAccessKey: '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'
   });
   const iotdata = new AWS.IotData({endpoint: environment.AWSIOTEndPoints.httpEndPoint, region: environment.AWSIOTEndPoints.region});
   const params = {
      topic,
      payload: JSON.stringify(payload),
      qos: 0
    };
   const response =  iotdata.publish(params, (err, data) => {
     if (err) {
       console.log(err);
     }

    });
   return response;

  }
}
