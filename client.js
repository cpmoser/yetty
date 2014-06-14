/*global require,window,navigator,console*/

var
	extjs  = require("./extjs-vm"),
	client = extjs.create("observ.Client");

client.connect(5050).then(function (instance)
{
	console.log("we received instance", instance);
	console.log(arguments);
}, function (error)
{
	console.log("received error");
	console.log(error.message);
	console.log(error.stack);
});
