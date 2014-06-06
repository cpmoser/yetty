/*global require,window,navigator,console*/

var
	extjs  = require("./extjs-vm"),
	client = extjs.create("observ.Client");

client.connect();

/*try
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
*/

try
{
	client.instance.remote.getObject("5382c3e3bcd02d14171bd45a").then(function (b)
	{
		console.log("remote foo");
		console.log("WE GOT " + b);
	});
}
catch (e)
{
	console.log(e);
}
