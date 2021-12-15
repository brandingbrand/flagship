import FSNetwork from '@brandingbrand/fsnetwork';
import { LayoutComponent } from 'react-native-navigation';
import Navigator from './nav-wrapper';
import pathToRegexp, { Key } from 'path-to-regexp';
import { Platform } from 'react-native';
import {
  AppConfigType,
  CMSRoutesConfig,
  CombinedRouter,
  LayoutBuilderObject,
  PublishedPage,
  RouterConfig,
} from '../types';

export default class AppRouter {
  cmsToken: string = '';
  appId: string;
  networkClient: FSNetwork;
  pageRoutes: CMSRoutesConfig = {};
  routerConfig: CombinedRouter = {};
  appRoutes: RouterConfig = {};

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

  async loadRoutes(): Promise<void> {
    this.pageRoutes = await this.fetchPageRoutes();
    this.routerConfig = { ...this.appRoutes, ...this.pageRoutes };
  }

  getConfig(): any {
    const config = {
      user: { ...this.pageRoutes },
      app: { ...this.appRoutes },
    };
    return config;
  }

  getWebRouterConfig(): any {
    const config: any = {};
    for (const path in this.appRoutes) {
      if (this.appRoutes.hasOwnProperty(path)) {
        config[path] = { ...this.appRoutes[path] };
      }
    }
    for (const path in this.pageRoutes) {
      if (config.hasOwnProperty(path)) {
        // already exists in app routes
        if (path.indexOf(':') === -1) {
          config[path] = { ...this.pageRoutes[path] };
        }
      } else {
        config[path] = { ...this.pageRoutes[path] };
      }
    }
    return config;
  }

  // eslint-disable-next-line complexity
  async url(navigator: Navigator, href: string, props?: any): Promise<void> {
    let found: any = {};
    if (!href) {
      console.warn('appRouter.url() must be called with an href');
      return;
    }
    for (const path in this.pageRoutes) {
      if (this.pageRoutes.hasOwnProperty(path)) {
        const keys: Key[] = [];
        const regexp = pathToRegexp(path, keys);
        const match = regexp.exec(href);
        if (match) {
          if (!keys.length && this.pageRoutes.hasOwnProperty(path)) {
            found = {
              type: 'cms-page',
              title: this.pageRoutes[path].title || '',
              pageId: this.pageRoutes[path].pageId,
              content: this.pageRoutes[path].content,
            };
            break;
          }
          const [, ...values] = match;
          const passProps = keys.reduce<Record<string, string>>((memo, key, index) => {
            memo[key.name] = values[index];
            return memo;
          }, {});
          if (
            this.pageRoutes[path].defaultInputs.length &&
            this.pageRoutes[path].dataInputs.length === this.pageRoutes[path].defaultInputs.length
          ) {
            let valid = true;
            this.pageRoutes[path].dataInputs.forEach((inp: string, index: number) => {
              if (passProps[inp] !== this.pageRoutes[path].defaultInputs[index]) {
                valid = false;
              }
            });
            if (valid) {
              found = {
                type: 'cms-page',
                title: this.pageRoutes[path].title || '',
                pageId: this.pageRoutes[path].pageId,
                content: this.pageRoutes[path].content,
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
        .catch((e) => console.warn('CMS Navigator PUSH error: ', e));
    }

    for (const path in this.appRoutes) {
      if (this.appRoutes.hasOwnProperty(path)) {
        const keys: Key[] = [];
        const regexp = pathToRegexp(path, keys);
        const match = regexp.exec(href);
        if (match) {
          if (!keys.length && this.appRoutes[path]) {
            found = {
              type: 'app-page',
              screen: this.appRoutes[path].screen || null,
              tabIndex: this.appRoutes[path].tabIndex || null,
            };
            if (this.appRoutes[path]) {
              found.passProps = { ...this.appRoutes[path].passProps } || {};
            }
            break;
          }

          // made a match on something like /product/:productId
          let id;
          let handleType;

          if (keys.length && this.appRoutes[path]) {
            const matchedRoute = JSON.parse(JSON.stringify(this.appRoutes[path]));
            const [, ...values] = match;
            id = values[0];
            handleType = keys[0].name;
            const params = keys.reduce((memo, key, index) => {
              memo[key.name] = values[index];
              return memo;
            }, {} as any);
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
        return navigator.mergeOptions({
          bottomTabs: {
            currentTabIndex: found.tabIndex,
          },
        });
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
          .catch((e) => console.warn('ProductIndex PUSH error: ', e));
      }
    }

    let notFoundPage: any = {};
    if (this.pageRoutes['/404']) {
      notFoundPage = {
        name: 'CMS',
        title: this.pageRoutes['/404'].title,
        props: {
          defaultLayout: this.pageRoutes['/404'].content,
        },
      };
    } else {
      notFoundPage = {
        name: 'NotFound',
        title: '404 Not Found',
        props: {},
      };
    }

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
      .catch((e) => console.warn('CMS Navigator PUSH error: ', e));
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

  async fetchPageRoutes(): Promise<any> {
    return this.networkClient
      .get(
        'PublishedPages?filter=' +
          encodeURIComponent(
            JSON.stringify({
              where: {
                appId: this.appId,
                deleted: 0,
                active: 1,
              },
              order: 'title',
            })
          ),
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
              } catch (e) {
                console.error(e);
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
