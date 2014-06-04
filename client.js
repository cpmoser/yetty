/*global require,window,navigator,console*/

var
	extjs  = require("./extjs-vm"),
	client = extjs.create("observ.Client");

client.connect();

try
{
	client.get("5384cc83fb2533c413e1d63c", function (object)
	{
		console.log("successfully received", object);
	});
}
catch (e)
{
	console.log(e);
}
