import { LoadManager, PostProcessingManager, SceneManager, SceneSetup, UIManager } from './classes';

const loadManager = new LoadManager();
const sceneManager = new SceneManager('.webgl');
const uiManager = new UIManager();

const sceneSetup = new SceneSetup(sceneManager, loadManager);

const postProcessingManager = new PostProcessingManager(sceneManager);

uiManager.initControls(sceneManager);
uiManager.initSkyInterface(sceneSetup.getSkySystem());
uiManager.initPostProcessingInterface(postProcessingManager);

sceneSetup.startAnimations();
