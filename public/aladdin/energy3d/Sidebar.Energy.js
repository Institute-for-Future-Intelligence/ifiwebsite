/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

/* global Sidebar, UI, Heliodon, MathUtils */

Sidebar.Energy = function (editor) {

	var container = new UI.Panel();
	container.setBorderTop('0');
	container.setPaddingTop('20px');


	// date
	var row = new UI.Row();
	var dateInput = new UI.Input("1/1/2017").onChange(function () {
		Heliodon.instance.setDate(new Date(dateInput.getValue()));		
		Heliodon.instance.draw();
		editor.signals.sceneGraphChanged.dispatch();
	});

	row.add(new UI.Text('Date').setWidth('90px'));
	row.add(dateInput);
	container.add(row);

	// time
	var row = new UI.Row();
	var timeInput = new UI.Input("24:00").onChange(function () {
		Heliodon.instance.setTime(new Date("1/1/2017 " + timeInput.getValue()));
		Heliodon.instance.draw();
		editor.signals.sceneGraphChanged.dispatch();		
	});

	row.add(new UI.Text('Time').setWidth('90px'));
	row.add(timeInput);
	container.add(row);

	// city
	var options = ["Boston", "Ottawa", "Tehran"];
	var row = new UI.Row();
	var citySelect = new UI.Select().setOptions(options).setWidth('150px').onChange(function () {

		var value = this.getValue();


	});
	citySelect.setValue(0);

	row.add(new UI.Text('City').setWidth('90px'));
	row.add(citySelect);
	container.add(row);

	// latitude
	var row = new UI.Row();
	var latitudeInput = new UI.Input("42").onChange(function () {
		Heliodon.instance.setLatitude(MathUtils.toRadians(latitudeInput.getValue()));
		Heliodon.instance.draw();
		editor.signals.sceneGraphChanged.dispatch();
	});

	row.add(new UI.Text('Latitude').setWidth('90px'));
	row.add(latitudeInput);
	container.add(row);

	return container;

};
