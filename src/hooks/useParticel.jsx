import { useEffect } from 'react';

import * as THREE from 'three'
import { AmbientLight, DirectionalLight } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import { MeshSurfaceSampler } from 'three/examples/jsm/Addons.js';

import monkeySrc from '/3d-models/monkey-head/scene.gltf?url'

import fragment from '../shaders/fragment.glsl'
import vertex from '../shaders/vertex.glsl'

const colors = [
    new THREE.Color('purple'),
    new THREE.Color('mediumpurple'),
    new THREE.Color('plum'),
]

const uniforms = {
    uTime: { value: 0 },
}

const createParticel = (sampler) => {
    const geometry = new THREE.BufferGeometry()
    const num = 25_000

    const positionArray = new Float32Array(num * 3)
    const colorArray = new Float32Array(num * 3)
    const offsetArray = new Float32Array(num )

    const pos = new THREE.Vector3()

    for (let i = 0; i < num; i++) {
        // position
        sampler.sample(pos)
        const { x, y, z } = pos
        positionArray.set([x, y, z], i * 3)
        // color
        const color = colors[Math.floor(Math.random() * colors.length)]
        const [ r, g, b ] = color
        colorArray.set([r, g, b], i * 3)
        // random for shaders
        offsetArray[i] = Math.random()
    }

    // attribute used by the shader
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
    geometry.setAttribute('offset', new THREE.BufferAttribute(offsetArray, 1))

    const material = new THREE.ShaderMaterial({
        uniforms, // pass the uniforms to the shader (time)
        fragmentShader: fragment,
        vertexShader: vertex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    })

    const particels = new THREE.Points(geometry, material)
    return particels
}

export const useParticel = () => {
    const scene = new THREE.Scene();

    useEffect(() => {
        /** Scene */
        const loader = new GLTFLoader()

        loader.load(monkeySrc, (gltf) => {
            // scene.add(gltf.scene)

            let model;
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    model = child
                }
            })

            model.geometry.scale(3, 3, 3)

            const sampler = new MeshSurfaceSampler(model).build()

            const particels = createParticel(sampler)
            scene.add(particels)
        })

        /** render sizes */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
        /** Camera */
        const fov = 60
        const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
        camera.position.set(4, 4, 4)
        camera.lookAt(new THREE.Vector3(0, 2.5, 0))

        /** renderer */
        const renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio < 2,
            logarithmicDepthBuffer: true,
            canvas: document.querySelector('canvas.webgl'),
        })
        handleResize()

        /** OrbitControls */
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        /** Lights */
        const ambientLight = new AmbientLight(0xffffff, 1.5)
        const directionalLight = new DirectionalLight(0xffffff, 4.5)
        directionalLight.position.set(3, 10, 7)
        scene.add(ambientLight, directionalLight)

        const clock = new THREE.Clock()
        function tic() {
            const time = clock.getElapsedTime()
            uniforms.uTime.value = time
            controls.update()
            renderer.render(scene, camera)
            requestAnimationFrame(tic)
        }

        requestAnimationFrame(tic)

        window.addEventListener('resize', handleResize)

        function handleResize() {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            renderer.setSize(sizes.width, sizes.height)

            const pixelRatio = Math.min(window.devicePixelRatio, 2)
            renderer.setPixelRatio(pixelRatio)
        }
    }, []);

}