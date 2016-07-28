'use strict';
const views = require('co-views');
const parse = require('co-body');
const fs = require('fs');
const readline = require('readline');
const co = require('co');

const render = views(__dirname + '/../views', {
	map: { html: 'swig' }
});

const forgotwordsFile = './public/database/forgotwords.txt';
const dictFile = './public/database/words_3.txt';

function readFile(url) {
	return new Promise((resolve, reject) => {
		fs.readFile(url, (err, chunk) => {
			if (err) { console.log(err); reject(err); }
			resolve(chunk);
		});
	});
}

module.exports.home = function *home(ctx) {
	let data = yield readFile(forgotwordsFile);
	let lines = data.toString().split('\n');
	lines.pop();
	data = yield readFile(dictFile);
	data = data.toString().split('\n');
	let dict = {};
	for (let line of data) {
		let [answer, question] = line.split('|');
		dict[answer] = question;
	}
	console.log(lines);
	this.body = yield render('index', { forgotWords: lines, dict: dict });
};

module.exports.fetch = function *fetch(ctx) {
	console.log(ctx);
	this.body = yield readFile(dictFile);
}

module.exports.sendforgot = function *sendforgot() {
	this.type = "text/plain";
	this.body = yield readFile(forgotwordsFile);
}

module.exports.receiveforgot = function *receiveforgot() {
	let post = yield parse(this);
	let buf = post['contents'];

	let data = yield readFile(forgotwordsFile);
	let lines = data.toString().split('\n');
	let dict = new Set();
	for (let line of lines)
		dict.add(line.trim());

	for (let word of buf) {
		word = word.trim();
		if (dict.has(word)) continue;
		fs.appendFileSync(forgotwordsFile, word + '\n'); //TODO use fs.writeFile
	}
}
