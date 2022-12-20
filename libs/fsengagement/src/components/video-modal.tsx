import React from 'react';

import { makeModal } from '@brandingbrand/fsapp';

import type { VideoModalProps } from './VideoModalComponent';
import { VideoModalComponent } from './VideoModalComponent';

type Props = Pick<VideoModalProps, 'video'>;

export const VideoModal = makeModal<string, Props>(({ reject, resolve, ...props }) => (
  <VideoModalComponent onCancel={reject} {...props} />
));
