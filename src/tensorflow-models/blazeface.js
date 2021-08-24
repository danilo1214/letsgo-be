const blazeface = require('@tensorflow-models/blazeface');
const tf = require('@tensorflow/tfjs-node');

const isPerson = async (data) => {
  const image = tf.node.decodeImage(data, 3);
  const model = await blazeface.load();
  const returnTensors = false;

  const predictions = await model.estimateFaces(image, returnTensors);
  return !!predictions.length;
};

module.exports = {
  isPerson,
};
