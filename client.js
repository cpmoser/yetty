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
	client.on("instance", function (instance)
	{
		var remote = instance.remote;

		try
		{
			instance.set("foo", "foobar");
		}
		catch (e)
		{
			console.log(e.message);
			console.log(e.stack);
		}

		try
		{
			remote.getObjectCacheCount().then(function (count)
			{
				console.log("remote object count is " + count);
			});
		}
		catch (e)
		{
			console.log(e);
		}
	});

	/*
	client.instance.remote.getObject("5382c3e3bcd02d14171bd45a").then(function (b)
	{
		console.log("remote foo");
		console.log("WE GOT " + b);
	});
	*/
}
catch (e)
{
	console.log(e);
}
