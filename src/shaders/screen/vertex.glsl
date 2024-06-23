varying vec2 vUv;

uniform sampler2D uPictureTexture;

uniform float uRows;
uniform float uColumns;
uniform float uOffset;


vec2 curveRemapUV(vec2 uv) {
    // as we near the edge of our screen apply greater distortion using a cubic function
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(15, 4);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    // Varyings
    vUv = uv;


}