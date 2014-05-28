/*global require,window,navigator,console*/

var
	extjs  = require("./extjs-vm");
//	client = extjs.create("observ.Client");

/*client.create("iobserv.data.Sandbox", {}, function (object, id)
{
	console.log(object);
	console.log("received object with id " + id);
});
*/

var clients = [], client, log = function (object)
{
	console.log("got the object");
};

for (var i = 0; i < 1; i++)
{
	client = extjs.create("observ.Client");

	client.connect();

	clients.push(client);

	/*client.create("observ.data.Test", {foo: "bar"}, function (o)
	{
		console.log("new object created!");
		console.log(o);
	});
	*/

	client.get("5384cc83fb2533c413e1d63c", log);
}