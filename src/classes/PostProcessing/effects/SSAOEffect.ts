import { GUI } from 'lil-gui';
import { SSAOPass } from 'three/examples/jsm/Addons.js';

import { SceneManager } from '../../SceneManager';
import { EffectBase } from './EffectBase';

/**
 * Screen Space Ambient Occlusion effect that adds realistic shadowing to corners and crevices
 */
export class SSAOEffect extends EffectBase {
  private ssaoPass: SSAOPass;

  private settings = {
    enabled: false,
    radius: 8, // Size/radius of the sampling area
    minDistance: 0.001, // Min distance for occlusion
    maxDistance: 0.035, // Max distance for occlusion
    firstPassOnly: false, // Debug option to see only the SSAO pass
  };

  constructor(sceneManager: SceneManager) {
    super(sceneManager.effectComposer, 'SSAO Effect');

    const sizes = sceneManager.getSizes();

    // Create SSAO pass with scene and camera
    this.ssaoPass = new SSAOPass(
      sceneManager.scene,
      sceneManager.camera,
      sizes.width,
      sizes.height
    );

    // Set initial values
    this.ssaoPass.kernelRadius = this.settings.radius;
    this.ssaoPass.minDistance = this.settings.minDistance;
    this.ssaoPass.maxDistance = this.settings.maxDistance;

    // Setup output mode
    this.ssaoPass.output = SSAOPass.OUTPUT.Default;
    this.ssaoPass.enabled = this.settings.enabled;
  }

  setup(): void {
    this.effectComposer.addPass(this.ssaoPass);
  }

  createUI(folder: GUI): void {
    folder
      .add(this.settings, 'enabled')
      .name('Enable SSAO')
      .onChange((value: boolean) => {
        this.ssaoPass.enabled = value;
      });

    folder
      .add(this.settings, 'radius', 0.01, 32, 0.01)
      .name('Radius')
      .onChange((value: number) => {
        this.ssaoPass.kernelRadius = value;
      });

    folder
      .add(this.settings, 'minDistance', 0.001, 0.02, 0.0001)
      .name('Min Distance')
      .onChange((value: number) => {
        this.ssaoPass.minDistance = value;
      });

    folder
      .add(this.settings, 'maxDistance', 0.01, 0.3, 0.001)
      .name('Max Distance')
      .onChange((value: number) => {
        this.ssaoPass.maxDistance = value;
      });

    folder
      .add(this.settings, 'firstPassOnly')
      .name('SSAO Only (Debug)')
      .onChange((value: boolean) => {
        this.ssaoPass.output = value ? SSAOPass.OUTPUT.SSAO : SSAOPass.OUTPUT.Default;
      });
  }
}
