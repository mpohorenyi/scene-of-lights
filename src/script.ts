import { LoadManager, SceneManager, SceneSetup, UIManager } from './classes';

const loadManager = new LoadManager();
const sceneManager = new SceneManager('.webgl');
const uiManager = new UIManager();

const sceneSetup = new SceneSetup(sceneManager, loadManager);

uiManager.initControls(sceneManager);
uiManager.initSkyInterface(sceneSetup.getSkySystem());

sceneSetup.startAnimations();
