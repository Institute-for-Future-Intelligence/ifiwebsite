/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

/* global THREE */

class ElementView {

	constructor(model) {
		this.model = model;
		this.userData = new UserData(this);
	}

	update() {

	}

	getEditPointShape(i) {
		if (i >= this.pointsRoot.children.length) {
			addNewEditPointShape(i);
		}
		return this.pointsRoot.children[i];
	}

	addNewEditPointShape(i) {
		var geometry = new THREE.SphereGeometry(0.1, 8, 8);
		var material = new THREE.MeshBasicMaterial({color: 0xffff00});
		pointShape = new THREE.Mesh(geometry, material);
		pointShape.userData = new UserData(this, i, true);
		pointShape.visible = false;
		this.pointsRoot.add(pointShape);
	}

}