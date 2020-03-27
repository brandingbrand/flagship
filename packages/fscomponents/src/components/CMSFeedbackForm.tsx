import React, { Component } from 'react';

import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import FSNetwork from '@brandingbrand/fsnetwork';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { isFunction } from 'lodash-es';
import { stringify } from 'qs';

import { Button, ButtonProps } from './Button';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.feedback;

const DEFAULT_TITLE = FSI18n.string(componentTranslationKeys.title);
const DEFAULT_SUCCESS_MESSAGE = FSI18n.string(componentTranslationKeys.actions.submit.success);
const DEFAULT_ERROR_MESSAGE = FSI18n.string(componentTranslationKeys.actions.submit.failure);

const REQUEST_URL = 'https://brand.brandingbrand.com/site_feedback/feedbacks/add';
const network = new FSNetwork();

const REQUEST_CONFIG = {
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
};

export interface CMSFeedbackFormType {
  vid?: string;
  referrer?: string;
  feedback?: string;
}

export interface CMSFeedbackFormProps {
  propertyId: string; // Only required prop: Brand CMS Property ID

  // formik validation schema
  formConfig?: Yup.ObjectSchema<Yup.Shape<object, CMSFeedbackFormFields>>;

  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  textBoxStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<TextStyle>;
  renderTitle?: () => React.ReactNode; // Optional; will override default render
  renderBody?: () => React.ReactNode; // Optional instructions/details for the user

  successMessage?: string;
  successMessageStyle?: StyleProp<TextStyle>;
  renderSuccessMessage?: () => React.ReactNode; // Optional; will override default render

  errorMessage?: string;
  errorMessageStyle?: StyleProp<TextStyle>;
  renderErrorMessage?: () => React.ReactNode; // Optional; will override default render

  submitButtonProps?: ButtonProps; // Props to send to Button component for submit button
  submitButtonStyle?: StyleProp<ViewStyle>;

  vid?: string; // Optional vid (video id) string to get passed to CMS Feedback
  referrer?: string; // Optional referrer string to get passed to CMS Feedback

  // Optional callback to inspect or transform form data before it's submitted to the CMS
  onSubmit?: (data: CMSFeedbackFormType) => void;
}

export interface CMSFeedbackFormState {
  formVisible: boolean;
  successVisible: boolean;
  errorVisible: boolean;
}

const styles = StyleSheet.create({
  container: {},
  header: {
    marginBottom: 10
  },
  headerLeftCol: {
    flex: 1
  },
  headerRightCol: {
    flex: 1
  },
  title: {
    fontSize: 18,
    marginBottom: 8
  },
  statusContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  errorMessage: {
    color: 'red',
    paddingVertical: 15
  }
});

export interface CMSFeedbackFormFields {
  text: string;
}

export class CMSFeedbackForm extends Component<CMSFeedbackFormProps, CMSFeedbackFormState> {

  formConfig: Yup.ObjectSchema<Yup.Shape<object, CMSFeedbackFormFields>>;
  state: CMSFeedbackFormState = {
    formVisible: true,
    successVisible: false,
    errorVisible: false
  };

  constructor(props: CMSFeedbackFormProps) {
    super(props);

    const schema = {
      text: Yup.string()
        .required(FSI18n.string(componentTranslationKeys.form.feedback.error)),
      ...(this.props.formConfig || {})
    };

    this.formConfig = Yup.object().shape(schema);
  }

  submitReview = (values: CMSFeedbackFormFields) => {
    const feedbackData: CMSFeedbackFormType = {
      vid: this.props.vid,
      referrer: this.props.referrer,
      feedback: values.text.trim()
    };

    if (isFunction(this.props.onSubmit)) {
      this.props.onSubmit(feedbackData);
    }

    const requestData = {
      'Feedback[property_id]': this.props.propertyId,
      'Feedback[vid]': feedbackData.vid,
      'Feedback[referrer]': feedbackData.referrer,
      'Feedback[feedback]': feedbackData.feedback
    };

    network.post(REQUEST_URL, stringify(requestData), REQUEST_CONFIG)
      .then(() => {
        this.showSuccess();
      })
      .catch(error => {
        console.error(error);

        this.showError();
      });
  }

  showSuccess = () => {
    this.setState({
      formVisible: false,
      successVisible: true,
      errorVisible: false
    });
  }

  renderSuccessMessage(): React.ReactNode {
    if (!this.state.successVisible) {
      return null;
    }

    if (this.props.renderSuccessMessage) {
      return this.props.renderSuccessMessage();
    }

    return (
      <View style={styles.statusContainer}>
        <Text style={this.props.successMessageStyle}>
          {this.props.successMessage || DEFAULT_SUCCESS_MESSAGE}
        </Text>
      </View>
    );
  }

  showError = () => {
    this.setState({
      successVisible: false,
      errorVisible: true
    });
  }

  renderErrorMessage(): React.ReactNode {
    if (!this.state.errorVisible) {
      return null;
    }

    if (this.props.renderErrorMessage) {
      return this.props.renderErrorMessage();
    }

    return (
      <View style={styles.statusContainer}>
        <Text style={[styles.errorMessage, this.props.errorMessageStyle]}>
          {this.props.errorMessage || DEFAULT_ERROR_MESSAGE}
        </Text>
      </View>
    );
  }

  renderHeader(): React.ReactNode {
    let title: React.ReactNode;

    if (this.props.renderTitle) {
      title = this.props.renderTitle();
    } else {
      title = (
        <Text style={[styles.title, this.props.headerStyle]}>
          {this.props.title || DEFAULT_TITLE}
        </Text>
      );
    }

    return (
      <View style={styles.header}>
        <View style={styles.headerLeftCol}>
          {title}
        </View>
      </View>
    );
  }

  renderBody(): React.ReactNode {
    if (this.props.renderBody) {
      return this.props.renderBody();
    }

    return null;
  }

  renderForm(): React.ReactNode {
    if (!this.state.formVisible) {
      return null;
    }

    return (
      <Formik
        initialValues={{ text: '' }}
        onSubmit={this.submitReview}
        validationSchema={this.formConfig}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched
        }) => (
          <>
            <TextInput
              onChangeText={handleChange('text')}
              onBlur={handleBlur('text')}
              value={values.text}
              multiline={true}
              style={[
                {
                  height: 130,
                  borderWidth: 1,
                  borderColor: '#222'
                },
                this.props.textBoxStyle
              ]}
            />
            <Text style={styles.errorMessage}>{errors.text}</Text>

            {this.renderSubmitButton(handleSubmit)}
          </>
        )}
      </Formik>
    );
  }

  renderSubmitButton(handleSubmit: () => void): React.ReactNode {
    if (!this.state.formVisible) {
      return null;
    }

    return (
      <View>
        <Button
          title={FSI18n.string(componentTranslationKeys.actions.submit.actionBtn)}
          onPress={handleSubmit}
          {...this.props.submitButtonProps}
        />
      </View>
    );
  }

  render(): JSX.Element {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderSuccessMessage()}
        {this.renderErrorMessage()}
        {this.renderForm()}
      </View>
    );
  }
}
