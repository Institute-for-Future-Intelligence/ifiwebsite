/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

/* global Sidebar, UI, THREE */

Sidebar.Map = function (editor) {

	function updateMap() {
		mapImg.src = getGoogleMapUrl(false);
	}

	function getGoogleMapUrl(highResolution) {
		let x = parseFloat(latitudeInput.getValue());
		let y = parseFloat(longitudeInput.getValue());
		let zoom = parseFloat(zoomInput.getValue());
		let scale = highResolution & zoom <= 20 ? 2 : 1;
		return "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center=" + x + "," + y + "&zoom=" + zoom + "&size=640x640&scale=" + scale + "&key=AIzaSyBEGiCg33CccHloDdPENWk1JDhwTEQaZQ0";
}

	function getGoogleMapAddressCoordinates() {
		const address = addressInput.getValue().replace(' ', '+');
		const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyD7MfCQjMAlsdFA3OmfGZ_rzC8ldJPnoHc";
		const xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
				const result = JSON.parse(xmlHttp.responseText).results[0];
				addressInput.setValue(result.formatted_address);
				latitudeInput.setValue(result.geometry.location.lat);
				longitudeInput.setValue(result.geometry.location.lng);
				zoomInput.setValue(20);
				updateMap();
			}
		};
		xmlHttp.open("GET", url, true); // true for asynchronous
		xmlHttp.send(null);
	}

	function getScale() {
		const zoom = parseInt(zoomInput.getValue());
		if (zoom === 21) {
			return 0.5;
		} else if (zoom === 20) {
			return 1;
		} else {
			return Math.pow(2, 20 - zoom);
		}
	}

	function setGridVisible(visible) {
		editor.sceneHelpers.children.forEach(function (child) {
			if (child instanceof THREE.GridHelper)
				child.visible = visible;
		});
	}

	// address, latitude, longitude, zoom
	var addressInput = new UI.Input("25 Love lane, Concord, MA, USA").setWidth('95%').onChange(function () {
		getGoogleMapAddressCoordinates();
	});

	var latitudeInput = new UI.Input("42.45661").onChange(function () {
		updateMap();
	});
	var longitudeInput = new UI.Input("-71.35823").onChange(function () {
		updateMap();
	});
	var zoomInput = new UI.Input("20").onChange(function () {
		updateMap();
	});

	var container = new UI.Panel();
	container.setBorderTop('0');
	container.setPaddingTop('20px');

	var row = new UI.Row();
	row.add(new UI.Text("Address"));
	container.add(row);

	var row = new UI.Row();
	row.add(addressInput);
	container.add(row);

	var row = new UI.Row();
	row.add(new UI.Text("Latitude").setWidth('90px'));
	row.add(latitudeInput);
	container.add(row);

	var row = new UI.Row();
	row.add(new UI.Text("Longitude").setWidth('90px'));
	row.add(longitudeInput);
	container.add(row);

	var row = new UI.Row();
	row.add(new UI.Text("Zoom").setWidth('90px'));
	row.add(zoomInput);
	container.add(row);

	// map image
	var row = new UI.Row();
	var mapImg = document.createElement('img');
	mapImg.style.width = "100%";
	mapImg.src = getGoogleMapUrl(false);
	row.dom.appendChild(mapImg);
	container.add(row);

	// add map plane to scene
	var plane = new THREE.Object3D();
	editor.scene.add(plane);

	// apply button
	var applyButton = new UI.Button("Apply").onClick(function () {
		if (parseInt(zoomInput.getValue()) < 16) {
			alert("The selected region is too large. Please zoom in and try again.");
		} else {
			const loader = new THREE.TextureLoader();
			loader.crossOrigin = '';
			var texture = loader.load(getGoogleMapUrl(true), function () {
				const d = 68.75 * getScale();
				plane.children.length = 0;
				var geometry = new THREE.PlaneGeometry(d, d);
				var material = new THREE.MeshBasicMaterial({map: texture});
				plane.add(new THREE.Mesh(geometry, material));
				setGridVisible(false);
				editor.signals.sceneGraphChanged.dispatch();
			});
		}

	});
	var clearButton = new UI.Button("Clear").onClick(function () {
		plane.children.length = 0;
		setGridVisible(true);
		editor.signals.sceneGraphChanged.dispatch();
	});

	applyButton.setMargin("5px");
	clearButton.setMargin("5px");

	var row = new UI.Row();
	row.add(applyButton);
	row.add(clearButton);
	container.add(row);

	return container;

};
