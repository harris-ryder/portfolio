// This is a basic fragment shader template
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uAspectRatio;

uniform float uTime;


varying vec2 vUv;


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

vec3 animateImage(vec2 coordStart, vec2 imageSize, sampler2D uTexture, float timeVal) {

    float deltaY = coordStart.y + timeVal;
    //timeVal = mod(deltaY, 1.2); // Reset timeVal to cycle between 0.0 and 1.0
    
    //float hideTexture = 1.0 - step(1.0, timeVal);

    deltaY = mod(deltaY, 1.2);


    vec2 currentCoord = vec2(coordStart.x, deltaY);

    vec3 texture = placeImage(currentCoord, imageSize, uTexture);

    return texture;
}


void main() {


    // IMAGES & POSITIONS
    vec2 blueImageSize= vec2(0.1*uAspectRatio*(560.0/84.0), 0.1);
    vec2 blueStartPosition = vec2(0.65,0.0);


    vec2 grayImageSize = vec2(0.1*uAspectRatio*(376.0/84.0), 0.1);
    vec2 grayStartPosition = vec2(0.25,0.15);


    // Time
    float timeVal = uTime*(uTime*0.2);

   
   vec3 blueImage1 = animateImage(blueStartPosition,blueImageSize, uTexture1, timeVal );
   vec3 grayImage1 =  animateImage(grayStartPosition,grayImageSize, uTexture2, timeVal );

   vec3 blueImage2 = animateImage(vec2(blueStartPosition.x, blueStartPosition.y - 0.3),blueImageSize, uTexture1, timeVal );
   vec3 grayImage2 =  animateImage(vec2(grayStartPosition.x, grayStartPosition.y - 0.3),grayImageSize, uTexture2, timeVal );

   vec3 blueImage3 = animateImage(vec2(blueStartPosition.x, blueStartPosition.y - 0.6),blueImageSize, uTexture1, timeVal );
   vec3 grayImage3 =  animateImage(vec2(grayStartPosition.x, grayStartPosition.y - 0.6),grayImageSize, uTexture2, timeVal );

   vec3 blueImage4 = animateImage(vec2(blueStartPosition.x, blueStartPosition.y - 0.9),blueImageSize, uTexture1, timeVal );
   vec3 grayImage4 =  animateImage(vec2(grayStartPosition.x, grayStartPosition.y - 0.9),grayImageSize, uTexture2, timeVal );

    vec3 finalTexture = blueImage1 + blueImage2 + blueImage3 + blueImage4 + grayImage1 + grayImage2 + grayImage3 + grayImage4;

    gl_FragColor = vec4(finalTexture, 1.0);
}