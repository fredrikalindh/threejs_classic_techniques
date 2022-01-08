varying vec3 vColor;

void main() {
	// Circle
	// float strength = 1.0 - step(0.5, distance(gl_PointCoord, vec2(0.5, 0.5)));

	// // Diffuse point
	// float strength = 1.0 - distance(gl_PointCoord, vec2(0.5, 0.5)) * 2.0;

	// Light point
	float strength = 1.0 - distance(gl_PointCoord, vec2(0.5, 0.5));
	strength = pow(strength, 10.0);

	gl_FragColor = vec4(vColor * strength, 1.0);

	// His solution:
	// vec3 color = mix(vec3(0.0), vColor, strength);
	// gl_FragColor = vec4(color, 1.0);
	// gl_FragColor = vec4(vColor, strength);
}
