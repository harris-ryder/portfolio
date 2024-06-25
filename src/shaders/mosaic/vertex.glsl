varying vec2 vUv;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);

  // Varyings
    vUv = uv;
}