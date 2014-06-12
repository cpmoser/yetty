var child = require("child_process").fork("./extjs-vm");

console.log(child);

child.on("message", function ()
{
	console.log("we got a child message");
	console.log(arguments);
});