import * as THREE from "three";
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'orbitControls';

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0)

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#b1b1b1')
document.body.appendChild(renderer.domElement);

export const loader = new GLTFLoader();

export const BLUE = new THREE.MeshBasicMaterial({ color: "#428af5" });
export const RED = new THREE.MeshBasicMaterial({ color: "#f54242" });
export const YELLOW = new THREE.MeshBasicMaterial({ color: "#f5dd42" });
export const ORANGE = new THREE.MeshBasicMaterial({ color: "#ed790c" });
export const WHITE = new THREE.MeshBasicMaterial({ color: "#ffffff" });
export const GREEN = new THREE.MeshBasicMaterial({ color: "#95e677" });
export const BLACK = new THREE.MeshBasicMaterial({ color: "#000000" });