
import * as THREE from 'three';

import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

// 1. Crear la escena 3D
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x18212b);

// 2. Crear la camara del visitante
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 1.7, 7);

// 3. Crear el renderizador
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

// 4. Crear los controles en primera persona
const controls = new PointerLockControls(camera, document.body);

// 5. Crear los materiales de la habitacion
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x55504a
});

const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x77716a
});

const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x333943
});

// 6. Crear el piso
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    floorMaterial
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;

scene.add(floor);

// 7. Crear el techo
const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    ceilingMaterial
);

ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 6;

scene.add(ceiling);

// 8. Crear las paredes
function createWall(width, height, depth, x, y, z) {

    const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
    );

    const wall = new THREE.Mesh(
        geometry,
        wallMaterial
    );

    wall.position.set(x, y, z);

    scene.add(wall);
}

// Pared del fondo
createWall(20, 6, 0.3, 0, 3, -10);

// Pared izquierda
createWall(0.3, 6, 20, -10, 3, 0);

// Pared derecha
createWall(0.3, 6, 20, 10, 3, 0);

// Pared frontal
createWall(20, 6, 0.3, 0, 3, 10);

// 9. Agregar iluminacion
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.2
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

mainLight.position.set(0, 5, 5);

scene.add(mainLight);

// 10. Movimiento del visitante
const keys = {};

const speed = 5;

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// 11. Iniciar el recorrido
const startButton = document.getElementById('start-button');

const welcomeScreen = document.getElementById('welcome-screen');

startButton.addEventListener('click', () => {
    controls.lock();
});

// Ocultar bienvenida al entrar
controls.addEventListener('lock', () => {
    welcomeScreen.style.display = 'none';
});

// Mostrar bienvenida al salir
controls.addEventListener('unlock', () => {
    welcomeScreen.style.display = 'flex';
});

// 12. Animar el escenario
const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (controls.isLocked) {

        if (keys['KeyW']) {
            controls.moveForward(speed * delta);
        }

        if (keys['KeyS']) {
            controls.moveForward(-speed * delta);
        }

        if (keys['KeyA']) {
            controls.moveRight(-speed * delta);
        }

        if (keys['KeyD']) {
            controls.moveRight(speed * delta);
        }
    }

    renderer.render(scene, camera);
}

// 13. Adaptar el escenario al tamaño de la ventana
window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

animate();
