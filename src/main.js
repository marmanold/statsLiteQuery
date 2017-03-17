'use strict';

import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;  
}

import 'whatwg-fetch';

const params = {
    site: 'www.marmanold.com', 
    start: '2017-03-15', 
    end: '2017-04-01'
};

fetch('https://bz2gq8s1sb.execute-api.us-east-1.amazonaws.com/dev/stats', {
  method: 'POST',
  headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/json'
  },
  mode: 'cors',
  body: JSON.stringify(params)
}).then(function(response) {
    return response.json()
  }).then(function(json) {
    let responseRoot = document.getElementById('results');

    json.forEach(function(visit) {
    	let newVisit = document.createElement('li');
    	newVisit.appendChild(document.createTextNode(JSON.stringify(visit)));
    	responseRoot.appendChild(newVisit);
    	console.log(JSON.stringify(visit));
    });
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  });


