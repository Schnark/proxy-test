/*global URL, Blob*/
(function () {
"use strict";

function getUrl (url, proxy) {
	if (proxy.indexOf('?') > -1) {
		url = encodeURIComponent(url);
	}
	return proxy + url;
}

function send (url, type, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		callback(xhr);
	};
	xhr.ontimeout = function () {
		callback();
	};
	xhr.onerror = function () {
		callback();
	};
	xhr.open('GET', url);
	xhr.responseType = type;
	xhr.send();
}

function showResponse (xhr, isText) {
	var output = document.getElementById('output'), el;
	if (isText) {
		el = document.createElement('pre');
		el.textContent = xhr.response;
	} else {
		el = document.createElement('iframe');
		el.src = URL.createObjectURL(new Blob([xhr.response], {type: xhr.getResponseHeader('Content-Type')}));
	}
	output.innerHTML = '';
	output.appendChild(el);
	document.getElementById('headers').textContent = xhr.getAllResponseHeaders();
}

function showError () {
	document.getElementById('output').textContent = 'Error';
	document.getElementById('headers').textContent = '';
}

function runTest () {
	var isText = document.getElementById('text').checked;
	send(
		getUrl(document.getElementById('url').value, document.getElementById('proxy').value),
		isText ? 'text' : 'arraybuffer',
		function (xhr) {
			if (xhr) {
				showResponse(xhr, isText);
			} else {
				showError();
			}
		}
	);
}

function init () {
	document.getElementById('form').addEventListener('submit', function (e) {
		e.preventDefault();
		runTest();
	});
}

init();

})();