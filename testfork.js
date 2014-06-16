var extjs = require("./extjs-vm");

var local = extjs.create("observ.data.instance.LocalDelegate",
{
	name: "stocks.observjs.com",
	description: "ObservJS Stock Database",
	ns:          "observ-stock",
	location:    "https://www.observjs.com",
	foo:         "stock",
	cacheCount:  0,
	objectCount: 0
});

local.startup();
