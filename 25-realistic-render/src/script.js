import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("models/hamburger.glb", (gltf) => {
    console.log(gltf.scene);
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    gltf.scene.position.set(0, -1, 0);
    // gltf.scene.rotation.y = Math.PI / 2;
    scene.add(gltf.scene);

    // gui.add(gltf.scene.rotation, "y", -Math.PI, Math.PI)
    //     .step(0.01)
    //     .name("rotation");

    updateAllMaterials();
});
// gltfLoader.load("models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//     console.log(gltf.scene);
//     gltf.scene.scale.set(10, 10, 10);
//     gltf.scene.position.set(0, -4, 0);
//     gltf.scene.rotation.y = Math.PI / 2;
//     scene.add(gltf.scene);

//     gui.add(gltf.scene.rotation, "y", -Math.PI, Math.PI)
//         .step(0.01)
//         .name("rotation");

//     updateAllMaterials();
//     // scene.add(...gltf.scene.children);
// });

const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const debugObject = {
    envMapIntensity: 3,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            // child.material.envMap = envMap;
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

/**
 * Environment map
 */

const envMap = cubeTextureLoader.load([
    "textures/environmentMaps/3/px.jpg",
    "textures/environmentMaps/3/nx.jpg",
    "textures/environmentMaps/3/py.jpg",
    "textures/environmentMaps/3/ny.jpg",
    "textures/environmentMaps/3/pz.jpg",
    "textures/environmentMaps/3/nz.jpg",
]);
envMap.encoding = THREE.sRGBEncoding;
scene.background = envMap;
scene.environment = envMap;

gui.add(debugObject, "envMapIntensity", 0, 10).onChange(updateAllMaterials);

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-3.8, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.03;
scene.add(directionalLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(
//     directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper);

gui.add(directionalLight, "intensity", 0, 10)
    .step(0.001)
    .name("Light Intensity");
gui.add(directionalLight.position, "x", -5, 5).step(0.1).name("LightX");
gui.add(directionalLight.position, "y", -5, 5).step(0.1).name("LightY");
gui.add(directionalLight.position, "z", -5, 5).step(0.1).name("LightZ");

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.72;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, "toneMapping", {
    "ACES Filmic": THREE.ACESFilmicToneMapping,
    Cineon: THREE.CineonToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
}).onFinishChange(updateAllMaterials);

gui.add(renderer, "toneMappingExposure", 0, 5).onChange(updateAllMaterials);

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
