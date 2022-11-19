varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 uCameraPos;
uniform float uTime;

void main()
{
    float circle = step(0.6, 1.0 - distance(gl_PointCoord, vec2(0.5)));
    vec3 color = vec3(1.0, 0.5, 0.3) * circle * abs(vPosition.z) * 0.1 * abs(vPosition.x) * 0.1;
    vec3 m = mix(color, vec3(0.0), smoothstep(1., 100., gl_FragCoord.z / gl_FragCoord.w));
    m *= smoothstep(0.5, 0.9, 0.9 - distance(gl_PointCoord, vec2(.5)));
    float alpha = 1.0;
    
    float x = vPosition.x;
    float y = vPosition.y;
    float z = vPosition.z;

    float cx = -5.0;
    float cy = 0.0;
    float cz = 0.0;
    float d = pow(x - cx, 2.0) + pow(y - cy, 2.0) + pow(z - cz, 2.0);
    
    if (d < pow(15.0, 2.0)) {
        alpha = smoothstep(0.0, 1.0, d / pow(15.0, 2.0));
    }
    
    gl_FragColor = vec4(m, alpha * 0.2);
}