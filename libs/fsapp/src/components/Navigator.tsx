import { Component } from 'react';

import type { GenericNavProp } from '../lib/nav-wrapper';
import type Navigator from '../lib/nav-wrapper';

export interface NavigatorProp extends GenericNavProp {
  navigator: Navigator;
}

export default class NavRender extends Component<NavigatorProp> {}
