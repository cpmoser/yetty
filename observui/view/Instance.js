Ext.define("observui.view.Instance",
{
	extend: "Ext.FormPanel",

	constructor: function (config)
	{
		config = Ext.apply({}, config,
		{
			fieldDefaults:
			{
				labelAlign: "top"
			},

			items:
			[
				{
					fieldLabel: "Instance Name",
					xtype:      "displayfield",
					name:       "name",
					itemId:     "name"
				},

				{
					fieldLabel: "Description",
					xtype:      "displayfield",
					name:       "description"
				},

				{
					fieldLabel: "Namespace",
					xtype:      "displayfield",
					name:       "ns"
				},

				{
					fieldLabel: "Location",
					xtype:      "displayfield",
					name:       "location"
				},

				{
					fieldLabel: "ticks",
					xtype:      "displayfield",
					name:       "ticks"
				},

				{
					fieldLabel: "heapTotal",
					xtype:      "displayfield",
					name:       "heapTotal",

					renderer: function (value)
					{
						return Math.round(value * 10 / 1024 / 1024) / 10 + " MB";
					}
				},

				{
					fieldLabel: "heapUsed",
					xtype:      "displayfield",
					name:       "heapUsed",

					renderer: function (value)
					{
						return Math.round(value * 10 / 1024 / 1024) / 10 + " MB";
					}
				}
			]
		});

		this.callParent([config]);
	}
});
