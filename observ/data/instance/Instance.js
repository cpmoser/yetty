/**
 * copyright (c) 2014 Chris Moser (cpmoser@network54.com)
 */

Ext.define("observ.data.instance.Instance", function ()
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
				createObject: true,
				getObject: true,
				getObjects: true,
				getObjectCacheCount: true
			}
		},

		extend: "observ.data.Model",

		fields:
		[
			{
				name: "name",
				type: "string"
			},

			{
				name: "description",
				type: "string"
			},

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
				name: "objectCount",
				type: "int"
			},

			{
				name: "cacheCount",
				type: "int"
			},

			{
				name: "foo",
				type: "string"
			},

			{
				name: "ticks",
				type: "int"
			},

			{
				name: "heapTotal",
				type: "int"
			},

			{
				name: "heapUsed",
				type: "int"
			},

			{
				name: "cpu",
				type: "float"
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

			this.tick();

			return this;
		},

		tick: function ()
		{
			var tick = this.get("ticks"), me = this;

			var mem = Ext.process.memoryUsage();

			this.set("heapTotal", mem.heapTotal);
			this.set("heapUsed", mem.heapUsed);

			var pid = Ext.process.pid, usage = require("usage");

			usage.lookup(pid, function (err, result)
			{
				if (err)
				{
					me.set("cpu", -1);
					return;
				}

				me.set("cpu", result.cpu);
			});

			tick++;

			this.set("ticks", tick);

			Ext.defer(this.tick, 5000, this);
		},

		shutdown: function ()
		{

		},

		constructor: function (data)
		{
			this.callParent(arguments);

			this.addEvents("beforecreate", "create", "instantiate", "beforeinstantiate");
		},

		setVm: function (vm)
		{
			this.vm = vm;
		},

		setPersistence: function (persistence)
		{
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

						g = c.findOne({_id: persist.id(id)}, function (err, doc)
						{
							var object = me.instantiate(doc.className, doc.data, doc._id);
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

		getObjects: function (className)
		{
			var me = this, promise, persist = this.persistence;

			promise = require("Q").Promise(function (resolve, reject, notify)
			{
				var collection = persist.conn().collection("objects"), filter = className ? {className: className} : {};

				try
				{
					collection.find(filter, {className: 1}, function (err, docs)
					{
						docs.toArray(function (err, a)
						{
							resolve(a);
						});
					});
				}
				catch (e)
				{
					console.log(e.message);
					console.log(e.stack);
				}
			});

			return promise;
		},

		getObjectCount: function ()
		{
			var promise = require("Q").Promise(function (resolve, reject, notify)
			{
				var c = this.persistence.conn().collection("objects");

				c.count(function (err, count)
				{
					if (err)
					{
						reject(err);
					}

					resolve(count);
				});
			}.bind(this));

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

		instantiate: function (className, data, id)
		{
			this.fireEvent("beforeinstantiate", this, className, data, id);

			console.log("about to instantiate " + className);
			var object = this.vm.create(className, data, id);
			console.log("instantiation worked");

			this.fireEvent("instantiate", this, object);

			objects[object.getId()] = object;

			return object;
		},

		createObject: function (className, data)
		{
			try
			{
				var
					me = this,
					promise = require("Q").Promise(function (resolve, reject, notify)
					{
						try
						{
							var
								o = me.instantiate(className, data),
								c = me.persistence.conn().collection("objects"),

								d =
								{
									className: o.$className,
									data:      o.getData()
								};

							c.insert(d, {}, function (err, records)
							{
								o.setId(records[0]._id);
								o.commit();

								me.set("objectCount", me.get("objectCount") + 1);
								resolve(o);
							});
						}
						catch (e)
						{
							reject(e);
						}
					});

				return promise;
			}
			catch (e)
			{
				console.log(e.message);
			}
		},

		create: function (connection, className, data, theirRemoter, clientCb)
		{
			var
				o = this.vm.create(className, data),
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
		},

		/**
		 * Function to handle a socket passed over directly by a client or by a handoff from a master instance to a local one
		 */
		handleSocket: function (socket)
		{

		},

		handleWebSocket: function (server)
		{

		}
	};
});
