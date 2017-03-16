'use strict';

import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;  
}

import 'whatwg-fetch';

const params = {
    site: 'www.marmanold.com'
};

fetch('https://bz2gq8s1sb.execute-api.us-east-1.amazonaws.com/dev/stats', {
  method: 'POST',
  headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/json'
  },
  mode: 'no-cors',
  body: JSON.stringify(params)
}).then(function(response) {return response.text();}).then(function(text){console.log(`Text: ${text}`);});


