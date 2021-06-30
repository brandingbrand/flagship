import React, { Component } from 'react';

import { DiscoveryMessage, EngagementComp } from '../lib/engagement';
import {
  ScreenProps
} from '../lib/commonTypes';
import { CombinedStore } from '../reducers';
import { fetchInbox } from '../providers/inboxProvider';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { navBarShopScreen } from '../styles/Navigation';
import { connect } from 'react-redux';
import { Options } from 'react-native-navigation';

export interface HomeProps extends ScreenProps {
  fetchInbox: (accountData: any, initialLoad: boolean) => void;
  stories: DiscoveryMessage[];
  isLoading: boolean;
}

export class Home extends Component<HomeProps> {
  static options: Options = navBarShopScreen;

  componentDidMount(): void {
    this.props.fetchInbox({}, true);
  }
  render(): JSX.Element {
    const json = {
      private_type: 'feed',
      storyGradient: {
        enabled: false,
        startFadePosition: 50,
        endFadePosition: 300
      },
      empty: {
        message: 'Loading Inbox...',
        textStyle: {
          color: '#524c48',
          padding: 30,
          paddingTop: 100,
          fontSize: 15
        }
      },
      private_blocks: this.props.stories
    };

    return (
      <PSScreenWrapper
        needInSafeArea={false}
        navigator={this.props.navigator}
        scroll={false}
        hideGlobalBanner={true}
      >
        <EngagementComp
          componentId={this.props.navigator.componentId}
          navigator={this.props.navigator}
          refreshControl={this.refreshInbox}
          isLoading={this.props.isLoading}
          welcomeHeader={true}
          headerName={'Brander'}
          json={json}
        />
      </PSScreenWrapper>

    );
  }
  refreshInbox = () => {
    this.props.fetchInbox({}, false);
  }
}
const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    fetchInbox: fetchInbox(dispatch)
  };
};
const mapStateToProps = (combinedStore: CombinedStore, ownProps: any) => {
  const transformedStories = (combinedStore.inbox.value || []).map((message: DiscoveryMessage) => {
    return {
      name: message.title,
      id: message.id,
      ...message.content
    };
  });
  return {
    stories: transformedStories,
    isLoading: combinedStore.inbox.loading
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
