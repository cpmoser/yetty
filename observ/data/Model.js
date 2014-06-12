/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.data.Model",
{
	extend: "Ext.data.Model",

	mixins:
	{
		/**
		 * defaults to the subscriber mixin *unless* the observ.util.Observable alias is defined (e.g. as a Publisher)
		 */
		observable: "observ.util.Observable",
		persist:    Ext.ClassManager.getByAlias("observ.util.Persist") || "observ.util.persist.Persist"
	},

	constructor: function ()
	{
		this.callParent(arguments);

		if (this.mixins.persist)
		{
			this.mixins.persist.constructor.call(this, arguments);
		}
	},

	destroy: function ()
	{
		alert("Destroy");
		this.callParent();
	}
});
