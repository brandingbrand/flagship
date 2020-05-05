/* tslint:disable:jsx-use-translation-function */

import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { UPSAddressDataSource } from '@brandingbrand/fsups';
import { env as projectEnv } from '@brandingbrand/fsapp';
import {AddressTypeValidation} from '@brandingbrand/fscommerce';

const styles = StyleSheet.create({
  label: {
    fontSize: 10
  },
  input: {
    borderColor: 'black',
    borderWidth: 1
  },
  resultHeader: {
    marginTop: 20
  }
});

interface UPSAddressExampleState {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  results: AddressTypeValidation | null | {
    error: Error;
  };
}

export default class UPSAddressExample
  extends Component<UPSAddressExample, UPSAddressExampleState> {
  client: UPSAddressDataSource | null = null;
  constructor(props: UPSAddressExample) {
    super(props);
    this.client = new UPSAddressDataSource({
      baseURL: projectEnv.ups.baseURL,
      licenseNumber: projectEnv.ups.licenseNumber,
      password: projectEnv.ups.password,
      username: projectEnv.ups.username
    });
    this.state = {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      results: null
    };
  }
  render(): JSX.Element {
    return (
      <ScrollView>
        <Text style={styles.label}>
          Address Line 1
        </Text>
        <TextInput
          autoCapitalize='none'
          style={styles.input}
          onChangeText={this.setAddressLine1}
        />
        <Text style={styles.label}>
          Address Line 2
        </Text>
        <TextInput
          autoCapitalize='none'
          style={styles.input}
          onChangeText={this.setAddressLine2}
        />
        <Text style={styles.label}>
          City
        </Text>
        <TextInput
          autoCapitalize='none'
          style={styles.input}
          onChangeText={this.setCity}
        />
        <Text style={styles.label}>
          State
        </Text>
        <TextInput
          autoCapitalize='none'
          style={styles.input}
          onChangeText={this.setStateState}
        />
        <Text style={styles.label}>
          Zip
        </Text>
        <TextInput
          autoCapitalize='none'
          style={styles.input}
          onChangeText={this.setZip}
        />
        <Button onPress={this.validateAddress} title='validate' />

        <Text style={styles.resultHeader}>
          Results
        </Text>
        <Text>
          {this.renderResults()}
        </Text>
      </ScrollView>

    );
  }
  renderResults = () => {
    if (!this.state.results) {
      return null;
    }

    return <Text>{JSON.stringify(this.state.results, null, 2)}</Text>;
  }
  validateAddress = () => {
    const address = {
      address1: this.state.addressLine1,
      address2: this.state.addressLine2,
      locality: this.state.city,
      adminDistrict: this.state.state,
      postalCode: this.state.zip,
      country: 'US'
    };
    if (this.client) {
      this.client.verifyAddress(address)
        .then((results: AddressTypeValidation) => {
          console.log(results);
          this.setState({ results });
        })
        .catch((e: Error) => {
          console.log(e);
          this.setState({ results: { error: e } });
        });
    }
  }
  setAddressLine1 = (value: string) => {
    this.setState({ addressLine1: value });
  }
  setAddressLine2 = (value: string) => {
    this.setState({ addressLine2: value });
  }
  setCity = (value: string) => {
    this.setState({ city: value });
  }
  setStateState = (value: string) => {
    this.setState({ state: value });
  }
  setZip = (value: string) => {
    this.setState({ zip: value });
  }
}
