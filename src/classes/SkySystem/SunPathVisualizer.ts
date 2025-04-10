import * as THREE from 'three';

import { SunAstronomyCalculator } from './SunAstronomyCalculator';

/**
 * Handles visualization of the sun's path across the sky
 */
export class SunPathVisualizer {
  private sunPathGroup: THREE.Group;
  private readonly pathRadius = 10; // Distance from origin for sun path visualization

  /**
   * Creates a new sun path visualizer
   * @param scene Three.js scene to add visualization to
   * @param calculator Astronomy calculator for sun positions
   */
  constructor(
    private scene: THREE.Scene,
    private calculator: SunAstronomyCalculator
  ) {
    this.sunPathGroup = new THREE.Group();
    this.sunPathGroup.name = 'sunPathGroup';
    this.sunPathGroup.visible = false;
    this.scene.add(this.sunPathGroup);

    this.updateSunPath();
  }

  /**
   * Sets visibility of the sun path
   * @param visible Whether the sun path should be visible
   */
  public setVisible(visible: boolean): void {
    this.sunPathGroup.visible = visible;
  }

  /**
   * Gets visibility of the sun path
   * @returns Whether the sun path is visible
   */
  public isVisible(): boolean {
    return this.sunPathGroup.visible;
  }

  /**
   * Updates the sun path visualization based on current calculator parameters
   */
  public updateSunPath(): void {
    this.clearPathContent();

    const points: THREE.Vector3[] = this.generateSunPathPoints();
    this.createSunPathLine(points);
    this.createHourMarkers(points);
  }

  /**
   * Generates points for the sun path based on current latitude and day of year
   * @returns Array of 3D vectors representing sun positions
   */
  private generateSunPathPoints(): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];

    // Create points for each half-hour of the day
    for (let hour = 0; hour <= 24; hour += 0.5) {
      const position = this.calculator.calculateSunPosition(hour, this.pathRadius);
      points.push(position);
    }

    return points;
  }

  /**
   * Creates the sun path line from points
   * @param points Array of 3D vectors for the path
   */
  private createSunPathLine(points: THREE.Vector3[]): void {
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    geometry.name = 'sunPathGeometry';

    const material = new THREE.LineBasicMaterial({
      color: 0xffff00,
      linewidth: 1,
    });
    material.name = 'sunPathMaterial';

    const sunPath = new THREE.Line(geometry, material);
    sunPath.name = 'sunPathLine';

    this.sunPathGroup.add(sunPath);
  }

  /**
   * Creates hour markers along the sun path
   * @param points Array of 3D vectors for the path
   */
  private createHourMarkers(points: THREE.Vector3[]): void {
    const hourLabels = [0, 6, 12, 18]; // Hours to place markers at
    const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    markerGeometry.name = 'sunPathMarkerGeometry';
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    markerMaterial.name = 'sunPathMarkerMaterial';

    for (let i = 0; i < hourLabels.length; i++) {
      const hourIndex = hourLabels[i] * 2; // Since we use steps of 0.5 hours
      if (hourIndex < points.length) {
        const position = points[hourIndex];

        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(position);
        marker.name = `sunPathMarker${hourLabels[i]}`;
        this.sunPathGroup.add(marker);
      }
    }
  }

  /**
   * Clears all content from the sun path group
   */
  private clearPathContent(): void {
    if (this.sunPathGroup) {
      this.sunPathGroup.traverse(child => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
          if (child.geometry) {
            child.geometry.dispose();
          }

          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      this.sunPathGroup.clear();
    }
  }
}
