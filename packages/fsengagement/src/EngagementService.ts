import AsyncStorage from '@react-native-community/async-storage';
import FSNetwork from '@brandingbrand/fsnetwork';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import {
  AppSettings,
  EngagementMessage,
  EngagementProfile,
  EngagmentEvent
} from './types';

export interface EngagementServiceConfig {
  appId: string;
  apiKey: string;
  baseURL: string;
  cacheTTL?: number; // default = 10 mins
}
export interface Segment {
  id: number;
  name: string;
  attributes?: string[];
}
export interface Attribute {
  key: string;
  value: string;
}
export interface AttributePayload {
  attributes: string;
}

export class EngagementService {
  appId: string;
  networkClient: FSNetwork;
  events: EngagmentEvent[] = [];
  profileId?: string;
  profileData?: EngagementProfile;
  messages: EngagementMessage[] = [];
  environment?: string;
  messageCache: number = 0;
  cacheTTL: number = 1000 * 60 * 10;

  constructor(config: EngagementServiceConfig) {
    this.appId = config.appId;
    if (typeof config.cacheTTL === 'number') {
      this.cacheTTL = config.cacheTTL;
    }
    this.environment = ~config.baseURL.indexOf('uat') ? 'UAT' : 'PROD';
    this.networkClient = new FSNetwork({
      baseURL: config.baseURL,
      headers: {
        apikey: config.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async setProfileAttributes(attributes: Attribute[]): Promise<boolean> {
    return this.networkClient
      .post(`/Profiles/${this.profileId}/setAttributes`, JSON.stringify(attributes))
      .then((response: any) => {
        if (response.status === 204) {
          return true;
        }
        return false;
      })
      .catch((e: any) => {
        console.warn('Unable to set profile attribute', e);
        return false;
      });
  }

  async setProfileAttribute(key: string, value: string): Promise<boolean> {
    const data = {
      key,
      value,
      appId: this.appId
    };

    return this.networkClient
      .post(`/Profiles/${this.profileId}/setAttribute`, data)
      .then((response: any) => {
        if (response.status === 204) {
          return true;
        }
        return false;
      })
      .catch((e: any) => {
        console.warn('Unable to set profile attribute', e);
        return false;
      });
  }

  // @TODO: does the profile need to be resynced anytime during a session?
  async getProfile(accountId?: string, forceProfileSync?: boolean): Promise<string> {
    if (this.profileId && this.profileData && !forceProfileSync) {
      return Promise.resolve(this.profileId);
    }

    const savedProfileId =
      await AsyncStorage.getItem(`ENGAGEMENT_PROFILE_ID_${this.environment}_${this.appId}`);

    if (savedProfileId && typeof savedProfileId === 'string' && !forceProfileSync) {
      this.profileId = savedProfileId;
      return Promise.resolve(savedProfileId);
    }
    const profileInfo: any = {
      accountId,
      locale: RNLocalize.getLocales() && RNLocalize.getLocales().length &&
        RNLocalize.getLocales()[0].languageTag,
      country: RNLocalize.getCountry(),
      timezone: RNLocalize.getTimeZone(),
      deviceIdentifier: DeviceInfo.getUniqueId(),
      deviceInfo: JSON.stringify({
        model: DeviceInfo.getModel(),
        appName: DeviceInfo.getBundleId(),
        appVersion: DeviceInfo.getReadableVersion(),
        osName: DeviceInfo.getSystemName(),
        osVersion: DeviceInfo.getSystemVersion()
      })
    };
    return this.networkClient.post(`/App/${this.appId}/getProfile`, profileInfo)
      .then((r: any) => r.data)
      .then((data: any) => {
        this.profileId = data.id;
        this.profileData = data;

        AsyncStorage
          .setItem(`ENGAGEMENT_PROFILE_ID_${this.environment}_${this.appId}`, data.id).catch();

        return data.id;
      })
      .catch((e: any) => {
        console.log(e.response);
        console.error(e);
      });
  }

  async getSegments(attribute?: string): Promise<Segment[]> {
    return this.networkClient.get(`/App/${this.appId}/getSegments`, {
      params: {
        attribute
      }
    })
      .then(r => r.data)
      .catch((e: any) => {
        console.log(e.response);
        console.error(e);
      });
  }


  async setPushToken(pushToken: string): Promise<any> {
    const uniqueId = DeviceInfo.getUniqueId();
    const device = this.profileData && this.profileData.devices &&
      this.profileData.devices[uniqueId];
    if (device) {
      if (!device.pushToken || device.pushToken !== pushToken) {
        this.networkClient
          .patch(`/Devices/${device.id}`, { pushToken })
          .catch((e: any) => console.log('failed to set push token', e));
      }
    }
  }

  /**
   * Get inbox messages for the current user
   * @returns {EngagementMessage[]} inbox messages
   */
  async getMessages(): Promise<EngagementMessage[]> {
    // check we have a user profile
    if (!this.profileId) {
      throw new Error('Profile not loaded.');
    }

    // cache
    if (this.messages.length) {
      if (+new Date() - this.messageCache < this.cacheTTL) {

        return Promise.resolve(this.messages);
      }
    }

    return this.networkClient.get(`/PublishedMessages/getForProfile/${this.profileId}`)
      .then((r: any) => r.data)
      .then((list: any) => list.map((data: any) => ({
        id: data.id,
        published: new Date(data.published),
        message: JSON.parse(data.message),
        title: data.title,
        inbox: data.inbox,
        attributes: data.attributes
      })))
      .then((messages: EngagementMessage[]) => {
        this.messages = messages;
        this.messageCache = +new Date();
        return messages;
      })
      .catch(async (e: any) => {
        console.log('Unable to fetch inbox messages', e);

        let ret: EngagementMessage[] = [];

        // respond with stale cache if we have it
        if (this.messages.length) {
          ret = this.messages;
        }

        return Promise.resolve(ret);
      });
  }

  async getInboxMessages(attributes?: AttributePayload): Promise<EngagementMessage[]> {
    // check we have a user profile
    if (!this.profileId) {
      throw new Error('Profile not loaded.');
    }

    // cache
    if (this.messages.length) {
      if (+new Date() - this.messageCache < this.cacheTTL) {

        return Promise.resolve(this.messages);
      }
    }

    const lastEngagementFetch = await AsyncStorage.getItem('LAST_ENGAGEMENT_FETCH');
    return this.networkClient.post(`/PublishedMessages/getInboxForProfile/${this.profileId}`,
      JSON.stringify(attributes))
      .then((r: any) => r.data)
      .then((list: any) => list.map((data: any) => {
        return {
          id: data.id,
          published: new Date(data.published),
          isNew: lastEngagementFetch ?
            Date.parse(data.published) > parseInt(lastEngagementFetch, 10) : false,
          message: JSON.parse(data.message),
          title: data.title,
          inbox: data.inbox,
          attributes: data.attributes
        };
      }))
      .then((messages: EngagementMessage[]) => {
        this.messages = messages;
        this.messageCache = +new Date();
        AsyncStorage.setItem('LAST_ENGAGEMENT_FETCH', Date.now().toString())
          .catch();
        return messages;
      })
      .catch(async (e: any) => {
        console.log('Unable to fetch inbox messages', e);

        let ret: EngagementMessage[] = [];

        // respond with stale cache if we have it
        if (this.messages.length) {
          ret = this.messages;
        }

        return Promise.resolve(ret);
      });
  }

  /**
   * Accepts array of inbox messages
   * Fetches sort order array (stored in app settings)
   * @param {EngagementMessage[]} messages inbox messages to sort
   * @returns {EngagementMessage[]} sorted inbox messages
   */
  async sortInbox(
    messages: EngagementMessage[]
  ): Promise<EngagementMessage[]> {

    const order =
      await this.networkClient.get(`/App/${this.appId}/getAppSettings`)
    .then((r: any) => r.data)
    .then((settings: AppSettings) => settings && settings.sort);

    if (!order || !Array.isArray(order)) {
      return messages;
    }

    // recently live - not yet sorted messages (they go at the top)
    const liveNew = messages.filter((msg: EngagementMessage) => order.indexOf(msg.id) === -1);
    const liveSort = messages.filter((msg: EngagementMessage) => order.indexOf(msg.id) > -1);
    // sort the rest based on the sort array from `getAppSettings` (new core feature)
    const sortedLive = liveSort.sort((a: EngagementMessage, b: EngagementMessage) => {
      const A = a.id;
      const B = b.id;
      if (
        order.indexOf(A) < order.indexOf(B) ||
        order.indexOf(A) === -1 ||
        order.indexOf(B) === -1
      ) {
        return -1;
      } else {
        return 1;
      }
    });
    const sortedAll = [...liveNew, ...sortedLive];

    const pinnedTopIndexes: number[] = [];
    const pinnedBottomIndexes: number[] = [];

    const pinnedTop = sortedAll.filter((msg, idx) => {
      if (msg.message && msg.message.content && msg.message.content.pin &&
        msg.message.content.pin === 'top') {
        pinnedTopIndexes.push(idx);
        return true;
      }
      return false;
    });
    for (let i = pinnedTopIndexes.length - 1; i >= 0; i--) {
      sortedAll.splice(pinnedTopIndexes[i], 1);
    }

    const pinnedBottom = sortedAll.filter((msg, idx) => {
      if (msg.message && msg.message.content && msg.message.content.pin &&
        msg.message.content.pin === 'bottom') {
        pinnedBottomIndexes.push(idx);
        return true;
      }
      return false;
    });
    for (let idx = pinnedBottomIndexes.length - 1; idx >= 0; idx--) {
      sortedAll.splice(pinnedBottomIndexes[idx], 1);
    }

    return [...pinnedTop, ...sortedAll, ...pinnedBottom];
  }

  async getInboxBySegment(
    segmentId: number | string,
    segmentOnly?: boolean
  ): Promise<EngagementMessage[]> {
    return this.networkClient.post(`/App/${this.appId}/getInboxBySegment/${segmentId}`, {
      segmentOnly
    })
      .then((r: any) => r.data)
      .then((list: any) => list.map((data: any) => {
        return {
          id: data.id,
          published: new Date(data.published),
          message: JSON.parse(data.message),
          title: data.title,
          inbox: data.inbox,
          attributes: data.attributes
        };
      }))
      .then((messages: EngagementMessage[]) => {
        this.messages = messages;
        this.messageCache = +new Date();
        return messages;
      })
      .catch(async (e: any) => {
        console.log('Unable to fetch inbox messages', e);
        let ret: EngagementMessage[] = [];
        // respond with stale cache if we have it
        if (this.messages.length) {
          ret = this.messages;
        }
        return Promise.resolve(ret);
      });
  }
}
