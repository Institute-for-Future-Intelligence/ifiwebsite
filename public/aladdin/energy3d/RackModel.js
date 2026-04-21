/*
 * @author: Saeid Nourian (snourian@concord.org)
 */

class RackModel extends ElementModel {

	constructor(dimensionWidth, dimensionHeight, pollHeight, pollDistanceX, pollDistanceY, rotationAngle, tiltAngle, x, y) {
		super();
		this.dimensionWidth = dimensionWidth || 1;
		this.dimensionHeight = dimensionHeight || 1;
		this.pollHeight = pollHeight || 2;
		this.pollDistanceX = pollDistanceX || 2;
		this.pollDistanceY = pollDistanceY || 2;
		this.rotationAngle = rotationAngle || 0;
		this.tiltAngle = tiltAngle || 0.5;
		this.x = x || 0;
		this.y = y || 0;
	}
}