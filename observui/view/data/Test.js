Ext.define("observui.view.data.Test",
{
	extend: "Ext.FormPanel",

	constructor: function (config)
	{
		config = Ext.apply({}, config,
		{
			items:
			[
				{
					fieldLabel: "foo",
					xtype: "textfield",
					name:  "foo"
				}
			]
		});

		this.callParent([config]);
	},

	setModel: function (model)
	{
		this.loadRecord(model);
		model.on("remote-set", this.loadRecord, this);
	}
});