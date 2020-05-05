import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { showDataNavPush } from '../../lib/navigation';

import Row from '../../components/Row';
import { PowerReviewsDataSource } from '@brandingbrand/fspowerreviews';
import { env as projectEnv } from '@brandingbrand/fsapp';

const kExampleProductId = '';

interface PowerReviewsProps {
  componentId: string;
}

export default class PowerReviews extends Component<PowerReviewsProps> {
  client: PowerReviewsDataSource | null = null;
  constructor(props: PowerReviewsProps) {
    super(props);
    this.client = new PowerReviewsDataSource(projectEnv.powerReviews);
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
