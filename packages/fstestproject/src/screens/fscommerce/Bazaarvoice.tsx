import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import { showDataNavPush } from '../../lib/navigation';

import Row from '../../components/Row';
import { BazaarvoiceDataSource } from '@brandingbrand/fsbazaarvoice';
import { env as projectEnv } from '@brandingbrand/fsapp';

const kExampleReviewId = '';

export default class Bazaarvoice extends Component<any, any> {
  client: BazaarvoiceDataSource;

  constructor(props: any) {
    super(props);
    this.client = new BazaarvoiceDataSource(projectEnv.bazaarvoice);
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
    this.client
      .fetchReviewDetails({
        ids: kExampleReviewId
      })
      .then((data: any) => {
        showDataNavPush(this.props.componentId, data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  fetchReviewSummary = () => {
    this.client
      .fetchReviewSummary({
        ids: kExampleReviewId
      })
      .then((data: any) => {
        showDataNavPush(this.props.componentId, data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  fetchReviewStatistics = () => {
    this.client
      .fetchReviewStatistics({
        ids: kExampleReviewId
      })
      .then((data: any) => {
        showDataNavPush(this.props.componentId, data);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }
}
