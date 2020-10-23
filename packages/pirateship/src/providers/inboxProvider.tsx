import { fetchEngagementInbox, InboxFetch } from '../lib/engagement';
import { INBOX_LOADED, INBOX_LOADING, INBOX_LOADING_ERROR } from '../lib/constants';

export function fetchInbox(dispatch: React.Dispatch<any>):
  (accountData: InboxFetch, initialLoad: boolean) => void {
  return (accountData: InboxFetch, initialLoad: boolean) => {
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
