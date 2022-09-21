import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
////////////////////////////////////////

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/////////////////////////////////////////////////
// FINISH HERE AND GO TO MODEL TO UNDERSTAND MORE
// note to rember 1)
// this async function will be called with another async function in the "model file", as we know async function always return a promise so in our case the "data" will be the a promise and that way we await in the async function in the model file.

// note to rember 2)
// we use throw err in the catch handler here to reject the promise, if some problem happened in this "getJson" function so in this situation the async function in "model file" will recieved a rejectd promise so we catch the error there, instead of that we won't be able to catch the error there because a rejected promis will only happen if there is some internet issue and "data" will always be fulffiled in the async function in the "model file" so we rejected manuaaly to be able to catch it there.
