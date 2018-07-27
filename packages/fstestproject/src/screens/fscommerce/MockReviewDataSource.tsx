import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import Row from '../../components/Row';
import { mockReviewDataSource } from '../../lib/datasource';

const kExampleReviewId = 'P0150';

export default class MockReviewDataSource extends Component<any, any> {
  client: import ('@brandingbrand/fsmockdatasources').MockReviewDataSource;

  constructor(props: any) {
    super(props);
    this.client = mockReviewDataSource;
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
        <Row
          text='Fetch Q&amp;A'
          onPress={this.fetchQuestions}
        />
      </ScrollView>
    );
  }

  showData = (data: any) => {
    this.props.navigator.push({
      screen: 'fscommerce.DataView',
      passProps: {
        json: JSON.stringify(data, null, '  ')
      }
    });
  }

  fetchReviewDetails = async () => {
    const data = await this.client.fetchReviewDetails({ ids: kExampleReviewId });
    this.showData(data);
  }

  fetchReviewSummary = async () => {
    const data = await this.client.fetchReviewSummary({ ids: kExampleReviewId });
    this.showData(data);
  }

  fetchReviewStatistics = async () => {
    const data = await this.client.fetchReviewStatistics({ ids: kExampleReviewId });
    this.showData(data);
  }

  fetchQuestions = async () => {
    const data = await this.client.fetchQuestions({ ids: kExampleReviewId });
    this.showData(data);
  }
}
