Ext.define("observui.view.Instance",
{
	extend: "Ext.FormPanel",

	constructor: function (config)
	{
		config = Ext.apply({}, config,
		{
			layout: "form",
			items:
			[
				{
					fieldLabel: "Instance Name",
					xtype: "displayfield",
					name:  "name"
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
				}
			]
		});

		this.callParent([config]);
	}
});