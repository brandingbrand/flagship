import { Component } from 'react';
import NavWrapper, { GenericNavProp } from '../lib/nav-wrapper';

export interface NavigatorProp extends GenericNavProp {
  navigator: NavWrapper;
}

export default class Navigator extends Component<NavigatorProp> {
}
