/**
 * 网厅业务线强制建立src目录，src下有lib|mock|page|widget|util
 * lib存放第三方库
 * mock存放假接口数据
 * page存放demo页面
 * widget存放与业务关联的模块
 * util存放标准的kissy组件
 *
 */

// 'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var ABC = require('abc-generator');

var ClamGenerator = module.exports = function ClamGenerator(args, options, config) {
	ABC.UIBase.apply(this, arguments);
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function () {
		var cb = this.async();
		var that = this;
		this.prompt([{
				name: 'npm_install',
				message: 'Install node_modules for grunt now?',
				default: 'Y/n',
				warning: ''
			}], function (err, props) {

				if (err) {
					return this.emit('error', err);
				}

				this.npm_install = (/^y/i).test(props.npm_install);
				if(this.npm_install){
					this.npmInstall('', {}, function (err) {

						if (err) {
							return console.log('\n'+yellow('please run "sudo npm install"\n'));
						}

						console.log(green('\n\nnpm was installed successful. \n\n'));
					});
				} else {
					console.log(yellow('\n\nplease run "npm install" before grunt\n'));
					console.log(green('\ndone!\n'));
				}
			}.bind(this));

		
    }.bind(this));
};

util.inherits(ClamGenerator, ABC.UIBase);

ClamGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

    // welcome message
	// console.log(ClamLogo(this));
	
	// welcome message
	var welcome =
	'\n     _-----_' +
	'\n    |       |' +
	'\n    |' + '--(o)--'.red + '|   .--------------------------.' +
	'\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
	'\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   | ' + 'enjoy yourself in Video!'.yellow.bold + ' |' +
	'\n    /___A___\\   \'__________________________\'' +
	'\n     |  ~  |'.yellow +
	'\n   __' + '\'.___.\''.yellow + '__' +
	'\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

	console.log(welcome);

    var abcJSON = {};
    try {
        abcJSON = require(path.resolve(process.cwd(), 'abc.json'));
    } catch (e) {

    }
    if (!abcJSON.author) {
        abcJSON.author = {
            name: '',
            email: ''
        }
    }
	if(!abcJSON.name){
		abcJSON.name = 'tmp';
	}

  // have Yeoman greet the user.
  // console.log(this.yeoman);
	var folderName = path.basename(process.cwd());

	// your-mojo-name => YourMojoName
	function parseMojoName(name){
		return name.replace(/\b(\w)|(-\w)/g,function(m){
			return m.toUpperCase().replace('-','');
		});
	}

    var prompts = [
        {
            name: 'projectName',
            message: 'Name of Project?',
            default: folderName,
            warning: ''
        },
        {
            name: 'author',
            message: 'Author Name:',
            default: abcJSON.author.name,
            warning: ''
        },
        {
            name: 'email',
            message: 'Author Email:',
            default: abcJSON.author.email,
            warning: ''
        },
        {
            name: 'groupName',
            message: 'Group Name:',
            default: 'de',
            warning: ''
        },
		{
            name: 'version',
            message: 'Version:',
            default: '1.0.0',
            warning: ''
		}
	];

	/*
	 * projectName：驼峰名称,比如 ProjectName
	 * packageName：原目录名称，比如 project-name
	 **/

    this.prompt(prompts, function (err, props) {
        if (err) {
            return this.emit('error', err);
        }

        this.packageName = props.projectName;// project-name 
		this.projectName = parseMojoName(this.packageName); //ProjectName
        this.author = props.author;
        this.email = props.email;
        this.version = props.version;
        this.groupName = props.groupName;
		this.config = 'http://g.tbcdn.cn/'+this.groupName+'/'+this.packageName+'/'+this.version+'/config.js';
		this.srcDir = (/^y/i).test(props.srcDir);
		this.srcPath = '../';
		this.currentBranch = 'master';

		cb();

    }.bind(this));
};

ClamGenerator.prototype.gruntfile = function gruntfile() {
	this.copy('Gruntfile_src.js','Gruntfile.js');
};

ClamGenerator.prototype.packageJSON = function packageJSON() {
    this.template('_package.json', 'package.json');
};

ClamGenerator.prototype.git = function git() {
    this.copy('_gitignore', '.gitignore');
};

ClamGenerator.prototype.app = function app() {
	this.mkdir('src');
	this.mkdir('src/lib');
	this.mkdir('src/mock');
	this.mkdir('src/page');
	this.mkdir('src/widget');
	this.mkdir('src/util');
	this.mkdir('src/service');
	this.template('config.js','src/config.js');
	this.copy('README.md', 'README.md');
	this.mkdir('doc');
	this.mkdir('build');
	this.template('abc.json');
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
