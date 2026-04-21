/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

/* global THREE */

class Rack extends ElementView {

	static createMesh(rackModel) {
		const geometry = new THREE.BoxBufferGeometry(width, height, 0.05);
		return geometry;
	}

	constructor(model) {
		super(model);
		this.root = new THREE.Group();
		this.root.name = "Rack";
		this.root.userData = this.userData;
		this.update();
	}

	update() {
		this.root.children.length = 0;
		this.root.position.x = this.model.x;
		this.root.position.y = this.model.y;

		this.topMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(this.model.dimensionWidth, this.model.dimensionHeight, 0.05), new THREE.MeshStandardMaterial());
		this.topMesh.name = "Rack Top";
		this.topMesh.userData = this.userData;
		this.topMesh.position.z = this.model.pollHeight;
		this.topMesh.rotation.x = this.model.tiltAngle;
		this.root.add(this.topMesh);

		const scaleX = this.model.dimensionWidth;
		const scaleY = this.model.dimensionHeight * Math.cos(this.model.tiltAngle);
		for (let i = 0; i < scaleX; i += this.model.pollDistanceX) {
			const x = i / 2;
			for (let j = 0; j < scaleY; j += this.model.pollDistanceY) {
				const y = j / 2;
				this.addPole(x, y);
				if (i !== 0)
					this.addPole(-x, y);
				if (j !== 0) {
					this.addPole(x, -y);
					if (i !== 0)
						this.addPole(-x, -y);
				}
			}
		}

//		this.root.updateMatrixWorld(true);
	}

	addPole(x, y) {
		const radius = 0.05;
		let poleHeight = this.model.pollHeight;
		poleHeight += (y - radius) * Math.tan(this.topMesh.rotation.x);
		const geometry = new THREE.CylinderBufferGeometry(radius, radius, poleHeight, 20);
		const material = new THREE.MeshBasicMaterial();
		const pole = new THREE.Mesh(geometry, material);
		pole.name = "Rack Pole";
		pole.position.x = x;
		pole.position.y = y;
		pole.position.z = poleHeight / 2;
		pole.rotation.x = Math.PI / 2;
//		pole.scale.x = 1 / this.root.scale.x;
//		pole.scale.z = 1 / this.root.scale.y;
		this.root.add(pole);
	}

	draw() {

	}

}