import { GUI } from 'lil-gui';
import { BokehPass } from 'three/examples/jsm/Addons.js';

import { SceneManager } from '../../SceneManager';
import { EffectBase } from './EffectBase';

/**
 * Depth of Field effect that creates camera focus
 */
export class DepthOfFieldEffect extends EffectBase {
  private bokehPass: BokehPass;

  private settings = {
    enabled: false,
    focus: 3.25, // Focus distance
    aperture: 0.002, // Camera aperture (smaller = more blur)
    maxBlur: 0.015, // Maximum blur strength
  };

  constructor(sceneManager: SceneManager) {
    super(sceneManager.effectComposer, 'Depth of Field');

    // Create bokeh pass with scene and camera
    this.bokehPass = new BokehPass(sceneManager.scene, sceneManager.camera, {
      focus: this.settings.focus,
      aperture: this.settings.aperture,
      maxblur: this.settings.maxBlur,
    });

    // Set initial enabled state
    this.bokehPass.enabled = this.settings.enabled;
  }

  setup(): void {
    this.effectComposer.addPass(this.bokehPass);
  }

  createUI(folder: GUI): void {
    folder
      .add(this.settings, 'enabled')
      .name('Enable DoF')
      .onChange((value: boolean) => {
        this.bokehPass.enabled = value;
      });

    folder
      .add(this.settings, 'focus', 0, 50, 0.01)
      .name('Focus Distance')
      .onChange((value: number) => {
        const uniforms = this.bokehPass.uniforms as any;
        if (uniforms && uniforms.focus) {
          uniforms.focus.value = value;
        }
      });

    folder
      .add(this.settings, 'aperture', 0.0001, 0.1, 0.0001)
      .name('Aperture')
      .onChange((value: number) => {
        const uniforms = this.bokehPass.uniforms as any;
        if (uniforms && uniforms.aperture) {
          uniforms.aperture.value = value;
        }
      });

    folder
      .add(this.settings, 'maxBlur', 0, 0.1, 0.001)
      .name('Max Blur')
      .onChange((value: number) => {
        const uniforms = this.bokehPass.uniforms as any;
        if (uniforms && uniforms.maxblur) {
          uniforms.maxblur.value = value;
        }
      });
  }
}
