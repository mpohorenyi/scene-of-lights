import { GUI } from 'lil-gui';
import { Vector2 } from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';

import { SceneManager } from '../../SceneManager';
import { EffectBase } from './EffectBase';

export class BloomEffect extends EffectBase {
  private bloomPass: UnrealBloomPass;

  private settings = {
    enabled: false,
    strength: 0.15,
    radius: 0.35,
    threshold: 0.75,
  };

  constructor(sceneManager: SceneManager) {
    super(sceneManager.effectComposer, 'Bloom Effect');

    const sizes = sceneManager.getSizes();

    const resolution = new Vector2(sizes.width, sizes.height);
    this.bloomPass = new UnrealBloomPass(
      resolution,
      this.settings.strength,
      this.settings.radius,
      this.settings.threshold
    );

    this.bloomPass.enabled = this.settings.enabled;
  }

  setup(): void {
    this.effectComposer.addPass(this.bloomPass);
  }

  createUI(folder: GUI): void {
    folder
      .add(this.settings, 'enabled')
      .name('Enable Bloom')
      .onChange((value: boolean) => (this.bloomPass.enabled = value));

    folder
      .add(this.settings, 'strength', 0, 3, 0.01)
      .name('Strength')
      .onChange((value: number) => (this.bloomPass.strength = value));

    folder
      .add(this.settings, 'radius', 0, 1, 0.01)
      .name('Radius')
      .onChange((value: number) => (this.bloomPass.radius = value));

    folder
      .add(this.settings, 'threshold', 0, 1, 0.01)
      .name('Threshold')
      .onChange((value: number) => (this.bloomPass.threshold = value));
  }
}
