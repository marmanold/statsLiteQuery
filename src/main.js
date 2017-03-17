'use strict';

import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;  
}

import 'whatwg-fetch';

function getParams() {
  const params = {
      site: document.getElementById('site').value, 
      start: document.getElementById('start').value, 
      end: document.getElementById('end').value
  };

  return params;
}

function clearStats() {
  let responseRoot = document.getElementById('results');

  //Clear Elements from the list before adding again
  while(responseRoot.firstChild) {
    responseRoot.removeChild(responseRoot.firstChild);
  }
}

function queryStats() {
  const params = getParams();

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

      //Clear Elements from the list before adding again
      clearStats();

      //Add each visit to the list
      json.forEach(function(visit) {
        let newVisit = document.createElement('li');
        newVisit.appendChild(document.createTextNode(JSON.stringify(visit)));
        responseRoot.appendChild(newVisit);
      });
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
}

//Wait for the page to finish loading before starting to watch for a click
window.onload = function() {
  document.getElementById('query').addEventListener('click', queryStats, false);
  document.getElementById('clear').addEventListener('click', clearStats, false);
}