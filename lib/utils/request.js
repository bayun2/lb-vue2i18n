const fetch = require('node-fetch');
const FormData = require('form-data');

const request = async (url, opts = {}) => {
  try {
    console.log(await (await fetch(url, opts)).json());
  } catch (error) {
    console.error('Error when getting data from Loco API: ', error);
  }
};

module.exports.addANewTranslatableAsset = async (apiKey, key, value) => {
  let formData = new FormData();
  formData.append(key, value);
  console.log('hha');
  return request('https://localise.biz/api/assets', {
    method: 'POST',
    headers: {
      Authorization: `Loco ${apiKey}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
};
