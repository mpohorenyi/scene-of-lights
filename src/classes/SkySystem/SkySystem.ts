import * as THREE from 'three';
import { Timer } from 'three/examples/jsm/Addons.js';

import { SkyRenderer } from './SkyRenderer';
import { SunAstronomyCalculator } from './SunAstronomyCalculator';
import { SunPathVisualizer } from './SunPathVisualizer';

/**
 * Main system for sky, sun, and related lighting in a 3D scene
 * Provides realistic day/night cycle and sun movement
 */
export class SkySystem {
  private readonly astronomyCalculator: SunAstronomyCalculator;
  private readonly skyRenderer: SkyRenderer;
  private readonly sunPathVisualizer: SunPathVisualizer;

  private dayTime: number = 9;
  private animateSun: boolean = false;
  private animationSpeed: number = 8; // Minutes of virtual time per second of real time

  private timeDisplayCallback?: (timeString: string) => void;

  /**
   * Creates a new sky system
   * @param scene Three.js scene to add elements to
   * @param timer Timer for animation and time calculations
   */
  constructor(
    scene: THREE.Scene,
    private timer: Timer
  ) {
    this.astronomyCalculator = new SunAstronomyCalculator();
    this.skyRenderer = new SkyRenderer(scene);
    this.sunPathVisualizer = new SunPathVisualizer(scene, this.astronomyCalculator);

    this.updateSunPosition();
  }

  /**
   * Gets the current time of day
   * @returns Time in decimal hours (0-24)
   */
  public getDayTime(): number {
    return this.dayTime;
  }

  /**
   * Gets the current latitude
   * @returns Latitude in degrees
   */
  public getLatitude(): number {
    return this.astronomyCalculator.getLatitude();
  }

  /**
   * Gets the current day of year
   * @returns Day of year (1-365)
   */
  public getDayOfYear(): number {
    return this.astronomyCalculator.getDayOfYear();
  }

  /**
   * Sets the time of day
   * @param time Time in decimal hours (0-24)
   */
  public setDayTime(time: number): void {
    this.dayTime = time % 24;
    this.updateSunPosition();
    this.notifyTimeChange();
  }

  /**
   * Sets the geographic latitude
   * @param latitude Latitude in degrees (restricted to -80 to 80)
   */
  public setLatitude(latitude: number): void {
    this.astronomyCalculator.setLatitude(latitude);
    this.updateSunPosition();

    if (this.sunPathVisualizer.isVisible()) {
      this.sunPathVisualizer.updateSunPath();
    }
  }

  /**
   * Sets the day of year
   * @param day Day of year (1-365)
   */
  public setDayOfYear(day: number): void {
    this.astronomyCalculator.setDayOfYear(day);
    this.updateSunPosition();

    if (this.sunPathVisualizer.isVisible()) {
      this.sunPathVisualizer.updateSunPath();
    }
  }

  /**
   * Sets visibility of light helpers
   * @param visible Whether helpers should be visible
   */
  public setHelpersVisibility(visible: boolean): void {
    this.skyRenderer.setHelpersVisibility(visible);
  }

  /**
   * Sets visibility of sun path visualization
   * @param visible Whether sun path should be visible
   */
  public setSunPathVisibility(visible: boolean): void {
    if (visible && !this.sunPathVisualizer.isVisible()) {
      this.sunPathVisualizer.updateSunPath();
    }

    this.sunPathVisualizer.setVisible(visible);
  }

  /**
   * Enables/disables automatic sun animation
   * @param enable Whether animation should be enabled
   */
  public setAnimationEnabled(enable: boolean): void {
    this.animateSun = enable;
  }

  /**
   * Sets the sun animation speed
   * @param speed Minutes of virtual time per second of real time
   */
  public setAnimationSpeed(speed: number): void {
    this.animationSpeed = speed;
  }

  /**
   * Sets callback for time display updates
   * @param callback Function to call with formatted time string
   */
  public setTimeDisplayCallback(callback: (timeString: string) => void): void {
    this.timeDisplayCallback = callback;
  }

  /**
   * Gets formatted string with sunrise, sunset times and day length
   * @returns String with day information
   */
  public getDayInfoString(): string {
    return this.astronomyCalculator.getDayInfoString();
  }

  /**
   * Gets the night light intensity based on sun elevation
   * @returns Night light intensity (0-1)
   */
  public getNightLightIntensity(): number {
    const sunElevation = this.skyRenderer.getSunElevation();

    if (sunElevation > 80) {
      return sunElevation / 100;
    }

    if (sunElevation > 100) {
      return 1;
    }

    return 0;
  }

  /**
   * Updates the system, should be called in animation loop
   */
  public update(): void {
    if (!this.animateSun) return;

    const deltaTime = this.timer.getDelta();

    // Apply animation speed
    const deltaMinutes = deltaTime * this.animationSpeed;
    this.dayTime = (this.dayTime + deltaMinutes / 60) % 24;

    this.updateSunPosition();
    this.notifyTimeChange();
  }

  /**
   * Updates sun position based on current time of day
   */
  private updateSunPosition(): void {
    const sunParams = this.astronomyCalculator.getSunSkyParameters(this.dayTime);
    this.skyRenderer.updateSunPosition(sunParams.elevation, sunParams.azimuth);
  }

  /**
   * Notifies any time display callback with the current formatted time
   */
  private notifyTimeChange(): void {
    if (this.timeDisplayCallback) {
      const hours = Math.floor(this.dayTime);
      const minutes = Math.floor((this.dayTime - hours) * 60);
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const dayInfoString = this.getDayInfoString();
      this.timeDisplayCallback(`${timeString} ${dayInfoString}`);
    }
  }
}
