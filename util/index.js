// 'use strict';
var util = require('util');
var path = require('path');
//var ClamLogo = require('../app/logo').ClamLogo;
var yeoman = require('yeoman-generator');
var ABC = require('abc-generator');

var AppGenerator = module.exports = function AppGenerator(args, options, config) {
	// yeoman.generators.Base.apply(this, arguments);
	ABC.UIBase.apply(this, arguments);

    this.on('end', function () {

    }.bind(this));

	this.on('error',function(){});

};

util.inherits(AppGenerator, ABC.UIBase);

AppGenerator.prototype.askFor = function askFor() {
	var cb = this.async();
	
    // welcome message
	//console.log(ClamLogo(this));

    var prompts = [{
        name: '_version',
        message: 'version?',
        default: getversion(this.args)
    }];

    this.prompt(prompts, function (err,props) {
		if (err) {
			return this.emit('error', err);
		}
        this._version = props._version;
        cb();
    }.bind(this));


};

AppGenerator.prototype.begin = function begin() {
	this.invoke('kissy-gallery',{
		args:[
			this._version
		]
	});
};

function consoleColor(str,num){
	if (!num) {
		num = '32';
	}
	return "\033[" + num +"m" + str + "\033[0m"
}

function green(str){
	return consoleColor(str,32);
}

function yellow(str){
	return consoleColor(str,33);
}

function red(str){
	return consoleColor(str,31);
}

function blue(str){
	return consoleColor(str,34);
}

function getversion(a){
	if(!a || a.length == 0 ){
		return '1.0'
	}
	if(/^\d+\.\d+$/i.test(a[0])){
		return a[0].toString();
	} else {
		return '1.0';
	}
}
