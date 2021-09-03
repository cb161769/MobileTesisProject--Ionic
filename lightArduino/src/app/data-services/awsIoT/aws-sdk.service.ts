import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import AWS from 'aws-sdk';
@Injectable({
  providedIn: 'root'
})
export class AwsSdkService {

  constructor() {

  }
  /**
   * @function publishMessage
   * @param topic the topic
   * @param payload the payload
   * @returns 
   */
  async publishMessage(topic?, payload?){
   AWS.config.update({
     accessKeyId : environment.API_ACCESS.accessKeyId,
     secretAccessKey: environment.API_ACCESS.secretAccessKey
   });
   const iotdata = new AWS.IotData({endpoint: environment.AWSIOTEndPoints.httpEndPoint, region: environment.AWSIOTEndPoints.region});
   const params = {
      topic,
      payload: JSON.stringify(payload),
      qos: 0
    };
   const response =  iotdata.publish(params, async (err, data) => {
     if (err) {
      debugger;
     }
    });
   return response;

  }
}
