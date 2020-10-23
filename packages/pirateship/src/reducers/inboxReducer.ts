import { INBOX_LOADED, INBOX_LOADING, INBOX_LOADING_ERROR } from '../lib/constants';
import { DiscoveryMessage } from '../lib/engagement';

const INITIAL_STATE: InboxStore = {
  loading: false,
  value: []
};

export interface InboxStore {
  loading: boolean;
  value: DiscoveryMessage[];
}

export interface InboxAction extends InboxStore {
  type: 'INBOX_LOADED' | 'INBOX_LOADING' | 'INBOX_LOADING_ERROR';
}

export default function inboxReducer(
  inboxStore: InboxStore = INITIAL_STATE,
  action: InboxAction
): InboxStore {
  switch (action.type) {
    case INBOX_LOADED: {
      return {
        ...inboxStore,
        loading: false,
        value: action.value
      };
    }
    case INBOX_LOADING: {
      return {
        ...inboxStore,
        loading: true
      };
    }
    case INBOX_LOADING_ERROR: {
      return {
        ...inboxStore,
        loading: false
      };
    }
    default: {
      return inboxStore;
    }
  }
}
