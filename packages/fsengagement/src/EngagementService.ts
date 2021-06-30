import FCM, { FCMEvent } from 'react-native-fcm';
import AsyncStorage from '@react-native-community/async-storage';
import FSNetwork from '@brandingbrand/fsnetwork';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import {
  EngagementMessage,
  EngagementProfile,
  EngagmentEvent,
  EngagmentNotification
} from './types';
const uuid = require('uuid-js');

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
  messageCache: number = 0;
  cacheTTL: number = 1000 * 60 * 10;

  constructor(config: EngagementServiceConfig) {
    this.appId = config.appId;
    if (typeof config.cacheTTL === 'number') {
      this.cacheTTL = config.cacheTTL;
    }

    this.networkClient = new FSNetwork({
      baseURL: config.baseURL,
      headers: {
        apikey: config.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  logEvent(type: string, data: any): void {
    const event = {
      type,
      id: uuid.create().toString(),
      data: JSON.stringify(data),
      fired: new Date()
    };
    this.events.push(event);

    if (this.profileId) {
      // @TODO: can throttle here to save up events and send all at a threshold

      this.networkClient.post(`/Profiles/${this.profileId}/trackEvents`, {
        events: this.events
      })
        .then((response: any) => {
          // clear the event queue on successful submit
          if (response.status === 204) {
            this.events = [];
          }
        })
        .catch((e: any) => console.warn('Unable to log events', e));
    }
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

  setNotification(): void {
    // debugging local notifications
    // FCM.cancelAllLocalNotifications()
    // FCM.getScheduledLocalNotifications()
    //  .then(notif => console.log('scheduled local push notifications', notif));

    // get and store push token if available
    FCM.getFCMToken()
      .then(token => this.setPushToken(token))
      .catch(e => console.log('getFCMToken error: ', e));

    FCM.on(FCMEvent.RefreshToken, token => this.setPushToken(token));
    // listen to notifications and handle them
    FCM.on(FCMEvent.Notification, this.onNotification.bind(this));
    // check if the app was opened from a notification and log it
    // @TODO: follow the notifications link?
    FCM.getInitialNotification()
      .then(notif => {
        if (notif && notif.messageId) {
          this.logEvent('pushopen', { message: notif.messageId });
        }
      })
      .catch();
  }

  // @TODO: does the profile need to be resynced anytime during a session?
  async getProfile(accountId?: string, forceProfileSync?: boolean): Promise<string> {
    if (this.profileId && this.profileData && !forceProfileSync) {
      return Promise.resolve(this.profileId);
    }

    const savedProfileId = await AsyncStorage.getItem('ENGAGEMENT_PROFILE_ID');
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

        AsyncStorage.setItem('ENGAGEMENT_PROFILE_ID', data.id).catch();

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

  async requestPushPermissions(): Promise<void> {
    return FCM.requestPermissions();
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

  async onNotification(notif: EngagmentNotification): Promise<void> {
    console.log('onNotification', notif);

    if (notif.local_notification) {
      // this is a local notification
      console.log('got local notification', notif);
    }

    if (notif.opened_from_tray) {
      console.log('notif.opened_from_tray: true');

      // app resumed from push
      if (notif.id) {
        this.logEvent('pushopen', {
          notificationId: notif.id,
          messageId: notif.messageId
        });
      }

      // app was backgrounded and now foregrounded
    } else {
      console.log('notif.opened_from_tray: false');
      // app was open while the message came in

      if (notif.future && notif.on && notif.title && notif.body && notif.messageId) {
        const fireDate = new Date(parseInt(notif.on, 10));
        FCM.scheduleLocalNotification({
          fire_date: fireDate.getTime(),
          id: notif.messageId,
          body: notif.body,
          title: notif.title,
          messageId: notif.messageId,
          show_in_foreground: true
        });
        console.log('schedule local notif', fireDate);
      } else {
        if (notif.id) {
          this.logEvent('pushreceive', {
            notificationId: notif.id,
            messageId: notif.messageId
          });
        }
      }
    }
  }
}

