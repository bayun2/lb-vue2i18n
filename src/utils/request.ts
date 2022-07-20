const fetch = require('node-fetch');
const FormData = require('form-data');

const request = async (url: string, opts = {}) => {
  try {
    console.log(await (await fetch(url, opts)).json());
  } catch (error) {
    console.error('Error when getting data from Loco API: ', error);
  }
};

export const addANewTranslatableAsset = async (
  apiKey: string,
  key: string,
  value: string
) => {
  let formData = new FormData();
  formData.append(key, value);

  return request('https://localise.biz/api/assets', {
    method: 'POST',
    headers: {
      Authorization: `Loco ${apiKey}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
};
