/*jslint esversion: 6*/
/*jslint browser: true*/
'use strict';

import sortValues from 'sort-values';

function getParams() {
    const params = {
        site: document.getElementById('site').value,
        start: document.getElementById('start-date').value,
        end: document.getElementById('end-date').value
    };

    return params;
}

function sortKeys(unordered) {
    const ordered = {};
    Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
    });

    return ordered;
}

function clearLoop(rootElm) {
    while (rootElm.firstChild) {
        rootElm.removeChild(rootElm.firstChild);
    }
}

function visitsPerDay(json) {
    let visitCounts = {};

    json.forEach(function(visit) {
        const dateOnly = visit.timestamp.split('T');

        if (!visitCounts.hasOwnProperty(dateOnly[0])) {
            visitCounts[dateOnly[0]] = 1;
        } else {
            visitCounts[dateOnly[0]] = visitCounts[dateOnly[0]] + 1;
        }
    });

    const sortedVisitsDays = sortKeys(visitCounts);

    let labels = [];
    let datas = [];
    Object.keys(sortedVisitsDays).forEach(function(key) {
        labels.push(key);
        datas.push(sortedVisitsDays[key]);
    });

    const data = {
        labels: labels,
        datasets: [{
            label: "Daily Visits",
            data: datas,
        }]
    };

    const dailyVisitsChart = document.getElementById('dailyVisitsChart');

    let myChart = new Chart(dailyVisitsChart, {
        type: 'bar',
        data: data
    });
}

function topPages(json) {
    let pageCounts = {};

    json.forEach(function(visit) {
        if (!pageCounts.hasOwnProperty(visit.title)) {
            pageCounts[visit.title] = 1;
        } else {
            pageCounts[visit.title] = pageCounts[visit.title] + 1;
        }
    });

    let sortedPageCounts = sortValues(pageCounts, 'desc');

    clearLoop(document.getElementById('top_pages'));

    let tableRoot = document.getElementById('top_pages');

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
        return response.json();
    }).then(function(json) {
        topPages(json);
        visitsPerDay(json);
    }).catch(function(ex) {
        console.log('parsing failed', ex);
    });
}

function last30Days() {
    let endDate = new Date();
    endDate.setTime(endDate.getTime() + (1000 * 60 * 60 * 24) * 1);

    let startDate = new Date();
    startDate.setTime(endDate.getTime() - (1000 * 60 * 60 * 24) * 30);

    const date = {
        'start-date': startDate.toISOString().split('T')[0],
        'end-date': endDate.toISOString().split('T')[0]
    };

    return date;
}

//Wait for the page to finish loading before starting to watch for a click
window.onload = function() {
    const date = last30Days();

    document.getElementById('start-date').value = date['start-date'];
    document.getElementById('end-date').value = date['end-date'];

    document.getElementById('query').addEventListener('click', queryStats, false);
};