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
		observable: Ext.ClassManager.getByAlias("observ.util.Observable") || "observ.util.Subscriber",
		persist:    Ext.ClassManager.getByAlias("observ.util.Persist")
	},

	statics:
	{
		observ:
		{
			set:    true,
			commit: true
		}
	},

	constructor: function ()
	{
		this.callParent(arguments);

		this.mixins.persist.constructor.call(this, arguments);
	},

	someFn: function ()
	{

	}
});


//
