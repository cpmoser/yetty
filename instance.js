var
	extjs    = require("./extjs-vm"),
	config   = JSON.parse(process.env.instance),
	instance = extjs.create("observ.data.instance.Local", config).startup(extjs);
