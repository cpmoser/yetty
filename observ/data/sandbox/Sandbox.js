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

				var cursor = collection.find({_id: id});

				cursor.nextObject(function (err, doc)
				{
					objects[id] = Ext.create(doc.className, doc.data, doc._id);


				});
			}

			clientCb = clientCb || Ext.emptyFn;

			try
			{
				var myRemoter = o.addRemote(connection, theirRemoter);

				clientCb(
					id,
					o.$className,
					o.data,
					myRemoter // addRemote returns remoters receive method
				);
			}
			catch (e)
			{
				clientCb(false, null, null, null);
			}
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
