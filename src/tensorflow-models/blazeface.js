const blazeface = require('@tensorflow-models/blazeface');
const fs = require("fs");
const tf = require("@tensorflow/tfjs-node")

const isPerson = async data => {

    const image = tf.node.decodeImage(data, 3);
    const model = await blazeface.load();
    const returnTensors = false;
    const predictions = await model.estimateFaces(image, returnTensors); 
    console.log(predictions);
    if(!predictions.length){
        return false;
    }

    return true
}

module.exports = {
    isPerson
}