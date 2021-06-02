import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
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
  /**
   *
   * @param model
   * @param inputData
   * @param normalizationData
   */
  async makePrediction(model, inputData, normalizationData){
    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;
    const [xs, preds] = tf.tidy(() => {

    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);

    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

    const predictedPoints = Array.from(xs).map((val, i) => {
    return {x: val, y: preds[i]};
  });

    const originalPoints = inputData.map(d => ({
    x: d.horsepower, y: d.mpg,
  }));

    return  tfvis.render.scatterplot(
    {name: 'Model Predictions vs Original Data'},
    {values: [originalPoints, predictedPoints], series: ['original', 'predicted']},
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  );
  }


}

