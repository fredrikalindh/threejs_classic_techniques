uniform float uSize; 
uniform float uTime; 

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
	/**
	 * Position
	 */

	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

	// Spin
	float radius = distance(vec2(0.0), modelPosition.xz);
	float angle = atan(modelPosition.x, modelPosition.z);
	float angleOffset = (1.0 / radius) * uTime * 0.1;
	angle += angleOffset;
	modelPosition.x = cos(angle) * radius;
	modelPosition.z = sin(angle) * radius;
	
	// Randomness
	modelPosition.xyz += aRandomness;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition;

	/**
	 * Size
	 */
	gl_PointSize = aScale * uSize;

	gl_PointSize *= (  1.0 / - viewPosition.z );

	vColor = color;
}
