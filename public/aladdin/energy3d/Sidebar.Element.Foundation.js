/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

/* global Sidebar, UI, Infinity, Foundation, THREE */

Sidebar.Element.Foundation = function (editor, object) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// width

	var widthRow = new UI.Row();
	var width = new UI.Number(parameters.width).onChange(updateGeometry);

	widthRow.add(new UI.Text('Width').setWidth('90px'));
	widthRow.add(width);

	container.add(widthRow);

	// height

	var heightRow = new UI.Row();
	var height = new UI.Number(parameters.height).onChange(updateGeometry);

	heightRow.add(new UI.Text('Height').setWidth('90px'));
	heightRow.add(height);

	container.add(heightRow);

	// depth

	var depthRow = new UI.Row();
	var depth = new UI.Number(parameters.depth).onChange(updateGeometry);

	depthRow.add(new UI.Text('Depth').setWidth('90px'));
	depthRow.add(depth);

	container.add(depthRow);

	// position

	var objectPositionRow = new UI.Row();
	var objectPositionX = new UI.Number().setWidth('50px').onChange(update);
	var objectPositionY = new UI.Number().setWidth('50px').onChange(update);

	objectPositionRow.add(new UI.Text('Position').setWidth('90px'));
	objectPositionRow.add(objectPositionX, objectPositionY);

	container.add(objectPositionRow);

	// rotation

	var objectRotationRow = new UI.Row();
	var objectRotationZ = new UI.Number().setStep(10).setUnit('°').setWidth('50px').onChange(update);

	objectRotationRow.add(new UI.Text('Rotation').setWidth('90px'));
	objectRotationRow.add(objectRotationZ);

	container.add(objectRotationRow);


	function updateGeometry() {
		editor.execute(new SetGeometryCommand(object, Foundation.createMesh(width.getValue(), height.getValue(), depth.getValue())));
	}

	function update() {
		var newPosition = new THREE.Vector3(objectPositionX.getValue(), objectPositionY.getValue(), object.position.z);
		if (object.position.distanceTo(newPosition) >= 0.01) {
			editor.execute(new SetPositionCommand(object, newPosition));
		}

		var newRotation = new THREE.Euler(0, 0, objectRotationZ.getValue() * THREE.Math.DEG2RAD);
		if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {
			editor.execute(new SetRotationCommand(object, newRotation));
		}
	}

	container.updateUI = function (object) {
		objectPositionX.setValue(object.position.x);
		objectPositionY.setValue(object.position.y);
		objectRotationZ.setValue(object.rotation.z * THREE.Math.RAD2DEG);
	};

	return container;

};

Sidebar.Geometry.BoxBufferGeometry = Sidebar.Geometry.BoxGeometry;
