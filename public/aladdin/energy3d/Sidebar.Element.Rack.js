/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

/* global Sidebar, UI, Infinity, Foundation, THREE, Rack */

Sidebar.Element.Rack = function (editor, object) {

	var signals = editor.signals;

	var container = new UI.Row();

	var parameters = object.userData.elementView.topMesh.geometry.parameters;

	// dimension

	var dimensionRow = new UI.Row();
	var width = new UI.Number(parameters.width).setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "dimensionWidth", width.getValue()));
	});
	var height = new UI.Number(parameters.height).setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "dimensionHeight", height.getValue()));
	});
	width.min = 1;
	height.min = 1;

	dimensionRow.add(new UI.Text('Dimension').setWidth('110px'));
	dimensionRow.add(width, height);

	container.add(dimensionRow);

	// polls

	var pollsRow = new UI.Row();
	var pollsDistanceX = new UI.Number(1).setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "pollDistanceX", pollsDistanceX.getValue()));
	});
	var pollsDistanceY = new UI.Number(1).setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "pollDistanceY", pollsDistanceY.getValue()));
	});
	pollsDistanceX.min = 0.1;
	pollsDistanceY.min = 0.1;

	pollsRow.add(new UI.Text('Polls Distance').setWidth('110px'));
	pollsRow.add(pollsDistanceX, pollsDistanceY);

	container.add(pollsRow);

	// position

	var positionRow = new UI.Row();
	var positionX = new UI.Number().setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "x", positionX.getValue()));
	});
	var positionY = new UI.Number().setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "y", positionY.getValue()));
	});

	positionRow.add(new UI.Text('Position').setWidth('110px'));
	positionRow.add(positionX, positionY);

	container.add(positionRow);

	// rotation

	var rotationRow = new UI.Row();
	var rotationX = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "tiltAngle", rotationX.getValue()));
	});
	var rotationZ = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(function () {
		editor.execute(new SetModelValueCommand(object.userData.elementView, "rotationAngle", rotationZ.getValue()));
	});

	rotationRow.add(new UI.Text('Rotation').setWidth('110px'));
	rotationRow.add(rotationZ, rotationX);

	container.add(rotationRow);


	function updateGeometry() {
		editor.execute(new SetGeometryCommand(object.userData.elementView.topMesh, Rack.createMesh(width.getValue(), height.getValue())));
	}

	function update() {
		let target = object.userData.elementView.root;
		var newPosition = new THREE.Vector3(positionX.getValue(), positionY.getValue(), target.position.z);
		if (target.position.distanceTo(newPosition) >= 0.01) {
			editor.execute(new SetPositionCommand(target, newPosition));
		}

		var newRotation = new THREE.Euler(0, 0, rotationZ.getValue() * THREE.Math.DEG2RAD);
		if (target.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {
			editor.execute(new SetRotationCommand(target, newRotation));
		}

		target = object.userData.elementView.topMesh;
		var newRotation = new THREE.Euler(rotationX.getValue() * THREE.Math.DEG2RAD, 0, 0);
		if (target.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {
			editor.execute(new SetRotationCommand(target, newRotation));
		}
	}

	container.updateUI = function (object) {
		positionX.setValue(object.position.x);
		positionY.setValue(object.position.y);
		rotationX.setValue(object.userData.elementView.topMesh.rotation.x * THREE.Math.RAD2DEG);
		rotationZ.setValue(object.rotation.z * THREE.Math.RAD2DEG);
	};

	return container;

};

Sidebar.Geometry.BoxBufferGeometry = Sidebar.Geometry.BoxGeometry;
