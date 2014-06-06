/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */


Ext.define("observ.data.sandbox.Sandbox", function ()
{
	var objects = {}, counter = 1;

	return {

		observ:
		{
			broadcast:
			{
				set: true
			},

			callable:
			{
				getObject: true,
				getObjectCacheCount: true
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
			},

			{
				name: "count",
				type: "int"
			},

			{
				name: "cacheCount",
				type: "int"
			},

			{
				name: "foo",
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

		getObjectCacheCount: function ()
		{
			var promise = require("Q").Promise(function (resolve, reject, notify)
			{
				resolve(Object.keys(objects).length);
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
