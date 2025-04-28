import { GUI } from 'lil-gui';

import { GammaCorrectionShader, ShaderPass } from 'three/examples/jsm/Addons.js';
import { SceneManager } from '../SceneManager';
import {
  BloomEffect,
  ColorCorrectionEffect,
  DepthOfFieldEffect,
  EffectBase,
  GlitchEffect,
  SSAOEffect,
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
    // Initializing the SSAO effect
    const ssaoEffect = new SSAOEffect(this.sceneManager);
    ssaoEffect.setup();
    this.effects.push(ssaoEffect);

    // Initializing the Color Correction effect
    const colorCorrectionEffect = new ColorCorrectionEffect(this.sceneManager);
    colorCorrectionEffect.setup();
    this.effects.push(colorCorrectionEffect);

    // Initializing the Bloom effect
    const bloomEffect = new BloomEffect(this.sceneManager);
    bloomEffect.setup();
    this.effects.push(bloomEffect);

    // Initializing the Vignette effect
    const vignetteEffect = new VignetteEffect(this.sceneManager);
    vignetteEffect.setup();
    this.effects.push(vignetteEffect);

    // Initializing the Depth of Field effect
    const depthOfFieldEffect = new DepthOfFieldEffect(this.sceneManager);
    depthOfFieldEffect.setup();
    this.effects.push(depthOfFieldEffect);

    // Initializing the Glitch effect
    const glitchEffect = new GlitchEffect(this.sceneManager);
    glitchEffect.setup();
    this.effects.push(glitchEffect);

    // Initializing the Gamma Correction effect (should always be last)
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
