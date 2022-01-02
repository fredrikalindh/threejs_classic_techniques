import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
    materialColor: "#ff058a",
};

gui.addColor(parameters, "materialColor").onChange(() => {
    material.color.set(parameters.materialColor);
    particleMaterial.color.set(parameters.materialColor);
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
// const material = new THREE.MeshNormalMaterial();

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
});

const objectDistance = 4;
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);
mesh1.position.set(2, 0, 0);
mesh2.position.set(-2, -objectDistance, 0);
mesh3.position.set(2, -objectDistance * 2, 0);

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];
/**
 * Particles
 */
const particlesCount = 200;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    if (i % 3 === 1)
        positions[i] =
            -Math.random() * objectDistance * sectionMeshes.length + 2;
    else positions[i] = (Math.random() - 0.5) * 5;
}
particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    size: 0.05,
    sizeAttenuation: true,
});
const particlesMesh = new THREE.Points(particles, particleMaterial);
scene.add(particlesMesh);

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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

// Group

const cameragroup = new THREE.Group();

// Base camera
const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.z = 6;
cameragroup.add(camera);
scene.add(cameragroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    const section = Math.round(scrollY / sizes.height);
    if (section !== currentSection) {
        currentSection = section;

        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: "power2.inOut",
            x: "+=3",
            y: "+=3",
            z: "-=1.5",
        });
    }
});

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0,
};
window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height) + 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animate camera
    // const diff = -(scrollY / sizes.height) * objectDistance - camera.position.y;
    // camera.position.y += (diff / 10) * deltaTime * 50;
    camera.position.y = -(scrollY / sizes.height) * objectDistance;

    const parallaxX = cursor.x;
    const parallaxY = cursor.y;
    cameragroup.position.x +=
        ((parallaxX - cameragroup.position.x) / 10) * deltaTime * 30;
    cameragroup.position.y +=
        ((parallaxY - cameragroup.position.y) / 10) * deltaTime * 30;
    // cameragroup.position.z += (parallaxX - cameragroup.position.z) / 10;

    // Animate objects
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
