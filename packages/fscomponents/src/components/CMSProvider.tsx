import React, { Component, ComponentClass } from 'react';
import {
  ContentManagementSystem,
  CoreContentManagementSystemProvider
} from '@brandingbrand/fsengage';

export interface CMSProviderState {
  cmsData: any;
}

export interface CMSProviderProps {
  cmsProviderManagementConfig: CoreContentManagementSystemProvider;
  cmsProviderGroup: string;
  cmsProviderSlot: string;
  cmsProviderIdentifier?: string;
}

export function withCMSProvider<P extends {}>(
  WrappedComponent: ComponentClass<P & CMSProviderProps>
): ComponentClass<P & CMSProviderProps> {
  type ResultProps = P & CMSProviderProps;

  return class CommerceProvider extends Component<
    ResultProps,
    CMSProviderState> {

    constructor(props: ResultProps) {
      super(props);
      this.state = {
        cmsData: null
      };
    }

    componentDidMount(): void {
      this.fetchData();
    }

    fetchData = () => {
      const {
        cmsProviderManagementConfig,
        cmsProviderGroup,
        cmsProviderSlot,
        cmsProviderIdentifier
      } = this.props;

      const CMS = new ContentManagementSystem(cmsProviderManagementConfig);

      CMS.contentForSlot(cmsProviderGroup, cmsProviderSlot, cmsProviderIdentifier)
        .then(data => {
          this.setState({
            cmsData: data
          });
        })
        .catch(error => {
          console.warn(
            `Error fetching content for slot ${cmsProviderGroup}, ` +
            `${cmsProviderSlot}, ${cmsProviderIdentifier}`, error);
        });
    }

    render(): JSX.Element {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
        />
      );
    }
  };
}
