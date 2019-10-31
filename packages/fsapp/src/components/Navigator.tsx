import { Component } from 'react';
import { GenericNavProp } from './screenWrapper';
import NavWrapper from '../lib/nav-wrapper';

export interface NavigatorProp extends GenericNavProp {
  navigator: NavWrapper;
}

export default class Navigator extends Component<NavigatorProp> {
}
