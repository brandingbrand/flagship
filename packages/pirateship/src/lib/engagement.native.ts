import { env } from '@brandingbrand/fsapp';
import fsengagement, { EngagementMessage } from '@brandingbrand/fsengagement';

const { engagement: {
  appId, apiKey, baseURL, cacheTTL
} } = env;

export const { engagementService, EngagementComp } = fsengagement({
  appId,
  apiKey,
  baseURL,
  cacheTTL
});

export interface InboxFetch {
  login?: string;
}

export type DiscoveryMessage = EngagementMessage['message'];

// ============ fetchInbox ============ //
// returns array of inbox message from engagement server
export async function fetchEngagementInbox(
  userInfo: InboxFetch
): Promise<DiscoveryMessage[]> {
  await engagementService.getProfile(userInfo.login);

  const inboxResponse = await engagementService.getMessages();
  return inboxResponse.map(inboxMessage => inboxMessage.message);
}
