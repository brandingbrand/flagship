import React, { Component } from 'react';

import { DiscoveryMessage, EngagementComp } from '../lib/engagement';
import {
  NavigatorStyle, ScreenProps
} from '../lib/commonTypes';
import { CombinedStore } from '../reducers';
import { fetchInbox } from '../providers/inboxProvider';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { navBarShopScreen } from '../styles/Navigation';
import { connect } from 'react-redux';

export interface HomeProps extends ScreenProps {
  fetchInbox: (accountData: any, initialLoad: boolean) => void;
  stories: DiscoveryMessage[];
  isLoading: boolean;
}

export class Home extends Component<HomeProps> {
  static navigatorStyle: NavigatorStyle = navBarShopScreen;

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
  const stories = combinedStore.inbox.value || [];
  // always put logo story on top
  const logoStory = stories.filter((message: DiscoveryMessage) =>
    message.id === '20b108cb-58e7-42aa-807e-a6588cfe6354');
  const restStories = stories.filter((message: DiscoveryMessage) =>
    message.id !== '20b108cb-58e7-42aa-807e-a6588cfe6354');
  const orderedStories = [...logoStory, ...restStories].map((message: DiscoveryMessage) => {
    return {
      name: message.title,
      id: message.id,
      ...message.content
    };
  });
  return {
    stories: orderedStories,
    isLoading: combinedStore.inbox.loading
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
