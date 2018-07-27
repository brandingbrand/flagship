import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import timeSince from '../lib/timeSince';
import { reviewDataSource } from '../lib/datasource';
import * as variables from '../styles/variables';
import { Loading } from '@brandingbrand/fscomponents';
import { ReviewTypes } from '@brandingbrand/fscommerce';
import translate, { translationKeys } from '../lib/translations';

const styles = StyleSheet.create({
  questions: {
    padding: variables.padding.base
  },
  question: {
    borderBottomWidth: variables.border.width,
    borderColor: variables.border.color,
    paddingBottom: 10,
    marginBottom: 25
  },
  headerContainer: {
    paddingBottom: 2,
    flexDirection: 'row'
  },
  header: {
    fontSize: 11
  },
  user: {
    fontWeight: '600'
  },
  summary: {
    flexDirection: 'row'
  },
  summaryTextView: {
    flex: 1
  },
  summaryCountView: {
    width: 60,
    alignItems: 'center'
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '600'
  },
  summaryCountText: {
    fontSize: 15,
    fontWeight: '600'
  },
  summaryCountTextLabel: {
    fontSize: 13
  },
  answers: {
    marginLeft: 15
  },
  answer: {
    marginTop: 10,
    marginBottom: 15
  },
  answerText: {
    fontSize: 13
  },
  dotSeparator: {
    paddingHorizontal: 5
  }
});

// Helper component for QA header
const QAHeader = (props: any) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.header, styles.user]}>{props.user}</Text>
      <Text style={[styles.header, styles.dotSeparator]}>•</Text>
      <Text style={styles.header}>
        {translate.string(translationKeys.screens.productDetail.qa.time, {
          time: timeSince(props.created)
        })}
      </Text>
    </View>
  );
};

export interface PSQAndAProps {
  id: string;
  onDataLoaded?: (data: any) => void;
}

export interface PSQAndAState {
  questions: ReviewTypes.ReviewQuestion[];
  isLoading: boolean;
}

export default class PSQAndA extends Component<PSQAndAProps, PSQAndAState> {
  constructor(props: PSQAndAProps) {
    super(props);

    this.state = {
      questions: [],
      isLoading: true
    };
  }

  componentDidMount(): void {
    if (!reviewDataSource.fetchQuestions) {
      return;
    }

    reviewDataSource.fetchQuestions({ ids: this.props.id })
      .then((data: any) => {
        this.setState({ questions: data, isLoading: false });
        if (this.props.onDataLoaded) {
          this.props.onDataLoaded(data);
        }
      })
      .catch(() => undefined);
  }

  render(): JSX.Element {
    const { isLoading, questions } = this.state;

    if (isLoading) {
      return <Loading style={{ marginTop: 80 }} />;
    } else if (questions.length) {
      return (
        <View style={styles.questions}>
          {questions.map(question => {
            return (
              <View key={question.id} style={styles.question}>
                <QAHeader
                  user={question.user}
                  created={question.created}
                />
                <View style={styles.summary}>
                  <View style={styles.summaryTextView}>
                    <Text style={styles.summaryText}>{question.summary}</Text>
                  </View>
                  <View style={styles.summaryCountView}>
                    <Text style={styles.summaryCountText}>
                      {question.answers && question.answers.length}
                    </Text>
                    <Text style={styles.summaryCountTextLabel}>
                      {translate.string(translationKeys.screens.productDetail.qa.answer, {
                        count: question.answers
                      })}
                    </Text>
                  </View>
                </View>
                {question.text && (
                  <View>
                    <Text>{question.text}</Text>
                  </View>
                )}
                <View style={styles.answers}>
                  {question.answers && question.answers.map(answer => {
                    return (
                      <View key={answer.id} style={styles.answer}>
                        <QAHeader
                          user={answer.user}
                          created={answer.created}
                        />
                        <View>
                          <Text style={styles.answerText}>{answer.text}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      return (
        <Text>{translate.string(translationKeys.screens.productDetail.qa.noQuestions)}</Text>
      );
    }
  }
}

