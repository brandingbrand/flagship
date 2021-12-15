/**
 *  A unit of distance.
 */
export enum DistanceUnit {
  /**
   * A distance in Imperial miles.
   */
  Mile,

  /**
   * A distance in SI kilometers.
   */
  Kilometer,
}

/**
 * The physical distance to an object.
 */
export interface Distance {
  /**
   * The quantity of the distance.
   */
  value: number;

  /**
   * The units for the distance (e.g. miles or kilometers)
   */
  unit: DistanceUnit;
}
