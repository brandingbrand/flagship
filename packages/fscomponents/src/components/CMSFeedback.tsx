import React, { Component } from 'react';

import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';

import FSNetwork from '@brandingbrand/fsnetwork';
// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const TcForm = require('@brandingbrand/tcomb-form-native');
import { cloneDeep } from 'lodash-es';
import { stringify } from 'qs';
import { Dictionary } from '@brandingbrand/fsfoundation';

import { Button, ButtonProps } from './Button';
import { Modal } from './Modal';
import { Form } from './Form';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.feedback;

const DEFAULT_BUTTON_TEXT = FSI18n.string(componentTranslationKeys.title);
const DEFAULT_MODAL_TITLE = FSI18n.string(componentTranslationKeys.title);
const DEFAULT_SUCCESS_MESSAGE = FSI18n.string(componentTranslationKeys.actions.submit.success);
const DEFAULT_ERROR_MESSAGE = FSI18n.string(componentTranslationKeys.actions.submit.failure);

const REQUEST_URL = 'https://brand.brandingbrand.com/site_feedback/feedbacks/add';
const network = new FSNetwork();

const REQUEST_CONFIG = {
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
};

// To customize the style of a single field you have to extend the default
// Tcomb stylesheet
const MultilineStyle = cloneDeep(TcForm.form.Form.stylesheet);
MultilineStyle.textbox.normal.height = 100;
MultilineStyle.textbox.error.height = 100;

const FIELD_TYPES = TcForm.struct({
  email: TcForm.String,
  feedback: TcForm.String
});

export interface CMSFeedbackType {
  vid?: string;
  referrer?: string;
  feedback?: string;
}

export interface CMSFeedbackProps {
  propertyId: string; // Only required prop: Brand CMS Property ID

  modalContainerStyle?: StyleProp<ViewStyle>;
  modalTitle?: string;
  modalTitleStyle?: StyleProp<TextStyle>;
  renderModalTitle?: () => React.ReactNode; // Optional; will override default render
  renderModalBody?: () => React.ReactNode; // Optional instructions/details for the user

  successMessage?: string;
  successMessageStyle?: StyleProp<TextStyle>;
  renderSuccessMessage?: () => React.ReactNode; // Optional; will override default render

  errorMessage?: string;
  errorMessageStyle?: StyleProp<TextStyle>;
  renderErrorMessage?: () => React.ReactNode; // Optional; will override default render

  // Options to customize how Tcomb Form & React Native Forms handle inputs.
  // See https://github.com/gcanti/tcomb-form-native#rendering-options
  fieldOptions?: Dictionary;

  closeButtonProps?: ButtonProps; // Props to send to Button component for close button
  openButtonProps?: ButtonProps; // Props to send to Button component for open button
  submitButtonProps?: ButtonProps; // Props to send to Button component for submit button

  vid?: string; // Optional vid (video id) string to get passed to CMS Feedback
  referrer?: string; // Optional referrer string to get passed to CMS Feedback

  // Optional callback to inspect or transform form data before it's submitted to the CMS
  onSubmit?: (data: CMSFeedbackType) => void;
}

export interface CMSFeedbackState {
  modalVisible: boolean;
  formVisible: boolean;
  successVisible: boolean;
  errorVisible: boolean;
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  headerLeftCol: {
    flex: 1
  },
  headerRightCol: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  statusContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  errorMessage: {
    color: 'red'
  }
});

export class CMSFeedback extends Component<CMSFeedbackProps, CMSFeedbackState> {
  form?: Form;

  state: CMSFeedbackState = {
    modalVisible: false,
    formVisible: true,
    successVisible: false,
    errorVisible: false
  };

  componentDidMount(): void {
    console.warn('CMSFeedback is deprecated and will be removed in the next version of Flagship.');
  }

  submitReview = () => {
    if (this.form) {
      const success = this.form.validate();

      if (success.isValid()) {
        const formData = this.form.getValue();
        const feedback = `${formData.email}\n${formData.feedback}`;

        const feedbackData: CMSFeedbackType = {
          vid: this.props.vid,
          referrer: this.props.referrer,
          feedback
        };

        if (this.props.onSubmit) {
          this.props.onSubmit(feedbackData);
        }

        const requestData = {
          'Feedback[property_id]': this.props.propertyId,
          'Feedback[vid]': feedbackData.vid,
          'Feedback[referrer]': feedbackData.referrer,
          'Feedback[feedback]': feedbackData.feedback
        };

        network.post(REQUEST_URL, stringify(requestData), REQUEST_CONFIG)
          .then(response => {
            this.showSuccess();
          })
          .catch(error => {
            console.error(error);

            this.showError();
          });
      }
    }
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

  openModal = () => {
    this.setState({
      modalVisible: true,
      formVisible: true,
      successVisible: false,
      errorVisible: false
    });

    if (this.form) {
      // Reset field errors when user closes then reopens the modal
      this.form.getComponent('email').setState({
        hasError: false
      });

      this.form.getComponent('feedback').setState({
        hasError: false
      });
    }
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  }

  renderModalHeader(): React.ReactNode {
    let title: React.ReactNode;

    if (this.props.renderModalTitle) {
      title = this.props.renderModalTitle();
    } else {
      title = (
        <Text style={[styles.title, this.props.modalTitleStyle]}>
          {this.props.modalTitle || DEFAULT_MODAL_TITLE}
        </Text>
      );
    }

    return (
      <View style={styles.header}>
        <View style={styles.headerLeftCol}>
          {title}
        </View>
        <View style={styles.headerRightCol}>
          {this.renderCloseButton()}
        </View>
      </View>
    );
  }

  renderModalBody(): React.ReactNode {
    if (this.props.renderModalBody) {
      return this.props.renderModalBody();
    }

    return null;
  }

  fieldOptions = () => {
    const defaultOptions = {
      email: {
        label: FSI18n.string(componentTranslationKeys.form.email.label),
        placeholder: FSI18n.string(componentTranslationKeys.form.email.placeholder),
        keyboardType: 'email-address',
        error: FSI18n.string(componentTranslationKeys.form.email.error),
        autoCorrect: false,
        autoCapitalize: 'none'
      },
      feedback: {
        label: FSI18n.string(componentTranslationKeys.form.feedback.label),
        error: FSI18n.string(componentTranslationKeys.form.feedback.error),
        multiline: true
      }
    };

    return { ...defaultOptions, ...this.props.fieldOptions };
  }

  setForm = (ref: Form) => {
    this.form = ref;
  }

  renderModalForm(): React.ReactNode {
    if (!this.state.formVisible) {
      return null;
    }

    return (
      <View>
        <Form
          fieldsOptions={this.fieldOptions()}
          fieldsTypes={FIELD_TYPES}
          ref={this.setForm}
        />
      </View>
    );
  }

  renderSubmitButton(): React.ReactNode {
    if (!this.state.formVisible) {
      return null;
    }

    return (
      <View>
        <Button
          title={FSI18n.string(componentTranslationKeys.actions.submit.actionBtn)}
          onPress={this.submitReview}
          {...this.props.submitButtonProps}
        />
      </View>
    );
  }

  renderCloseButton(): JSX.Element {
    return (
      <View>
        <Button
          title={FSI18n.string(componentTranslationKeys.actions.submit.cancelBtn)}
          onPress={this.closeModal}
          {...this.props.closeButtonProps}
        />
      </View>
    );
  }

  renderModal(): JSX.Element {
    return (
      <Modal visible={this.state.modalVisible} onRequestClose={this.closeModal}>
        <View style={[styles.modalContainer, this.props.modalContainerStyle]}>
          {this.renderModalHeader()}
          {this.renderModalBody()}
          {this.renderSuccessMessage()}
          {this.renderErrorMessage()}
          {this.renderModalForm()}
          {this.renderSubmitButton()}
        </View>
      </Modal>
    );
  }

  renderOpenModalButton(): JSX.Element {
    return (
      <Button
        title={DEFAULT_BUTTON_TEXT}
        {...this.props.openButtonProps}
        onPress={this.openModal}
      />
    );
  }

  render(): JSX.Element {
    return (
      <View>
        {this.renderModal()}
        {this.renderOpenModalButton()}
      </View>
    );
  }
}
