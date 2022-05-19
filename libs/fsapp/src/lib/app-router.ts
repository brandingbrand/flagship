import { Platform } from 'react-native';
import type { LayoutComponent } from 'react-native-navigation';

import FSNetwork from '@brandingbrand/fsnetwork';

import type { Key } from 'path-to-regexp';
import pathToRegexp from 'path-to-regexp';

import type {
  AppConfigType,
  CMSRoutesConfig,
  CombinedRouter,
  LayoutBuilderObject,
  PublishedPage,
  RouterConfig,
} from '../types';

import type Navigator from './nav-wrapper';

export default class AppRouter {
  constructor(appConfig: AppConfigType) {
    const { env = {}, routerConfig = {} } = appConfig;
    const {
      cmsToken,
      engagement: { appId, baseURL },
    } = env;
    this.appRoutes = routerConfig;
    this.cmsToken = cmsToken;
    this.appId = appId;
    this.networkClient = new FSNetwork({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private readonly cmsToken = '';
  private readonly appId: string;
  private readonly networkClient: FSNetwork;
  private pageRoutes: CMSRoutesConfig = {};
  private routerConfig: CombinedRouter = {};
  private readonly appRoutes: RouterConfig = {};

  public async loadRoutes(): Promise<void> {
    this.pageRoutes = await this.fetchPageRoutes();
    this.routerConfig = { ...this.appRoutes, ...this.pageRoutes };
  }

  public getConfig(): any {
    return {
      user: { ...this.pageRoutes },
      app: { ...this.appRoutes },
    };
  }

  public getWebRouterConfig(): any {
    const config: any = {};
    for (const path in this.appRoutes) {
      if (this.appRoutes.hasOwnProperty(path)) {
        config[path] = { ...this.appRoutes[path] };
      }
    }
    for (const path in this.pageRoutes) {
      if (config.hasOwnProperty(path)) {
        // already exists in app routes
        if (!path.includes(':')) {
          config[path] = { ...this.pageRoutes[path] };
        }
      } else {
        config[path] = { ...this.pageRoutes[path] };
      }
    }
    return config;
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  public async url(navigator: Navigator, href: string): Promise<void> {
    let found: any = {};
    if (!href) {
      console.warn('appRouter.url() must be called with an href');
      return;
    }
    // eslint-disable-next-line guard-for-in
    for (const path in this.pageRoutes) {
      const pageRoute = this.pageRoutes[path] as PublishedPage;

      if (this.pageRoutes.hasOwnProperty(path)) {
        const keys: Key[] = [];
        const regexp = pathToRegexp(path, keys);
        const match = regexp.exec(href);
        if (match) {
          if (keys.length === 0 && this.pageRoutes.hasOwnProperty(path)) {
            found = {
              type: 'cms-page',
              title: pageRoute.title || '',
              pageId: pageRoute.pageId,
              content: pageRoute.content,
            };
            break;
          }
          const [, ...values] = match;
          const passProps = keys.reduce<Record<string, string>>((memo, key, index) => {
            memo[key.name] = values[index] as string;
            return memo;
          }, {});
          if (
            pageRoute.defaultInputs.length > 0 &&
            pageRoute.dataInputs.length === pageRoute.defaultInputs.length
          ) {
            let valid = true;
            pageRoute.dataInputs.forEach((inp: string, index: number) => {
              if (passProps[inp] !== pageRoute.defaultInputs[index]) {
                valid = false;
              }
            });
            if (valid) {
              found = {
                type: 'cms-page',
                title: pageRoute.title || '',
                pageId: pageRoute.pageId,
                content: pageRoute.content,
              };
              break;
            }
          }
        }
      }
    }

    // TODO: finish card tab switch if tabindex set

    if (found && found.type && found.type === 'cms-page') {
      return navigator
        .push(
          {
            component: {
              name: 'CMS',
              options: {
                topBar: {
                  title: {
                    text: found.title,
                  },
                },
              },
              passProps: {
                defaultLayout: found.content,
              },
            },
          },
          Platform.OS === 'web' ? href : undefined
        )
        .catch((error) => {
          console.warn('CMS Navigator PUSH error:', error);
        });
    }

    for (const path in this.appRoutes) {
      if (this.appRoutes.hasOwnProperty(path)) {
        const keys: Key[] = [];
        const regexp = pathToRegexp(path, keys);
        const match = regexp.exec(href);
        if (match) {
          if (keys.length === 0 && this.appRoutes[path]) {
            found = {
              type: 'app-page',
              screen: this.appRoutes[path]?.screen || null,
              tabIndex: this.appRoutes[path]?.tabIndex || null,
            };
            if (this.appRoutes[path]) {
              found.passProps = { ...this.appRoutes[path]?.passProps } || {};
            }
            break;
          }

          // made a match on something like /product/:productId
          let id;
          let handleType;

          if (keys.length > 0 && this.appRoutes[path]) {
            const matchedRoute = JSON.parse(JSON.stringify(this.appRoutes[path]));
            const [, ...values] = match;
            id = values[0];
            handleType = keys[0]?.name;
            const params = keys.reduce<any>((memo, key, index) => {
              memo[key.name] = values[index];
              return memo;
            }, {});
            found = {
              type: 'app-page',
              handleType,
              id,
              screen: matchedRoute.screen || null,
              tabIndex: matchedRoute.tabIndex || null,
              passProps: { ...matchedRoute.passProps } || {},
              params,
            };
          }
          if (found && found.type) {
            break;
          }
        }
      }
    }

    if (found && found.type && found.type === 'app-page') {
      if (found.tabIndex) {
        navigator.mergeOptions({
          bottomTabs: {
            currentTabIndex: found.tabIndex,
          },
        });
        return;
      } else if (found.screen) {
        return navigator
          .push(
            {
              component: {
                name: found.screen,
                passProps: this.findPropKeys(found.passProps, found.params),
              },
            },
            Platform.OS === 'web' ? href : undefined
          )
          .catch((error) => {
            console.warn('ProductIndex PUSH error:', error);
          });
      }
    }

    let notFoundPage: any = {};
    notFoundPage = this.pageRoutes['/404']
      ? {
          name: 'CMS',
          title: this.pageRoutes['/404'].title,
          props: {
            defaultLayout: this.pageRoutes['/404'].content,
          },
        }
      : {
          name: 'NotFound',
          title: '404 Not Found',
          props: {},
        };

    return navigator
      .push(
        {
          component: {
            name: notFoundPage.name,
            options: {
              topBar: {
                title: {
                  text: notFoundPage.title,
                },
              },
            },
            passProps: notFoundPage.props,
          },
        },
        Platform.OS === 'web' ? href : undefined
      )
      .catch((error) => {
        console.warn('CMS Navigator PUSH error:', error);
      });
  }

  findPropKeys(props: any, params: any): LayoutComponent['passProps'] {
    if (!params) {
      return props;
    }
    let result;
    // recursively look for matching key in passProps for route
    for (const prop in props) {
      if (props.hasOwnProperty(prop)) {
        if (params[props[prop]]) {
          props[prop] = params[props[prop]];
        }
        if (props[prop] instanceof Object) {
          result = this.findPropKeys(props[prop], params);
          if (result) {
            break;
          }
        }
      }
    }
    return props;
  }

  private async fetchPageRoutes(): Promise<any> {
    return this.networkClient
      .get(
        `PublishedPages?filter=${encodeURIComponent(
          JSON.stringify({
            where: {
              appId: this.appId,
              deleted: 0,
              active: 1,
            },
            order: 'title',
          })
        )}`,
        {
          headers: {
            Authorization: `Bearer ${this.cmsToken}`,
          },
        }
      )
      .then(async (pageData) => {
        let customRoutes;
        let parsedContent: LayoutBuilderObject | undefined;

        if (pageData.data) {
          customRoutes = pageData.data.map((data: PublishedPage) => {
            if (data.content) {
              try {
                parsedContent = JSON.parse(data.content);
              } catch (error) {
                console.error(error);
              }
            }
            return {
              id: data.pageId,
              title: data.title,
              path: data.path || null,
              content: parsedContent,
              dataInputs:
                parsedContent?.props?.dataInputs && Array.isArray(parsedContent.props.dataInputs)
                  ? parsedContent.props.dataInputs
                  : [],
              defaultInputs:
                parsedContent?.props?.defaultInputs &&
                Array.isArray(parsedContent.props.defaultInputs)
                  ? parsedContent.props.defaultInputs
                  : [],
            };
          });
        }

        return customRoutes
          .filter((page: PublishedPage) => page.path !== null)
          .reduce(
            (ret: Record<string, Omit<PublishedPage, 'id' | 'path'>>, page: PublishedPage) => {
              if (!page.path) {
                return ret;
              }
              ret[page.path] = {
                pageId: page.id,
                title: page.title,
                content: page.content,
                dataInputs: page.dataInputs,
                defaultInputs: page.defaultInputs,
              };
              return ret;
            },
            {}
          );
      });
  }
}
