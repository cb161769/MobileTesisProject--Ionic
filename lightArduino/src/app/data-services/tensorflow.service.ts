import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
@Injectable({
  providedIn: 'root'
})
export class TensorflowService {

  constructor() { }
  /**
   *
   * @author Claudio Raul Brito Mercedes
   * @returns model
   */
 createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
  // Add an output layer
  model.add(tf.layers.dense({units: 1, useBias: true}));
  return model;

  }
  /**
   *
   * @param data daynamoDbData
   */
  convertToTensor(data){
    return tf.tidy(() => {
      tf.util.shuffle(data);
      const inputs = data.map(d => d.timeStamp);
      const labels = data.map(d => d.device_watts);
      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();
      const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
      const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      };

    });
  }
  /**
   * 
   * @param model the model to appInitialize
   * @param inputs  the correspondents inputs to
   * @param labels the labels to use
   * @returns 
   */
  async trainModel(model, inputs, labels){
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    });
    const batchSize = 32;
    const epochs = 50;
    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
    });

  }

}

