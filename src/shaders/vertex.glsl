attribute vec3 color;
// passo il colore al fragment shader
varying vec3 vColor;

void main() {
    vColor = color;

    // calcolo la distanza della camera e la particella
    // posizione della particella recuperato da modelMatrix
    vec3 workPosition = vec4( modelMatrix * vec4( position, 1.0 ) ).xyz;
    // distanza
    float dist = distance(cameraPosition, workPosition);
    // calcolo la dimensione del punto
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 20. * smoothstep(30., 0., dist);

    
}