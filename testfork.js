var extjs = require("./extjs-vm");

var cb = function ()
{
	console.log("helloworld");
};

var instance = {
	name: "ObservJS Stocks",
	ns:   "stock",
	location: "/stock"
};

var child = require("child_process").fork("./instance", [], {env: {instance: instance}});
