uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform sampler2D uTexture4;
uniform sampler2D uTexture5;

uniform float uAspectRatio;
uniform float uTime;

varying vec2 vUv;

// MOSAIC ANIMATION

float normalizeValue(float value, float minVal, float maxVal) {
    return (value - minVal) / (maxVal - minVal);
}

vec3 placeImage(vec2 coord, vec2 imageSize, sampler2D uTexture) {

    float imageOnX = step(coord.x - imageSize.x * 0.5, vUv.x) - step(coord.x + imageSize.x * 0.5, vUv.x);
    float imageOnY = step(coord.y - imageSize.y * 0.5, vUv.y) - step(coord.y + imageSize.y * 0.5, vUv.y);

    float imageMapX = normalizeValue(vUv.x, coord.x - imageSize.x * 0.5, coord.x + imageSize.x * 0.5);
    float imageMapY = normalizeValue(vUv.y, coord.y - imageSize.y * 0.5, coord.y + imageSize.y * 0.5);

    vec2 mapValues = vec2(imageMapX, imageMapY);

    vec4 textureColor = texture2D(uTexture, mapValues);

    return textureColor.rgb * imageOnX * imageOnY;
}

vec3 animateImage(vec2 coordStart, vec2 coordEnd, vec2 imageSize, sampler2D uTexture, float timeVal) {

    float hideTexture = 1.0 - step(1.0, timeVal);

    timeVal = clamp(timeVal, 0.0, 1.0);

    vec2 currentCoord = mix(coordStart, coordEnd, timeVal);

    vec3 texture = placeImage(currentCoord, imageSize, uTexture);

    return texture * hideTexture;
}

vec3 placeImageWithScan(vec2 coord, vec2 imageSize, sampler2D uTexture, float shiftVal) {

    float imageOnX = step(coord.x - imageSize.x * 0.5, vUv.x) - step(coord.x + imageSize.x * 0.5, vUv.x);
    float imageOnY = step(coord.y - imageSize.y * 0.5, vUv.y) - step(coord.y + imageSize.y * 0.5, vUv.y);

    float imageMapX = normalizeValue(vUv.x, coord.x - imageSize.x * 0.5, coord.x + imageSize.x * 0.5);
    float imageMapY = normalizeValue(vUv.y, coord.y - imageSize.y * 0.5, coord.y + imageSize.y * 0.5);

    vec2 mapValues = vec2(imageMapX + shiftVal, imageMapY);

    vec4 textureColor = texture2D(uTexture, mapValues);

    return textureColor.rgb * imageOnX * imageOnY;
}

vec3 revealImage(vec2 coord, vec2 imageSize, sampler2D uTexture, float timeVal, float shiftVal) {
    float revealOn = step(1.0, timeVal);

    timeVal = clamp(0.0, 8.0, timeVal);

    return placeImageWithScan(coord, imageSize * (timeVal), uTexture, shiftVal) * revealOn;
}


// SCREEN GLITCH
vec3 generateGlitch(vec2 vUv, float uRows, float uTime, float gapTime, float glitchTime) {
    float tailTime = 7.0 - gapTime;
    float totalTime = gapTime + glitchTime + tailTime;
    float glitchHeight = (1.0 / uRows) * 15.0;
    float yPos = 1.0 - vUv.y;

    float remainderTime = mod(uTime, totalTime); // Returns value from 0.0 to totalTime, returns the time in the animation the time is at
    float glitchOn = step(gapTime, remainderTime) - step(gapTime + glitchTime, remainderTime); // Bool (0 or 1) if the animation is active
    float glitchRow = ((remainderTime - gapTime) / glitchTime) * glitchOn; // Gives what % (decimal) of the way through the glitchTime we are
    float glitchRowMatch = (step(glitchRow, yPos) - step(glitchRow + glitchHeight, yPos)) * exp(-5.0 * ((yPos - glitchRow)) / glitchHeight) * glitchOn; // Returns bool depending if this pixel is on the correct row
    float glitchIntensity = glitchRowMatch * 10.0 + 1.0;
    float glitchOffset = -glitchRowMatch * 0.05;

    vec3 glitch = vec3(glitchIntensity, glitchOffset, glitchOn);
    return glitch; // Return the computed glitch intensity and offset
}


void main() {

    // MOSAIC ANIMATION
    float timeVal = uTime / 1.5;

    vec2 coordEnd = vec2(0.5, 0.5);
    vec2 imageSize = vec2(0.5 * uAspectRatio, 0.5);

    vec3 texture1 = animateImage(vec2(0.25, 0.25), coordEnd, imageSize, uTexture1, timeVal);
    vec3 texture2 = animateImage(vec2(0.25, 0.75), coordEnd, imageSize, uTexture2, timeVal);
    vec3 texture3 = animateImage(vec2(0.75, 0.25), coordEnd, imageSize, uTexture3, timeVal);
    vec3 texture4 = animateImage(vec2(0.75, 0.75), coordEnd, imageSize, uTexture4, timeVal);

 

     // GLITCH
    float gapTime = 5.0; //Time between flicker
    float glitchTime = 2.0; //Time when flicker animation occurs

    vec3 glitch = generateGlitch(vUv, 50.0, uTime, gapTime, glitchTime);
    vec3 glitchTwo = generateGlitch(vUv, 50.0, uTime, gapTime + 1.0, glitchTime);

    float glitchIntensity = glitch.x + glitchTwo.x;
    float glitchOffset = glitch.y + glitchTwo.y;
    float glitchOn = step(0.5, glitch.z + glitchTwo.z);

    float wobbleShift = 0.003*sin(10.0*(10.0*uTime + 10.0*(1.0 - vUv.y)))*glitchOn;

    // scan lines
    float remainderY = mod(vUv.y*50.0, 1.0);
    float shiftX = (2.0*remainderY - 1.0);
    float intensity = cos(shiftX*1.57)*1.0 ;

    float shiftVal = glitchOffset + wobbleShift;
    vec3 texture5 = revealImage(coordEnd, imageSize, uTexture5, timeVal, shiftVal);

    vec3 finalImage = texture1 + texture2 + texture3 + texture4 + texture5;

    gl_FragColor = vec4(finalImage*intensity*glitchIntensity, 1.0);
}