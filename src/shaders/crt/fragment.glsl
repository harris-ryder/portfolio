varying vec2 vUv;
uniform sampler2D uPictureTexture;

uniform float uTime;



void main() {

    float timeVal = clamp(0.0, 10.0, uTime);

    float columns = 5.0*timeVal;
    float rows = 5.0*timeVal;
    float barHeight = 0.5;
    float barWidthGap = 0.1;
    float barWidth = 0.2;
    float threshold = 1.0;
    float brightness = 10.0;

    // Cycles through 0.0 - 1.0 uColumns number of times (e.g. uColumns = 30.0 then we have 30 columns)
    float remainderX = mod(vUv.x * columns, 1.0);
    // Cycles through 0.0 - 1.0 uColumns/2 number of times (e.g. uColumns = 30.0 then we have 15 columns, why? So that for every other column, we can add a offset)
    float remainder2X = mod(vUv.x * columns * 0.5, 1.0);
    // Cycles through 0.0 - 1.0 uRows number of times, so we can set the number of light rows (e.g. uRows = 30.0 then 30 lights fit vertically)
    float remainderY = mod((vUv.y + step(0.5, remainder2X) * 1.0/rows * 0.5) * rows, 1.0);
    //+ step(0.5, remainder2X) * 0.05 <- Add back above for offset

    //Either 0.0 or 1.0 (Binary) - Sets light color to 0.0 if we are on a gap (dark part of the screen were there are no pixels/lights)
    //uBarHeight sets the % height the lights take up (e.g. uBarHeight = 0.5 then 50% of each row is light and 50% is dark space)
    float verticalLEDHeight = barHeight; // % thats LED
    float verticalLEDGap = (1.0 - verticalLEDHeight)/2.0; // % gap above and bellow LED
    float verticalLightSwitch = step(verticalLEDGap, remainderY) - step(verticalLEDGap + verticalLEDHeight, remainderY);

    // Calculates the width of the light bars   
    float XMargin = (1.0 - (3.0 * barWidth + 2.0 * barWidthGap))/2.0;

    //Calculates if the location on the plane would contain red,green or blue pixel or no pixel at all, returns either 0.0 or 1.0 (Binary)
    float redOn = (step(XMargin, remainderX) - step(XMargin + barWidth, remainderX))*verticalLightSwitch;
    float greenOn = (step(XMargin + barWidth + barWidthGap, remainderX) - step(XMargin + 2.0 * barWidth + barWidthGap, remainderX))*verticalLightSwitch;
    float blueOn = (step(XMargin + 2.0 * barWidth + 2.0 * barWidthGap, remainderX) - step(XMargin + 3.0 * barWidth + 2.0 * barWidthGap, remainderX))*verticalLightSwitch;


    float ledWidth = 1.0/columns;
    float ledHeight = (1.0/rows);

    //TextureColor has the rgb values of the original image texture
    vec2 averagevUv = vec2(vUv.x + (0.5 - remainderX)*ledWidth, vUv.y + (0.5 - remainderY)*(ledHeight));
    vec4 textureColor = texture2D(uPictureTexture, averagevUv);
   
    // In the case the light bar isn't on allow some faint color 
    vec4 offHue = vec4(0.008);
    vec4 intensity = step(threshold, textureColor*brightness)*textureColor*brightness + offHue;

    gl_FragColor = vec4(redOn*intensity.r, greenOn*intensity.g, blueOn*intensity.b, 1.0);

}