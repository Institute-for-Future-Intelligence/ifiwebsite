/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

/* global THREE */

class Foundation extends ElementView {

	static createMesh(width, height, depth) {
		const geometry = new THREE.BoxBufferGeometry(width, height, depth);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, depth / 2));
		return geometry;
	}

	constructor(width, height, depth) {
		super();
		width = width || 10;
		height = height || 10;
		depth = depth || 0.2;
		const mesh = new THREE.Mesh(Foundation.createMesh(width, height, depth), new THREE.MeshStandardMaterial());
		mesh.name = "Foundation";
		mesh.userData = new UserData(this);
		mesh.position.z = depth / 2;
		this.root = mesh;
	}

}