  import { Injectable } from '@angular/core';
  import {Amplify, PubSub} from 'aws-amplify';
  import { AWSIoTProvider } from '@aws-amplify/pubsub';
  import { environment } from 'src/environments/environment';
  @Injectable({
  providedIn: 'root'
})
export class MQTTServiceService {

  constructor() {
    Amplify.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: environment.AWSIOTEndPoints.httpEndPoint,
      aws_pubsub_endpoint: environment.AWSIOTEndPoints.region
    }));

  }

  public async PublishToTopic(topicName: string){
    return await PubSub.publish(topicName, {msg: topicName + 'subscribed'}, {provider: 'AWSIoTProvider'});
  }
}
