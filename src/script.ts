import * as THREE from 'three';

import { LoadManager, SceneManager, SceneSetup, UIManager } from './classes';

const loadManager = new LoadManager();
const sceneManager = new SceneManager('.webgl');
const uiManager = new UIManager();

const sceneSetup = new SceneSetup(sceneManager, loadManager);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 'white' })
);
cube.position.set(0, 1, 0);
cube.castShadow = true;
cube.receiveShadow = true;
sceneManager.scene.add(cube);

uiManager.initSkyInterface(sceneSetup.getSkySystem());

sceneSetup.startAnimations();
