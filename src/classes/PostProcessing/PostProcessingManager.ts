import { GUI } from 'lil-gui';

import { GammaCorrectionShader, ShaderPass } from 'three/examples/jsm/Addons.js';
import { SceneManager } from '../SceneManager';
import {
  BloomEffect,
  DepthOfFieldEffect,
  EffectBase,
  GlitchEffect,
  VignetteEffect,
} from './effects';

export class PostProcessingManager {
  private sceneManager: SceneManager;
  private effects: EffectBase[] = [];

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;

    this.initEffects();
  }

  private initEffects(): void {
    // Initializing the Bloom effect
    const bloomEffect = new BloomEffect(this.sceneManager);
    bloomEffect.setup();
    this.effects.push(bloomEffect);

    // Initializing the Glitch effect
    const glitchEffect = new GlitchEffect(this.sceneManager);
    glitchEffect.setup();
    this.effects.push(glitchEffect);

    // Initializing the Vignette effect
    const vignetteEffect = new VignetteEffect(this.sceneManager);
    vignetteEffect.setup();
    this.effects.push(vignetteEffect);

    // Initializing the Depth of Field effect
    const depthOfFieldEffect = new DepthOfFieldEffect(this.sceneManager);
    depthOfFieldEffect.setup();
    this.effects.push(depthOfFieldEffect);

    // Initializing the Gamma Correction effect
    const gammaCorrectionEffect = new ShaderPass(GammaCorrectionShader);
    this.sceneManager.effectComposer.addPass(gammaCorrectionEffect);
  }

  public setupUI(folder: GUI): void {
    const postProcessingFolder = folder.addFolder('Post Processing Effects');

    this.effects.forEach(effect => {
      const effectFolder = postProcessingFolder.addFolder(effect.getName());
      effect.createUI(effectFolder);
    });
  }
}
