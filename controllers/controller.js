'use strict';
const views = require('co-views');
const parse = require('co-body');
const fs = require('fs');
const readline = require('readline');
const co = require('co');

const render = views(__dirname + '/../views', {
	map: { html: 'swig' }
});

function readDict(url) {
	return new Promise((resolve, reject) => {
		fs.readFile(url, (err, chunk) => {
			if (err) { console.log(err);reject(err); }
			resolve(chunk);
		});
	});
}

module.exports.home = function *home(ctx) {
	this.body = yield render('index');
};

module.exports.fetch = function *fetch(ctx) {
	console.log(ctx);
	this.body = yield readDict('./public/database/words_3.txt');
}
