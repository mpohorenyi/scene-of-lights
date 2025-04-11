import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/Addons.js';

/**
 * Handles rendering of sky and related lighting
 */
export class SkyRenderer {
  public readonly sky: Sky;
  public readonly sun: THREE.Vector3;
  public readonly ambientLight: THREE.AmbientLight;
  public readonly directionalLight: THREE.DirectionalLight;
  public readonly directionalLightHelper: THREE.DirectionalLightHelper;
  public readonly directionalLightCameraHelper: THREE.CameraHelper;

  private skyParameters = {
    turbidity: 0.7,
    rayleigh: 0.7,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.95,
    sunElevation: 0,
    sunAzimuth: 0,
  };

  /**
   * Creates a new sky renderer
   * @param scene Three.js scene to add sky and lights to
   */
  constructor(private scene: THREE.Scene) {
    // Setup sky
    this.sky = new Sky();
    this.sky.scale.setScalar(500);
    this.scene.add(this.sky);

    this.sun = new THREE.Vector3();

    // Setup sky material uniforms
    const uniforms = this.sky.material.uniforms;
    uniforms.turbidity.value = this.skyParameters.turbidity;
    uniforms.rayleigh.value = this.skyParameters.rayleigh;
    uniforms.mieCoefficient.value = this.skyParameters.mieCoefficient;
    uniforms.mieDirectionalG.value = this.skyParameters.mieDirectionalG;

    // Setup ambient light
    this.ambientLight = new THREE.AmbientLight('#fff9e1', 0.5);
    this.scene.add(this.ambientLight);

    // Setup directional light
    this.directionalLight = new THREE.DirectionalLight('#fff9e1', 1.5);
    this.directionalLight.position.set(-3, 3, -3);
    this.directionalLight.castShadow = true;

    // Configure shadow properties
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.camera.near = 3;
    this.directionalLight.shadow.camera.far = 30;
    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.bottom = -10;

    this.directionalLight.shadow.radius = 4;
    this.directionalLight.shadow.bias = -0.0005;

    this.scene.add(this.directionalLight);

    // Setup helpers
    this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 1);
    this.directionalLightHelper.visible = false;
    this.scene.add(this.directionalLightHelper);

    this.directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
    this.directionalLightCameraHelper.visible = false;
    this.scene.add(this.directionalLightCameraHelper);

    // Initial sun position
    this.updateSunPosition(this.skyParameters.sunElevation, this.skyParameters.sunAzimuth);
  }

  /**
   * Get the current sun elevation
   * @returns Current sun elevation in degrees
   */
  public getSunElevation(): number {
    return this.skyParameters.sunElevation;
  }

  /**
   * Updates the sun position and lighting based on elevation and azimuth
   * @param elevation Sun elevation in degrees (0 = zenith, 90 = horizon, >90 = below horizon)
   * @param azimuth Sun azimuth in degrees (0 = north, 90 = east, 180 = south, 270 = west)
   */
  public updateSunPosition(elevation: number, azimuth: number): void {
    this.skyParameters.sunElevation = elevation;
    this.skyParameters.sunAzimuth = azimuth;

    const phi = THREE.MathUtils.degToRad(elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);
    this.sky.material.uniforms.sunPosition.value.copy(this.sun);

    this.syncLightWithSun();
    this.calculateLightParameters();
  }

  /**
   * Sets visibility of light helpers
   * @param visible Whether the helpers should be visible
   */
  public setHelpersVisibility(visible: boolean): void {
    this.directionalLightHelper.visible = visible;
    this.directionalLightCameraHelper.visible = visible;
  }

  /**
   * Updates position of directional light to match sun direction
   */
  private syncLightWithSun(): void {
    const sunDirection = this.sun.clone().normalize();
    const lightDistance = 15;
    const lightPosition = sunDirection.multiplyScalar(lightDistance);

    this.directionalLight.position.copy(lightPosition);

    if (this.directionalLightHelper.visible) {
      this.directionalLightHelper.update();
    }
  }

  /**
   * Calculates and applies light intensity and color parameters based on sun position
   */
  private calculateLightParameters(): void {
    // Direct light from the sun (only when sun is above horizon)
    let directFactor = 0;
    if (this.skyParameters.sunElevation < 90) {
      // Linear falloff from zenith (1) to horizon (0)
      directFactor = 1 - this.skyParameters.sunElevation / 90;
    }

    // Ambient light (includes twilight when sun is slightly below horizon)
    let ambientFactor = 0;

    // Simplify ambient light calculation with a continuous piecewise function
    if (this.skyParameters.sunElevation <= 90) {
      // Day: Linear falloff from zenith to horizon, scaled appropriately
      // At zenith (0°): 1.0, at horizon (90°): 0.3
      ambientFactor = 0.3 + 0.7 * (1 - this.skyParameters.sunElevation / 90);
    } else if (this.skyParameters.sunElevation <= 100) {
      // Twilight: Gradual decrease from horizon (90°) to end of twilight (100°)
      // At horizon (90°): 0.3, at end of twilight (100°): 0.05
      const twilightProgress = (this.skyParameters.sunElevation - 90) / 10;
      ambientFactor = 0.3 - (0.3 - 0.05) * twilightProgress;
    } else {
      // Night: Constant minimal illumination
      ambientFactor = 0.07;
    }

    // Set light intensities
    const maxDirectIntensity = 1.5;
    const directionalIntensity = directFactor * maxDirectIntensity;

    const maxAmbientIntensity = 0.4;
    const ambientIntensity = ambientFactor * maxAmbientIntensity;

    // Apply light intensities
    this.directionalLight.intensity = directionalIntensity;
    this.ambientLight.intensity = ambientIntensity;

    // Calculate and apply light color
    if (this.skyParameters.sunElevation > 70 && this.skyParameters.sunElevation < 110) {
      // Stronger effect at 90 degrees (horizon)
      const distFromHorizon = Math.abs(90 - this.skyParameters.sunElevation);
      const colorIntensity = 1 - distFromHorizon / 20;

      // Warmer colors at sunrise/sunset
      const r = 1.0;
      const g = 0.5 + 0.5 * (1 - colorIntensity);
      const b = 0.3 + 0.7 * (1 - colorIntensity);

      this.directionalLight.color.setRGB(r, g, b);
    } else {
      // Regular white daylight
      this.directionalLight.color.setRGB(1, 1, 1);
    }

    // Update helpers if visible
    if (this.directionalLightHelper.visible) {
      this.directionalLightHelper.update();
    }
  }
}
