import * as THREE from 'three';

/**
 * Handles astronomical calculations related to sun position
 */
export class SunAstronomyCalculator {
  /**
   * Creates a new calculator for sun astronomy
   * @param latitude Geographic latitude in degrees (restricted to -80 to 80)
   * @param dayOfYear Day of year (1-365)
   * @param axialTilt Earth's axial tilt in degrees (default: 23.44)
   */
  constructor(
    private latitude: number = 40,
    private dayOfYear: number = 130,
    private axialTilt: number = 23.44
  ) {
    this.setLatitude(latitude);
    this.setDayOfYear(dayOfYear);
  }

  /**
   * Sets the geographic latitude
   * @param latitude Latitude in degrees, restricted to -80 to 80 to avoid issues near poles
   */
  public setLatitude(latitude: number): void {
    this.latitude = Math.max(-80, Math.min(80, latitude));
  }

  /**
   * Gets the current latitude
   * @returns Latitude in degrees
   */
  public getLatitude(): number {
    return this.latitude;
  }

  /**
   * Sets the day of year
   * @param day Day of year (1-365)
   */
  public setDayOfYear(day: number): void {
    this.dayOfYear = Math.max(1, Math.min(365, day));
  }

  /**
   * Gets the current day of year
   * @returns Day of year (1-365)
   */
  public getDayOfYear(): number {
    return this.dayOfYear;
  }

  /**
   * Calculates sun position for a specific time of day
   * @param timeHours Time of day in hours (0-24)
   * @param radius Radius for the spherical coordinates (default: 10)
   * @returns 3D position vector of the sun
   */
  public calculateSunPosition(timeHours: number, radius: number = 10): THREE.Vector3 {
    const solarDeclination = this.calculateSolarDeclination();

    const latitudeRadians = THREE.MathUtils.degToRad(this.latitude);
    const declinationRadians = THREE.MathUtils.degToRad(solarDeclination);

    const elevation = this.calculateElevation(latitudeRadians, declinationRadians, timeHours);
    const azimuth = this.calculateAzimuth(
      latitudeRadians,
      declinationRadians,
      elevation,
      timeHours
    );

    // Convert from astronomical to Three.js coordinates
    const threeJsAzimuth = (azimuth + 180) % 360;
    const threeJsElevation = 90 - elevation;

    // Convert to spherical coordinates
    const phi = THREE.MathUtils.degToRad(threeJsElevation);
    const theta = THREE.MathUtils.degToRad(threeJsAzimuth);

    const position = new THREE.Vector3();
    position.setFromSphericalCoords(radius, phi, theta);

    return position;
  }

  /**
   * Gets sun position parameters for Three.js sky model
   * @param timeHours Time of day in hours (0-24)
   * @returns Object with elevation and azimuth values
   */
  public getSunSkyParameters(timeHours: number): { elevation: number; azimuth: number } {
    const solarDeclination = this.calculateSolarDeclination();

    const latitudeRadians = THREE.MathUtils.degToRad(this.latitude);
    const declinationRadians = THREE.MathUtils.degToRad(solarDeclination);

    const elevation = this.calculateElevation(latitudeRadians, declinationRadians, timeHours);
    const azimuth = this.calculateAzimuth(
      latitudeRadians,
      declinationRadians,
      elevation,
      timeHours
    );

    // Convert from astronomical to Three.js coordinates
    const threeJsAzimuth = (azimuth + 180) % 360;
    const threeJsElevation = 90 - elevation;

    return {
      elevation: threeJsElevation,
      azimuth: threeJsAzimuth,
    };
  }

  /**
   * Calculates sunrise time
   * @returns Time in decimal hours (e.g., 6.5 for 6:30), or special value for polar cases
   */
  public getSunriseTime(): number {
    return this.calculateSunriseOrSunset(true);
  }

  /**
   * Calculates sunset time
   * @returns Time in decimal hours (e.g., 18.5 for 18:30), or special value for polar cases
   */
  public getSunsetTime(): number {
    return this.calculateSunriseOrSunset(false);
  }

  /**
   * Calculates the duration of daylight in hours
   * @returns Number of hours of daylight (0-24)
   */
  public getDaylightDuration(): number {
    const sunrise = this.getSunriseTime();
    const sunset = this.getSunsetTime();

    // Handle special cases
    if (sunrise === -1 && sunset === -1) {
      return 0; // Polar night, no daylight
    } else if (sunrise === -2 && sunset === -2) {
      return 24; // Polar day, 24 hours of daylight
    }

    return sunset - sunrise;
  }

  /**
   * Gets formatted string with sunrise, sunset times and day length
   * @returns String with day information
   */
  public getDayInfoString(): string {
    const sunrise = this.getSunriseTime();
    const sunset = this.getSunsetTime();
    // const dayLength = this.getDaylightDuration();

    let sunriseStr = '';
    let sunsetStr = '';
    // let dayLengthStr = '';

    // Format sunrise time
    if (sunrise === -1) {
      sunriseStr = 'Sun never rises';
    } else if (sunrise === -2) {
      sunriseStr = 'Sun never sets';
    } else {
      const sunriseHours = Math.floor(sunrise);
      const sunriseMinutes = Math.floor((sunrise - sunriseHours) * 60);
      sunriseStr = `${sunriseHours.toString().padStart(2, '0')}:${sunriseMinutes.toString().padStart(2, '0')}`;
    }

    // Format sunset time
    if (sunset === -1) {
      sunsetStr = 'Sun never rises';
    } else if (sunset === -2) {
      sunsetStr = 'Sun never sets';
    } else {
      const sunsetHours = Math.floor(sunset);
      const sunsetMinutes = Math.floor((sunset - sunsetHours) * 60);
      sunsetStr = `${sunsetHours.toString().padStart(2, '0')}:${sunsetMinutes.toString().padStart(2, '0')}`;
    }

    // // Format day length
    // const dayHours = Math.floor(dayLength);
    // const dayMinutes = Math.floor((dayLength - dayHours) * 60);
    // dayLengthStr = `${dayHours.toString().padStart(2, '0')}:${dayMinutes.toString().padStart(2, '0')}`;

    return `Sunrise: ${sunriseStr}, Sunset: ${sunsetStr}`;
  }

  /**
   * Common method for calculating sunrise/sunset time
   * @param isSunrise True to calculate sunrise, false for sunset
   * @returns Time in decimal hours, or -1 (never rises) or -2 (never sets)
   */
  private calculateSunriseOrSunset(isSunrise: boolean): number {
    const solarDeclination = this.calculateSolarDeclination();
    const latitudeRadians = THREE.MathUtils.degToRad(this.latitude);
    const declinationRadians = THREE.MathUtils.degToRad(solarDeclination);

    // For the southern hemisphere in winter or northern hemisphere in summer
    // solar declination and latitude have opposite signs (one +, the other -)

    // Check polar conditions
    if (Math.abs(this.latitude) + Math.abs(solarDeclination) >= 90) {
      // Polar day:
      // Northern hemisphere (positive latitude) summer (positive declination)
      // OR southern hemisphere (negative latitude) winter (negative declination)
      if (
        (this.latitude > 0 && solarDeclination > 0) ||
        (this.latitude < 0 && solarDeclination < 0)
      ) {
        return -2; // Sun never sets
      }
      // Polar night:
      // Northern hemisphere (positive latitude) winter (negative declination)
      // OR southern hemisphere (negative latitude) summer (positive declination)
      else {
        return -1; // Sun never rises
      }
    }

    // Standard calculation for normal cases
    const hourAngleCosine = -Math.tan(latitudeRadians) * Math.tan(declinationRadians);
    const constrainedCosine = Math.max(-1, Math.min(1, hourAngleCosine));

    // Additional check for edge cases
    if (hourAngleCosine < -1) {
      return -1; // Sun never rises
    } else if (hourAngleCosine > 1) {
      return -2; // Sun never sets
    }

    // Convert to hours
    const hourAngleRadians = Math.acos(constrainedCosine);
    const hourAngleDegrees = THREE.MathUtils.radToDeg(hourAngleRadians);
    const hoursFromNoon = hourAngleDegrees / 15;

    // Return sunrise (12 - hours) or sunset (12 + hours)
    return isSunrise ? 12 - hoursFromNoon : 12 + hoursFromNoon;
  }

  /**
   * Calculates solar declination based on day of year
   * @returns Solar declination in degrees
   */
  private calculateSolarDeclination(): number {
    // This formula is based on the astronomical formula for solar declination
    return this.axialTilt * Math.sin(((this.dayOfYear - 81) * 2 * Math.PI) / 365);
  }

  /**
   * Calculates hour angle for given time
   * @param timeHours Time in hours (0-24)
   * @returns Hour angle in radians
   */
  private calculateHourAngle(timeHours: number): number {
    return (Math.PI * (timeHours - 12)) / 12;
  }

  /**
   * Calculates the elevation of the sun at a given time
   * @param latitudeRad Latitude in radians
   * @param declinationRad Declination in radians
   * @param timeHours Time of day in hours (0-24)
   * @returns Elevation in degrees
   */
  private calculateElevation(
    latitudeRad: number,
    declinationRad: number,
    timeHours: number
  ): number {
    const hourAngle = this.calculateHourAngle(timeHours);

    const sinElevation =
      Math.sin(latitudeRad) * Math.sin(declinationRad) +
      Math.cos(latitudeRad) * Math.cos(declinationRad) * Math.cos(hourAngle);

    return THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, sinElevation))));
  }

  /**
   * Calculates the azimuth of the sun at a given time
   * @param latitudeRad Latitude in radians
   * @param declinationRad Declination in radians
   * @param elevationDeg Elevation in degrees
   * @param timeHours Time of day in hours (0-24)
   * @returns Azimuth in degrees
   */
  private calculateAzimuth(
    latitudeRad: number,
    declinationRad: number,
    elevationDeg: number,
    timeHours: number
  ): number {
    const elevationRad = THREE.MathUtils.degToRad(elevationDeg);

    let cosAzimuth =
      (Math.sin(declinationRad) - Math.sin(latitudeRad) * Math.sin(elevationRad)) /
      (Math.cos(latitudeRad) * Math.cos(elevationRad));

    let azimuth = THREE.MathUtils.radToDeg(Math.acos(Math.max(-1, Math.min(1, cosAzimuth))));

    // Adjust azimuth based on time of day
    if (timeHours > 12) {
      azimuth = 360 - azimuth;
    }

    return azimuth;
  }
}
