import type { ComponentClass } from 'react';

/**
 * @deprecated
 */
export interface LegacySSRData {
  /**
   * @deprecated
   */
  initialState: any;
  /**
   * @deprecated
   */
  variables: any;
}

/**
 * @deprecated
 */
export interface LegacyRoutableComponentClass extends ComponentClass<any> {
  /**
   * @deprecated
   */
  path?: string;

  /**
   * @deprecated
   */
  cache?: number;

  /**
   * @deprecated
   */
  loadInitialData?: (data: LegacySSRData, req: Request) => Promise<LegacySSRData>;

  /**
   * @deprecated
   */
  // Set to true to call next immediately if this is matched
  instantNext?: boolean;

  /**
   * @deprecated
   */
  // Function to call to determine programmatically whether to call next
  // Includes data after running loadInitialState
  shouldNext?: (data: LegacySSRData, req: Request) => Promise<boolean>;
}
