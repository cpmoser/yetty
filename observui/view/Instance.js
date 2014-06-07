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

			defaults:
			{
				fieldStyle: "font-weight: bold; color: blue;"
			},

			items:
			[
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
					fieldLabel: "Time Running (seconds)",
					xtype:      "displayfield",
					name:       "ticks"
				},

				{
					fieldLabel: "Total Memory",
					xtype:      "displayfield",
					name:       "heapTotal",

					renderer: function (value)
					{
						return Math.round(value * 10 / 1024 / 1024) / 10 + " MB";
					}
				},

				{
					fieldLabel: "Used Memory",
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
