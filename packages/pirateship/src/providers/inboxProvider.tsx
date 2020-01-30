import { fetchEngagementInbox } from '../lib/engagement';
import { INBOX_LOADED, INBOX_LOADING, INBOX_LOADING_ERROR } from '../lib/constants';

export function fetchInbox(dispatch: any): (accountData: any, initialLoad: boolean) => void {
  return (accountData: any, initialLoad: boolean) => {
    if (!initialLoad) {
      dispatch({ type: INBOX_LOADING });
    }
    fetchEngagementInbox(accountData)
      .then(inboxResult => dispatch({
        type: INBOX_LOADED,
        value: inboxResult
      }))
      .catch(e => {
        dispatch({ type: INBOX_LOADING_ERROR });
      });
  };
}
