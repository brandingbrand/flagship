import React, { PureComponent } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { style as styles } from '../../styles/Selector';
import { Modal } from '../Modal';

import { SelectorList } from './SelectorList';

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

export class Selector extends PureComponent<SelectorProps, SelectorStateType> {
  public static getDerivedStateFromProps(
    nextProps: SelectorProps,
    prevState: SelectorStateType
  ): Partial<SelectorStateType> | null {
    if (nextProps.selectedValue !== prevState.selectedValue) {
      return {
        selectedValue: nextProps.selectedValue,
      };
    }

    return null;
  }

  constructor(props: SelectorProps) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedValue: props.selectedValue,
    };
  }

  private readonly renderSelector = () => {
    const { items, labelStyle, placeholder, placeholderStyle, selectButtonStyle, title } =
      this.props;

    const { selectedValue } = this.state;
    const selectorLabel = (
      items.find((it) => it.value === selectedValue) || {
        label: undefined,
      }
    ).label;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={this.openModal}
        style={[styles.selector, selectButtonStyle]}
      >
        {!selectorLabel && placeholder ? (
          <Text style={[styles.placeholderStyle, placeholderStyle]}>{placeholder}</Text>
        ) : (
          <Text style={[styles.selectorLabel, labelStyle]}>
            {selectorLabel || placeholder || title || (items[0] && items[0].label) || null}
          </Text>
        )}
        {this.renderDropdownArrow()}
      </TouchableOpacity>
    );
  };

  private readonly renderDropdownArrow = () => {
    if (this.props.renderDropdownArrow) {
      return this.props.renderDropdownArrow();
    }
    return <View style={styles.dropdownArrow} />;
  };

  private readonly renderCloseButton = () => {
    if (this.props.renderCloseButton) {
      return this.props.renderCloseButton(this.closeModal);
    }
    return (
      <TouchableOpacity
        accessibilityLabel={FSI18n.string(componentTranslationKeys.close)}
        accessibilityRole="button"
        onPress={this.closeModal}
        style={styles.closeButtonContainer}
      >
        <Text style={styles.closeButton}>×</Text>
      </TouchableOpacity>
    );
  };

  private readonly renderModal = () => {
    const title = this.props.title || FSI18n.string(componentTranslationKeys.select);
    return (
      <Modal
        animationType="fade"
        onRequestClose={this.closeModal}
        transparent
        visible={this.state.modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, this.props.modalHeaderStyle]}>
              <Text
                accessibilityLabel={this.props.titleAccessibilityLabel || title}
                accessibilityRole="header"
                style={[styles.title, this.props.modalHeaderTextStyle]}
              >
                {title}
              </Text>
              {this.renderCloseButton()}
            </View>

            <View>
              <SelectorList
                disabledItemStyle={this.props.disabledItemStyle}
                itemHeight={this.props.itemHeight}
                itemStyle={this.props.itemStyle}
                itemTextStyle={this.props.itemTextStyle}
                items={this.props.items}
                onSelectChange={this.chooseItem}
                selectedItemStyle={this.props.selectedItemStyle}
                selectedItemTextStyle={this.props.selectedItemTextStyle}
                selectedValue={this.state.selectedValue}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  private readonly openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  private readonly closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  private readonly chooseItem = (value: string) => () => {
    this.setState({
      selectedValue: value,
    });
    this.closeModal();
    if (this.props.onValueChange) {
      this.props.onValueChange(value);
    }
  };

  public render(): JSX.Element {
    return (
      <View style={this.props.style}>
        {this.renderSelector()}
        {this.renderModal()}
      </View>
    );
  }
}
