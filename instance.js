var extjs = require("./extjs-vm");

process.on("message", function ()
{
	console.log("received message");
});
