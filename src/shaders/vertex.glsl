attribute vec3 color;
attribute float offset;
// passo il colore al fragment shader
varying vec3 vColor;
uniform float uTime;
varying float vDistance;


void main() {
    vColor = color;
    vec3 pos = position;
    pos.y += sin(uTime * 0.5 * (offset - 0.5) + offset * 10.) * 0.15;
    pos.x += cos(uTime * 0.5 * (offset - 0.5) + offset * 10.) * 0.15;
    // calcolo la distanza della camera e la particella
    // posizione della particella recuperato da modelMatrix
    vec3 workPosition = vec4( modelMatrix * vec4( pos, 1.0 ) ).xyz;
    // distanza
    float dist = distance(cameraPosition, workPosition);

    vDistance = smoothstep(15., 0., dist);

    // calcolo la dimensione del punto
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    // gli ultimi due numeri permettono di condizionare la dimensione della particella così da non farla ridurre al minimo
    // se la distanza è maggiore di 30 allora verrà applicata la smoothstep
    gl_PointSize = 20. * vDistance * (sin(uTime * 2. + offset * 10.) * 0.3 + 0.7 );
}