import { GUI } from 'lil-gui';
import { ShaderPass } from 'three/examples/jsm/Addons.js';

import { SceneManager } from '../../SceneManager';
import { EffectBase } from './EffectBase';

/**
 * Vignette effect that darkens the edges of the screen
 */
export class VignetteEffect extends EffectBase {
  private vignettePass: ShaderPass;

  private settings = {
    enabled: false,
    offset: 1.15, // Controls how far the vignette extends (0-1.5)
    darkness: 0.5, // Controls the intensity of the darkening (0-1)
  };

  // Vignette shader definition
  private static VignetteShader = {
    uniforms: {
      tDiffuse: { value: null },
      offset: { value: 1.0 },
      darkness: { value: 1.0 },
    },

    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform float offset;
      uniform float darkness;
      varying vec2 vUv;

      void main() {
        // Calculate distance from center (0.5, 0.5)
        vec2 uv = (vUv - 0.5) * 2.0;
        float dist = length(uv);

        // Apply vignette effect
        float vignette = smoothstep(offset, offset - 0.25, dist);
        vignette = clamp(vignette, 0.0, 1.0);

        // Get original color
        vec4 color = texture2D(tDiffuse, vUv);

        // Apply darkness
        color.rgb *= mix(1.0 - darkness, 1.0, vignette);
        
        gl_FragColor = color;
      }
    `,
  };

  constructor(sceneManager: SceneManager) {
    super(sceneManager.effectComposer, 'Vignette Effect');

    // Create shader pass with the vignette shader
    this.vignettePass = new ShaderPass(VignetteEffect.VignetteShader);
    this.vignettePass.enabled = this.settings.enabled;

    // Set initial values
    this.vignettePass.uniforms['offset'].value = this.settings.offset;
    this.vignettePass.uniforms['darkness'].value = this.settings.darkness;
  }

  setup(): void {
    this.effectComposer.addPass(this.vignettePass);
  }

  createUI(folder: GUI): void {
    folder
      .add(this.settings, 'enabled')
      .name('Enable Vignette')
      .onChange((value: boolean) => {
        this.vignettePass.enabled = value;
      });

    folder
      .add(this.settings, 'offset', 0, 1.5, 0.01)
      .name('Extent')
      .onChange((value: number) => {
        this.vignettePass.uniforms['offset'].value = value;
      });

    folder
      .add(this.settings, 'darkness', 0, 2, 0.01)
      .name('Intensity')
      .onChange((value: number) => {
        this.vignettePass.uniforms['darkness'].value = value;
      });
  }
}
