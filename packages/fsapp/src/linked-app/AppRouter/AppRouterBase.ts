import { Linking } from 'react-native';
import { RouterHistory } from '../History';
import { AppRouter } from './types';

export abstract class AppRouterBase implements AppRouter {
  protected constructor(protected history: RouterHistory) {}
  public async open(url: string): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      const [schema, domainAndPath] = url.split('//', 2);
      const path =
        schema === 'http' || schema === 'https'
          ? `${domainAndPath.split('/', 1)[1] ?? ''}`
          : `${domainAndPath ?? ''}`;

      await this.history.open(path.startsWith('/') ? path : `/${path}`);
    }
  }
}
