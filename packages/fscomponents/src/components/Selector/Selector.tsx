import React, { PureComponent } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import styles from '../../styles/Selector';
import { Modal } from '../Modal';
import { SelectorList } from './SelectorList';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const componentTranslationKeys = translationKeys.flagship.selector;

export interface SelectorItem {
  disabled?: boolean;
  label: string;
  selected?: boolean;
  value: string;
}

export interface SelectorProps {
  items: SelectorItem[];
  title?: string;
  placeholder?: string;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  itemHeight?: number;
  renderDropdownArrow?: () => React.ReactNode;
  renderCloseButton?: (closeModal: Function) => React.ReactNode;

  // styles
  style?: StyleProp<ViewStyle>;
  selectButtonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  modalHeaderStyle?: StyleProp<ViewStyle>;
  modalHeaderTextStyle?: StyleProp<TextStyle>;
  disabledItemStyle?: StyleProp<ViewStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
  selectedItemTextStyle?: StyleProp<TextStyle>;
  titleAccessibilityLabel?: string;
}

export interface SelectorStateType {
  modalVisible: boolean;
  selectedValue?: string;
}

export class Selector extends PureComponent<
  SelectorProps,
  SelectorStateType
> {
  static getDerivedStateFromProps(
    nextProps: SelectorProps,
    prevState: SelectorStateType
  ): Partial<SelectorStateType> | null {
    if (nextProps.selectedValue !== prevState.selectedValue) {
      return {
        selectedValue: nextProps.selectedValue
      };
    }

    return null;
  }

  constructor(props: SelectorProps) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedValue: props.selectedValue
    };
  }

  renderSelector = () => {
    const {
      title,
      items,
      selectButtonStyle,
      labelStyle,
      placeholder,
      placeholderStyle
    } = this.props;

    const { selectedValue } = this.state;
    const selectorLabel = (
      items.find(it => it.value === selectedValue) || {
        label: undefined
      }
    ).label;

    return (
      <TouchableOpacity
        style={[styles.selector, selectButtonStyle]}
        onPress={this.openModal}
        accessibilityRole='button'
      >
        {!selectorLabel && placeholder ? (
          <Text style={[styles.placeholderStyle, placeholderStyle]}>
            {placeholder}
          </Text>
        ) : (
          <Text style={[styles.selectorLabel, labelStyle]}>
            {selectorLabel || placeholder || title || items[0] && items[0].label || null}
          </Text>
        )}
        {this.renderDropdownArrow()}
      </TouchableOpacity>
    );
  }

  renderDropdownArrow = () => {
    if (this.props.renderDropdownArrow) {
      return this.props.renderDropdownArrow();
    } else {
      return <View style={styles.dropdownArrow} />;
    }
  }

  renderCloseButton = () => {
    if (this.props.renderCloseButton) {
      return this.props.renderCloseButton(this.closeModal);
    } else {
      return (
        <TouchableOpacity
          style={styles.closeButtonContainer}
          onPress={this.closeModal}
          accessibilityRole='button'
          accessibilityLabel={FSI18n.string(componentTranslationKeys.close)}
        >
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      );
    }
  }

  renderModal = () => {
    const title = this.props.title || FSI18n.string(componentTranslationKeys.select);
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={this.closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, this.props.modalHeaderStyle]}>
              <Text
                style={[styles.title, this.props.modalHeaderTextStyle]}
                accessibilityRole='header'
                accessibilityLabel={this.props.titleAccessibilityLabel || title}
              >
                {title}
              </Text>
              {this.renderCloseButton()}
            </View>

            <View>
              <SelectorList
                items={this.props.items}
                onSelectChange={this.chooseItem}
                selectedValue={this.state.selectedValue}
                itemHeight={this.props.itemHeight}
                itemStyle={this.props.itemStyle}
                itemTextStyle={this.props.itemTextStyle}
                disabledItemStyle={this.props.disabledItemStyle}
                selectedItemStyle={this.props.selectedItemStyle}
                selectedItemTextStyle={this.props.selectedItemTextStyle}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  render(): JSX.Element {
    return (
      <View style={this.props.style}>
        {this.renderSelector()}
        {this.renderModal()}
      </View>
    );
  }

  openModal = () => {
    this.setState({
      modalVisible: true
    });
  }

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  }

  chooseItem = (value: string) => {
    return () => {
      this.setState({
        selectedValue: value
      });
      this.closeModal();
      if (this.props.onValueChange) {
        this.props.onValueChange(value);
      }
    };
  }
}
