var extjs = require("./extjs-vm");

var instance = extjs.create("observ.data.sandbox.Sandbox", process.env.instance).startup(extjs);

console.log("we have our instance", instance);