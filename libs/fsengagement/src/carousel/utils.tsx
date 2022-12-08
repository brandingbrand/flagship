import React from 'react';

import layoutComponents from '../inboxblocks';

export const renderBlock = (item: any): React.ReactElement | null => {
  const { private_blocks, private_type, spaceBetween, ...restProps } = item;

  const component = layoutComponents[private_type];
  if (!component) {
    return null;
  }

  return React.createElement(
    component,
    {
      ...restProps,
    },
    private_blocks && private_blocks.map(renderBlock)
  );
};
