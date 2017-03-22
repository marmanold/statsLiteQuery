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

  while(responseRoot.firstChild) {
    responseRoot.removeChild(responseRoot.firstChild);
  }

  let tableRoot = document.getElementById('top_pages');

  while(tableRoot.firstChild) {
    tableRoot.removeChild(tableRoot.firstChild);
  }
}

function listVisits(json) {
  let responseRoot = document.getElementById('results');

  while(responseRoot.firstChild) {
    responseRoot.removeChild(responseRoot.firstChild);
  }

  json.forEach(function(visit) {
    let newVisit = document.createElement('li');
    newVisit.appendChild(document.createTextNode(JSON.stringify(visit)));
    responseRoot.appendChild(newVisit);
  });
}

function topPages(json) {
  let pageCounts = {};

  json.forEach(function(visit) {
    if(!pageCounts.hasOwnProperty(visit.page)){
      pageCounts[visit.page] = 1;
    }
    else {
      pageCounts[visit.page] = pageCounts[visit.page]+1;
    }
  });

  let sortValues = require('sort-values');
  let sortedPageCounts = sortValues(pageCounts, 'desc');

  let tableRoot = document.getElementById('top_pages');

  while(tableRoot.firstChild) {
    tableRoot.removeChild(tableRoot.firstChild);
  }

  let titleRow = document.createElement('tr');
  let titlePage = document.createElement('th');
  let titleVisit = document.createElement('th');

  titlePage.appendChild(document.createTextNode('Page'));
  titleVisit.appendChild(document.createTextNode('Visits'));
  titleRow.appendChild(titlePage);
  titleRow.appendChild(titleVisit);
  tableRoot.appendChild(titleRow);

  for (let key in sortedPageCounts) {
    let newRow = document.createElement('tr');
    let newPage = document.createElement('td');
    let newVisit = document.createElement('td');

    newPage.appendChild(document.createTextNode(key));
    newVisit.appendChild(document.createTextNode(sortedPageCounts[key]));

    newRow.appendChild(newPage);
    newRow.appendChild(newVisit);

    tableRoot.appendChild(newRow);

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
      listVisits(json);
      topPages(json);
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    });
}

//Wait for the page to finish loading before starting to watch for a click
window.onload = function() {
  document.getElementById('query').addEventListener('click', queryStats, false);
  document.getElementById('clear').addEventListener('click', clearStats, false);
}