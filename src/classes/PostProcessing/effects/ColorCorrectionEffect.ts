import { GUI } from 'lil-gui';
import { Color } from 'three';
import { ShaderPass } from 'three/examples/jsm/Addons.js';

import { SceneManager } from '../../SceneManager';
import { EffectBase } from './EffectBase';

/**
 * Available color correction presets
 */
type ColorCorrectionPreset = 'neutral' | 'warm' | 'cool' | 'sepia' | 'dramatic';

/**
 * Color Correction effect with tint capability
 * Allows adjusting brightness, contrast, saturation and applying color tint
 */
export class ColorCorrectionEffect extends EffectBase {
  private colorCorrectionPass: ShaderPass;

  private settings = {
    enabled: false,
    brightness: 0.0,
    contrast: 1.0,
    saturation: 1.0,
    tintColor: '#ffffff',
    tintIntensity: 0.0,
    preset: 'neutral' as ColorCorrectionPreset,
  };

  // List of available presets
  private presets = {
    neutral: 'neutral',
    warm: 'warm',
    cool: 'cool',
    sepia: 'sepia',
    dramatic: 'dramatic',
  };

  // Color correction shader
  private static ColorCorrectionShader = {
    uniforms: {
      tDiffuse: { value: null },
      brightness: { value: 0.0 },
      contrast: { value: 1.0 },
      saturation: { value: 1.0 },
      tintColor: { value: new Color(0xffffff) },
      tintIntensity: { value: 0.0 },
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
      uniform float brightness;
      uniform float contrast;
      uniform float saturation;
      uniform vec3 tintColor;
      uniform float tintIntensity;
      
      varying vec2 vUv;

      // Helper to convert RGB to luminance
      float getLuminance(vec3 color) {
        return dot(color, vec3(0.299, 0.587, 0.114));
      }

      void main() {
        // Get base color
        vec4 color = texture2D(tDiffuse, vUv);
        vec3 finalColor = color.rgb;
        
        // Apply brightness
        finalColor = finalColor + vec3(brightness);
        
        // Apply contrast
        finalColor = (finalColor - 0.5) * contrast + 0.5;
        
        // Apply saturation
        float luminance = getLuminance(finalColor);
        finalColor = mix(vec3(luminance), finalColor, saturation);
        
        // Apply tint
        finalColor = mix(finalColor, finalColor * tintColor, tintIntensity);
        
        // Output final color
        gl_FragColor = vec4(finalColor, color.a);
      }
    `,
  };

  constructor(sceneManager: SceneManager) {
    super(sceneManager.effectComposer, 'Color Correction');

    // Create shader pass with color correction shader
    this.colorCorrectionPass = new ShaderPass(ColorCorrectionEffect.ColorCorrectionShader);

    // Set initial values
    this.updateUniforms();
    this.colorCorrectionPass.enabled = this.settings.enabled;
  }

  /**
   * Updates shader uniforms from settings
   */
  private updateUniforms(): void {
    const uniforms = this.colorCorrectionPass.uniforms;

    uniforms.brightness.value = this.settings.brightness;
    uniforms.contrast.value = this.settings.contrast;
    uniforms.saturation.value = this.settings.saturation;
    uniforms.tintIntensity.value = this.settings.tintIntensity;

    uniforms.tintColor.value.set(this.settings.tintColor);
  }

  setup(): void {
    this.effectComposer.addPass(this.colorCorrectionPass);
  }

  createUI(folder: GUI): void {
    folder
      .add(this.settings, 'enabled')
      .name('Enable Color Correction')
      .onChange((value: boolean) => {
        this.colorCorrectionPass.enabled = value;
      });

    folder
      .add(this.settings, 'preset', this.presets)
      .name('Preset')
      .onChange((value: ColorCorrectionPreset) => {
        console.log('preset', value);
        this.applyPreset(value);

        // Update UI controllers to reflect new values
        folder.controllers.forEach(controller => {
          controller.updateDisplay();
        });
      });

    folder
      .add(this.settings, 'brightness', -0.3, 0.3, 0.00001)
      .name('Brightness')
      .onChange(() => {
        this.updateUniforms();
      });

    folder
      .add(this.settings, 'contrast', 0.7, 1.3, 0.00001)
      .name('Contrast')
      .onChange(() => {
        this.updateUniforms();
      });

    folder
      .add(this.settings, 'saturation', 0.0, 2.0, 0.01)
      .name('Saturation')
      .onChange(() => {
        this.updateUniforms();
      });

    // Color picker for tint
    folder
      .addColor(this.settings, 'tintColor')
      .name('Tint Color')
      .onChange(() => {
        this.updateUniforms();
      });

    folder
      .add(this.settings, 'tintIntensity', 0.0, 1.0, 0.01)
      .name('Tint Intensity')
      .onChange(() => {
        this.updateUniforms();
      });
  }

  /**
   * Apply a preset color grading
   */
  private applyPreset(preset: ColorCorrectionPreset): void {
    this.settings.preset = preset;

    switch (preset) {
      case 'warm':
        this.settings.tintColor = '#ffa726';
        this.settings.tintIntensity = 0.2;
        this.settings.saturation = 1.1;
        this.settings.brightness = 0.015;
        this.settings.contrast = 1.025;
        break;
      case 'cool':
        this.settings.tintColor = '#4fc3f7';
        this.settings.tintIntensity = 0.2;
        this.settings.saturation = 0.9;
        this.settings.brightness = -0.005;
        this.settings.contrast = 1.005;
        break;
      case 'sepia':
        this.settings.tintColor = '#d7cfa6';
        this.settings.tintIntensity = 0.4;
        this.settings.saturation = 0.6;
        this.settings.brightness = 0.01;
        this.settings.contrast = 1.02;
        break;
      case 'dramatic':
        this.settings.tintColor = '#4A5BA7';
        this.settings.tintIntensity = 0.4;
        this.settings.saturation = 0.8;
        this.settings.brightness = -0.007;
        this.settings.contrast = 1.02;
        break;
      case 'neutral':
      default:
        this.settings.brightness = 0.0;
        this.settings.contrast = 1.0;
        this.settings.saturation = 1.0;
        this.settings.tintColor = '#ffffff';
        this.settings.tintIntensity = 0.0;
        break;
    }

    this.updateUniforms();
  }
}
