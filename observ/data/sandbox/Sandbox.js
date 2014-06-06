/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */


Ext.define("observ.data.sandbox.Sandbox", function ()
{
	var objects = {}, counter = 1;

	return {

		observ:
		{
			publish: "",
			sync: "",

			cb: "",
			/**
			 * specifies synced methods.  These are methods that are run independently by the caller/callee, e.g. "set" when run on one
			 * peer will tell a remote peer to also call set on the other peer with the same arguments.
			 */
			receive:
			{

			},

			/**
			 * call differs from receive.  it requires a callback as its first argument, and it is designed to return results from a call made
			 * a remote peer.
			 */
			callback:
			{

			},

			subscriber:
			{
				set: true,
				retrieve: function ()
				{

				}
			},

			publisher:
			{

			},

			peer:
			{

			}
		},

		extend: "observ.data.Model",

		fields:
		[
			{
				name: "ns",
				type: "string"
			},

			{
				name: "location",
				type: "string"
			}
		],

		add: function (obj)
		{
			objects[counter++] = obj;
		},

		startup: function (vm)
		{
			if (vm === undefined)
			{
				console.log("instantiating VM");
			}
			else
			{
				console.log("using existing VM");
				this.vm = vm;
			}
		},

		shutdown: function ()
		{

		},

		constructor: function (data, persistence)
		{
			this.callParent(arguments);

			this.add(this);

			if (!this.vm)
			{
				// create a new vm and set the loader path
			}

			this.persistence = persistence;
		},

		getObject: function (id)
		{
			var me = this, promise, persist = this.persistence;

			promise = require("Q").Promise(function (resolve, reject, notify)
			{
				var o = objects[id], c, g;

				if (o)
				{
					resolve(o);
				}
				else
				{
					try
					{
						c = persist.conn().collection("objects");

						g = c.findOne({_id: persist.id("53850588814f6c0024268755")}, function (err, doc)
						{
							console.log(err);
							console.log("got doc");
							console.log(doc);

							objects[id] = Ext.create(doc.className, doc.data, doc._id);
							resolve(objects[id]);
						});
					}
					catch (e)
					{
						console.log(e);
					}
				}
			});

			return promise;
		},

		getFoo: function ()
		{
			var q = require("Q");

			var promise = require("Q").Promise(function (resolve, reject, notify)
			{
				resolve("BAR");
			});

			return promise;
		},

		create: function (connection, className, data, theirRemoter, clientCb)
		{
			var
				o = Ext.create(className, data),
				c = this.persistence.conn().collection("objects"),

				d =
				{
					className: o.$className,
					data:      o.getData()
				};

			clientCb = clientCb || Ext.emptyFn;

			c.insert(d, {}, function (err, records)
			{
				try
				{
					if (err)
					{
						throw new Error("database error");
					}

					o.setId(records[0]._id);
					o.commit();

					clientCb(
						o.id,
						o.$className,
						o.data,
						theirRemoter ? o.addRemote(connection, theirRemoter) : undefined
					);
				}
				catch (e)
				{
					clientCb(false, null, null, null);
				}
			});

			return o;
		}
	};
});
