/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

class MathUtils {
	static get ZERO_TOLERANCE() {
		return 0.0001;
	}

	static get TWO_PI() {
		return Math.PI * 2;
	}

	static toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	static toDegrees(radians) {
		return radians * (180 / Math.PI);
	}

	static sphericalToCartesianZ(sphereCoords) {
		let a = sphereCoords.x * Math.cos(sphereCoords.z);
		let x = a * Math.cos(sphereCoords.y);
		let y = a * Math.sin(sphereCoords.y);
		let z = sphereCoords.x * Math.sin(sphereCoords.z);
		sphereCoords.set(x, y, z);
		return sphereCoords;
	}
}
