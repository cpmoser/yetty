/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */


Ext.define("observ.data.sandbox.Sandbox", function ()
{
	var objects = {}, counter = 1;

	return {

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

		get: function (connection, id, theirRemoter, clientCb)
		{
			var o = objects[id];

			clientCb = clientCb || Ext.emptyFn;

			if (!o)
			{
				var collection = this.persistence.conn().collection("objects");

				try
				{
					var g = collection.findOne({_id: this.persistence.id(id)}, function (err, doc)
					{
						console.log("found object");
						console.log(doc);

						objects[id] = Ext.create(doc.className, doc.data, doc._id);

						var o = objects[id];

						clientCb(
							id,
							o.$className,
							o.getData(),
							theirRemoter ? o.addRemote(connection, theirRemoter) : undefined
						);
					});
				}
				catch (e)
				{
					console.log("error!");
					console.log(e);
				}

				console.log(g);

				return;
			}

			clientCb(
				id,
				o.$className,
				o.getData(),
				theirRemoter ? o.addRemote(connection, theirRemoter) : undefined
			);
		},

		onGet: function (cb, object)
		{
			cb();
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
