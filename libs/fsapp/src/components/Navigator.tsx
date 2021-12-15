import { Component } from 'react';
import Navigator, { GenericNavProp } from '../lib/nav-wrapper';

export interface NavigatorProp extends GenericNavProp {
  navigator: Navigator;
}

export default class NavRender extends Component<NavigatorProp> {}
