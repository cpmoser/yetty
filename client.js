/*global require,window,navigator,console*/

var
	extjs  = require("./extjs-vm"),
	client = extjs.create("observ.Client");

/*client.create("iobserv.data.Sandbox", {}, function (object, id)
{
	console.log(object);
	console.log("received object with id " + id);
});
*/

client.connect();

client.get(2, function (o)
{
	o.alter();
});
