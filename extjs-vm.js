/**
 * ExtJS Virtual Machine
 * Creates a node VM running ExtJS.  For now, we're just loading the full ExtJS (hence the additional setup code below)
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

var
	emptyFn = function () {},

	cfg =
	{
		setInterval:   setInterval,
		clearInterval: clearInterval,
		setTimeout:    setTimeout,
		clearTimeout:  clearTimeout,

		/**
		 * note: we may want to remove this
		 */
		require: require,

		console:             console,
		ActiveXObject:       emptyFn,
		addEventListener:    emptyFn,
		removeEventListener: emptyFn,

		navigator:
		{
			userAgent: ""
		},

		document:
		{
			addEventListener:    emptyFn,
			removeEventListener: emptyFn,

			documentElement:
			{
				style:
				{
					boxShadow: undefined
				}
			},

			getElementsByTagName: function (tagName)
			{
				return [
					{
						src: "io"
					}
				];
			},

			createElement: function ()
			{
				return {};
			}
		},

		location:
		{
			protocol: "http:"
		}
	},

	//extJsPath = "/Users/cpmoser/Sites/Embarc/Application/webroot/ext-4.2.0.663/",
//	extJsPath = "/Users/cpmoser/ext-4.2.1.883/",
//	extJsPath = "/www-local/web/desktop/ihr/client/node/observable.io/ext-4.2.0.663/",
	extJsPath = "./ext-4.2.1.883/",

	fs = require("fs"),
	vm = require("vm");

cfg.ActiveXObject.prototype =
{
	getElementsByTagName: function ()
	{
		return [];
	},

	loadXML: function ()
	{
	//	console.log("ActiveXObject: loadXML");
	}
};

cfg.window = cfg;

var
	context   = vm.createContext(cfg),
	extJsFile = "ext-all-debug.js", // use ext.js to use dynamic loader
	code      = fs.readFileSync(extJsPath + extJsFile);

extJsFile = "ext.js";

vm.runInContext(code, context, extJsFile);

var
	Ext  = context.Ext,
	util = require("util");

Ext.Loader.setPath("Ext", extJsPath + "src");

context.Ext.Loader.loadScriptFile = function (url, onLoad, onError, scope, synchronous)
{
	util.log("Ext.Loader " + url);

	var code = fs.readFileSync(url);

	// better way may be this --
	try
	{
		vm.runInContext(code, context, url);
	}
	catch (e)
	{
		console.log(e.stack);
		throw e;
	}

	onLoad.call(scope);
};

module.exports = context.Ext;

