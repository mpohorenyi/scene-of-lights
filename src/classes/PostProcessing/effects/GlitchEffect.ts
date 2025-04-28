import { GUI } from 'lil-gui';
import { GlitchPass } from 'three/examples/jsm/Addons.js';

import { SceneManager } from '../../SceneManager';
import { EffectBase } from './EffectBase';

export class GlitchEffect extends EffectBase {
  private glitchPass: GlitchPass;

  private settings = {
    enabled: false,
  };

  constructor(sceneManager: SceneManager) {
    super(sceneManager.effectComposer, 'Glitch Effect');

    this.glitchPass = new GlitchPass();
    this.glitchPass.enabled = this.settings.enabled;
  }

  setup(): void {
    this.effectComposer.addPass(this.glitchPass);
  }

  createUI(folder: GUI): void {
    folder
      .add(this.settings, 'enabled')
      .name('Enable Glitch')
      .onChange((value: boolean) => {
        this.glitchPass.enabled = value;
      });
  }
}
