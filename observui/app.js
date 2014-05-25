Ext.application(
{
	name: "observui",
	appFolder: "/observui",

	launch: function ()
	{
		Ext.create("observui.view.Viewport");
	}
});
