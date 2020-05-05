import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { showDataNavPush } from '../../lib/navigation';

import Row from '../../components/Row';
import { TurnToDataSource } from '@brandingbrand/fsturnto';
import { env as projectEnv } from '@brandingbrand/fsapp';

const kExampleProductId = '';

interface TurnToProps {
  componentId: string;
}

export default class TurnTo extends Component<TurnToProps> {
  client: TurnToDataSource | null = null;

  constructor(props: TurnToProps) {
    super(props);
    this.client = new TurnToDataSource(projectEnv.turnTo);
  }

  render(): JSX.Element {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Row text='Fetch Review Detail' onPress={this.fetchReviewDetails} />
        <Row text='Fetch Review Summaries' onPress={this.fetchReviewSummary} />
        <Row
          text='Fetch Review Statistics'
          onPress={this.fetchReviewStatistics}
        />
      </ScrollView>
    );
  }

  fetchReviewDetails = () => {
    if (this.client) {
      this.client
        .fetchReviewDetails({
          ids: kExampleProductId
        })
        .then(data => {
          showDataNavPush(this.props.componentId, data);
        })
        .catch((err: Error) => {
          console.warn(err);
        });
    }
  }

  fetchReviewSummary = () => {
    if (this.client) {
      this.client
        .fetchReviewSummary({
          ids: kExampleProductId
        })
        .then(data => {
          showDataNavPush(this.props.componentId, data);
        })
        .catch((err: Error) => {
          console.warn(err);
        });
    }
  }

  fetchReviewStatistics = () => {
    if (this.client) {
      this.client
        .fetchReviewStatistics({
          ids: kExampleProductId
        })
        .then(data => {
          showDataNavPush(this.props.componentId, data);
        })
        .catch((err: Error) => {
          console.warn(err);
        });
    }
  }
}
