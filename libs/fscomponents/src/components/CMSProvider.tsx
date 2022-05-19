import type { ComponentClass } from 'react';
import React, { Component } from 'react';

import type { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';
import { ContentManagementSystem } from '@brandingbrand/fsengage';

export interface CMSProviderState {
  cmsData: unknown;
}

export interface CMSProviderProps {
  cmsProviderManagementConfig: CoreContentManagementSystemProvider;
  cmsProviderGroup: string;
  cmsProviderSlot: string;
  cmsProviderIdentifier?: string;
}

export const withCMSProvider = <P,>(
  WrappedComponent: ComponentClass<CMSProviderProps & P>
): ComponentClass<CMSProviderProps & P> => {
  type ResultProps = CMSProviderProps & P;

  return class CommerceProvider extends Component<ResultProps, CMSProviderState> {
    constructor(props: ResultProps) {
      super(props);
      this.state = {
        cmsData: null,
      };
    }

    private readonly fetchData = () => {
      const {
        cmsProviderGroup,
        cmsProviderIdentifier,
        cmsProviderManagementConfig,
        cmsProviderSlot,
      } = this.props;

      const CMS = new ContentManagementSystem(cmsProviderManagementConfig);

      CMS.contentForSlot(cmsProviderGroup, cmsProviderSlot, cmsProviderIdentifier)
        .then((data) => {
          this.setState({
            cmsData: data,
          });
        })
        .catch((error) => {
          console.warn(
            `Error fetching content for slot ${cmsProviderGroup}, ` +
              `${cmsProviderSlot}, ${cmsProviderIdentifier}`,
            error
          );
        });
    };

    public componentDidMount(): void {
      this.fetchData();
    }

    public render(): JSX.Element {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
};
