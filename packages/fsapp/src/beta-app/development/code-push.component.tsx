/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development

import React, { Component } from 'react';
import {
  Button,
  FlatList,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FSNetwork from '@brandingbrand/fsnetwork';

import NativeConstants from '../../lib/native-constants';

const { CodePush } = NativeModules;

export interface SwimLane {
  name: string;
  key: string;
  label: string;
}

export interface Release {
  target_binary_range: string;
  description: string;
  is_disabled: boolean;
  is_mandatory: boolean;
  rollout: number;
  label: string;
  package_hash: string;
  blob_url: string;
  diff_package_map: any;
  original_deployment: string;
  original_label: string;
  released_by: string;
  release_method: string;
  size: number;
  upload_time: number;
  message?: string;
}

export interface CodePushDevMenuStateTypes {
  swimLane?: SwimLane;
  swimLanes?: SwimLane[];
  config: {
    name: string;
    appKey: string;
    deploymentKey: string;
  };
  view: string;
  version: string;
  releases?: Release[];
  release?: Release;
  currentVersion?: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  item: {
    paddingLeft: 10,
    fontSize: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  pageTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 20
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  column: {
    flex: 1
  },
  currentRelease: {
    textAlign: 'center',
    marginTop: -20
  }
});

export default class CodePushDevMenu extends Component<{}, CodePushDevMenuStateTypes> {
  client?: FSNetwork;

  constructor(props: {}) {
    super(props);

    if (!NativeConstants.AppCenterToken) {
      return;
    }

    this.client = new FSNetwork({
      headers: {
        'X-API-Token': NativeConstants.AppCenterToken
      }
    });

    this.state = {
      view: '',
      config: {} as any,
      version: ''
    };

    this.client
      .get(`https://api.appcenter.ms/v0.1/apps/${this.state.config.name}/deployments`)
      .then((result: any) => {
        this.setState({
          view: 'swimLanes',
          swimLanes: result.data
        });
      })
      .catch((e: any) => console.warn(e, e.response));

    if (CodePush) {
      CodePush.getUpdateMetadata(CodePush.codePushUpdateStateRunning).then((version: string) => {
        this.setState({ currentVersion: version });
      });
    }
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      version: DeviceInfo.getVersion()
    });
  }

  render(): JSX.Element {
    if (!NativeConstants.AppCenterToken) {
      return <Text>Native build does not include CodePush support.</Text>;
    }

    let view;
    switch (this.state.view) {
      case 'swimLanes':
        view = this.renderSwimLanes();
        break;

      case 'swimLane':
        view = this.renderSwimLane();
        break;

      case 'release':
        view = this.renderRelease();
        break;

      default:
        view = <Text>Loading...</Text>;
    }

    return <View>{view}</View>;
  }

  renderSwimLanes = () => {
    return (
      <View>
        <Text style={styles.pageTitle}>Select A Lane</Text>

        {this.state.swimLanes && this.state.swimLanes.length ? (
          <FlatList
            style={styles.container}
            data={this.state.swimLanes}
            renderItem={this.renderSwimLaneItem}
          />
        ) : (
          <Text>No lanes setup for app</Text>
        )}

        <Text style={styles.pageTitle}>Current Release</Text>
        <Text style={styles.currentRelease}>
          {this.state.currentVersion ? this.renderCurrentRelease() : 'Bundled'}
        </Text>

        <Text style={styles.pageTitle}>Native App</Text>
        <Text style={styles.currentRelease}>{this.state.version}</Text>
      </View>
    );
  }

  renderCurrentRelease = () => {
    const currentLane =
      this.state.swimLanes &&
      this.state.swimLanes.find(lane => {
        return lane.key === this.state.currentVersion.deploymentKey;
      });

    if (currentLane) {
      return currentLane.name + ' ' + this.state.currentVersion.label;
    } else {
      return '';
    }
  }

  renderSwimLaneItem = ({ item }: { item: SwimLane }): JSX.Element => {
    const {
      config: { deploymentKey }
    } = this.state;

    return (
      <TouchableOpacity key={item.name as any} onPress={this.viewLane(item)}>
        <Text style={[styles.item, item.key === deploymentKey && { fontWeight: 'bold' }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  viewLane = (item: SwimLane): (() => void) => {
    return () => {
      if (!this.client) {
        return;
      }

      const {
        config: { name },
        version
      } = this.state;

      this.setState({
        swimLane: item,
        view: ''
      });

      this.client
        .get(`https://api.appcenter.ms/v0.1/apps/${name}/deployments/${item.name}/releases`)
        .then((r: any) => {
          const releases = r.data
            .filter((item: any) => item.target_binary_range === version)
            .filter((item: any) => item.is_disabled === false)
            .reverse();

          this.setState({
            view: 'swimLane',
            releases
          });
        })
        .catch((e: any) => console.warn(e));
    };
  }

  swimLaneKeyExtractor = (item: Release, index: number): string => {
    return index.toString();
  }

  renderSwimLane = () => {
    if (!this.state.swimLane) {
      return null;
    }

    return (
      <View>
        <TouchableOpacity onPress={this.gotoSwimLanes}>
          <Text style={styles.pageTitle}>{this.state.swimLane.name}</Text>
        </TouchableOpacity>

        {this.state.releases && this.state.releases.length ? (
          <FlatList
            style={styles.container}
            data={this.state.releases}
            keyExtractor={this.swimLaneKeyExtractor}
            renderItem={this.renderReleaseItem}
          />
        ) : (
          <Text>No release in this lane</Text>
        )}
      </View>
    );
  }

  renderReleaseItem = ({ item }: { item: Release }): JSX.Element => {
    let promotionLabel;

    if (item.original_deployment) {
      promotionLabel = `Promoted from ${item.original_deployment} ${item.original_label} On`;
    } else {
      promotionLabel = 'Released on';
    }

    return (
      <TouchableOpacity key={item.label} onPress={this.viewRelease(item)}>
        <Text style={styles.item}>
          <Text style={{ fontWeight: 'bold' }}>{item.label}</Text>
          <Text>{promotionLabel}</Text>
          <Text>{new Date(item.upload_time).toLocaleString()}</Text>
        </Text>
      </TouchableOpacity>
    );
  }

  viewRelease = (item: Release) => {
    return () => {
      this.setState({
        release: item,
        view: 'release'
      });
    };
  }

  renderRelease = () => {
    if (!this.state.release) {
      return null;
    }

    // release will only have message if there has been an error in the Release opject in appcenter;
    // see https://openapi.appcenter.ms/#/codepush/codePushDeploymentReleases_get;
    if (this.state.release.message && this.state.release.message.length) {
      return this.state.release.message;
    }

    return (
      <View>
        <TouchableOpacity onPress={this.gotoSwimLane}>
          <Text style={styles.pageTitle}>
            {this.state.swimLane ? this.state.swimLane.name : ''} - {this.state.release.label}
          </Text>
        </TouchableOpacity>

        <View style={styles.rowContainer}>
          <Text style={styles.column}>Release Date</Text>
          <Text style={styles.column}>
            {new Date(this.state.release.upload_time).toLocaleTimeString()}
          </Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.column}>Description</Text>
          <Text style={styles.column}>{this.state.release.description}</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.column}>Disabled</Text>
          <Text style={styles.column}>{this.state.release.is_disabled ? 'Yes' : 'No'}</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.column}>Mandatory</Text>
          <Text style={styles.column}>{this.state.release.is_mandatory ? 'Yes' : 'No'}</Text>
        </View>

        {this.state.release.original_label ? (
          <View style={styles.rowContainer}>
            <Text style={styles.column}>Original Label</Text>
            <Text style={styles.column}>{this.state.release.original_label}</Text>
          </View>
        ) : null}

        {this.state.release.original_deployment ? (
          <View style={styles.rowContainer}>
            <Text style={styles.column}>Original SwimLane</Text>
            <Text style={styles.column}>{this.state.release.original_deployment}</Text>
          </View>
        ) : null}

        <View style={{ marginTop: 50 }}>
          <Button title={'Use this release'} onPress={this.updateTo(this.state.release)} />
        </View>
      </View>
    );
  }

  updateTo = (release: Release) => {
    return () => {
      const update = {
        downloadUrl: release.blob_url,
        packageHash: release.package_hash,
        label: release.label,
        deploymentKey: this.state.swimLane ? this.state.swimLane.key : '',
        appVersion: release.target_binary_range,
        failedInstall: false,
        isMandatory: false,
        isPending: false,
        packageSize: release.size
      };

      CodePush.downloadUpdate(update, false)
        .then((r: any) => {
          console.log('Downloaded, installing...', r);

          return CodePush.installUpdate(r, CodePush.codePushInstallModeImmediate, 0);
        })
        .then((r: any) => {
          console.log('Installed, verifying...', r);

          return CodePush.getUpdateMetadata(CodePush.codePushUpdateStatePending);
        })
        .then((r: any) => {
          if (r.label === update.label) {
            console.log('Verified!, restarting...', r);
            CodePush.restartApp(false);
          } else {
            console.log('Pending does not match requested?', release, r);
          }
        })
        .catch((e: any) => {
          console.error('codepush error catch', e);
        });
    };
  }

  gotoSwimLanes = () => {
    this.setState({ view: 'swimLanes' });
  }

  gotoSwimLane = () => {
    this.setState({ view: 'swimLane' });
  }
}
