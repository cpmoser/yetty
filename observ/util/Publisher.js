/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

/*global console*/

Ext.define("observ.util.Publisher",
{
	extend: "observ.util.Subscriber",

	/**
	 * Constructor
	 */
	constructor: function ()
	{
		this.callParent();
	},

	onBeforePublish: function ()
	{
		return true;
	},

	/**
	 * Publish updates to a remote subscriber
	 *
	 * @param {mixed} value
	 */
	publishEvent: function ()
	{
		var args = [];

		Ext.iterate(arguments, function (value, index)
		{
			if (value === this)
			{
				args.push("this");
			}
			else
			{
				args.push(value);
			}
		}, this);

		var eventName = args.shift();

		Ext.iterate(this.subs, function (id, emitter)
		{
			emitter.call(emitter, "observ.publisher.event", eventName, this);
		}, args);
	}
});
