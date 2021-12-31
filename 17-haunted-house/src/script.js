import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog(0x262837, 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const brickColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const brickNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const brickAmbientOcclusionTexture = textureLoader.load(
    "/textures/bricks/ambientOcclusion.jpg"
);
const brickRoughnessTexture = textureLoader.load(
    "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
    "/textures/grass/ambientOcclusion.jpg"
);
const grassRoughnessTexture = textureLoader.load(
    "/textures/grass/roughness.jpg"
);
grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
);
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");

/**
 * House
 */
const house = new THREE.Group();

const wallHeight = 2.5;
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(5, wallHeight, 5),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        normalMap: brickNormalTexture,
        aoMap: brickAmbientOcclusionTexture,
        roughnessMap: brickRoughnessTexture,
    })
);
walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = wallHeight / 2;
house.add(walls);

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        normalMap: doorNormalTexture,
        aoMap: doorAmbientOcclusionTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        alphaMap: doorAlphaTexture,
        displacementMap: doorHeightTexture,
        transparent: true,
        displacementScale: 0.1,
    })
);
door.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.set(2.51, 1, 0);
door.rotation.y = Math.PI / 2;
house.add(door);

const roofHeight = 1;
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(4, roofHeight, 4),
    new THREE.MeshStandardMaterial({ color: "#b25f45" })
);
roof.position.y = wallHeight + roofHeight / 2 - 0.001;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 4.2);
bush1.scale.set(0.5, 0.5, 0.5);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.2, 4.2);
bush2.scale.set(0.25, 0.25, 0.25);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-2, 0.2, 4.7);
bush3.scale.set(0.3, 0.3, 0.3);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1.4, 0.2, 4.2);
bush4.scale.set(0.6, 0.6, 0.6);

house.add(bush1, bush2, bush3, bush4);

// Graves

const graves = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#8c8c8c" });

for (let i = 0; i < 50; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 6;
    grave.position.set(Math.sin(angle) * radius, 0.3, Math.cos(angle) * radius);
    grave.rotation.y = (Math.random() - 0.5) * 0.4 + Math.PI / 2;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    graves.add(grave);
}

scene.add(house, graves);

gui.add(door.position, "y").name("door y");
gui.add(door.position, "z", -2.5, 2.5).name("door z");
gui.add(door.position, "x", -2.5, 2.5).name("door x");
gui.add(door.rotation, "x", 0, 2 * Math.PI).name("door r z");
gui.add(door.rotation, "y", 0, 2 * Math.PI).name("door r y");
gui.add(door.rotation, "x", 0, 2 * Math.PI).name("door r x");

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        normalMap: grassNormalTexture,
        aoMap: grassAmbientOcclusionTexture,
        roughnessMap: grassRoughnessTexture,
    })
);
floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.5);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(3, 2.1, 0);
house.add(doorLight);

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
ghost1.position.set(5, 0.2, 5);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x262837);

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 10;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update ghosts
    // const angle = Math.random() * Math.PI * 2;
    ghost1.position.set(
        Math.sin(elapsedTime / 4) * (Math.sin(elapsedTime) + 7),
        Math.sin(elapsedTime / 4) * 0.5,
        Math.cos(elapsedTime / 4) * (Math.sin(elapsedTime / 2) + 7)
    );
    ghost2.position.set(
        Math.sin(elapsedTime / 2) * 5,
        Math.sin(elapsedTime / 2) * 0.4,
        Math.cos(elapsedTime / 2) * 5
    );
    ghost3.position.set(
        Math.sin(-elapsedTime / 4) * 6,
        Math.sin(elapsedTime / 4) + Math.sin(elapsedTime),
        Math.cos(-elapsedTime / 4) * 6
    );
    // ghost1.position.x += Math.sin(angle) * 0.1;
    // ghost1.position.z += Math.sin(angle) * 0.1;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
