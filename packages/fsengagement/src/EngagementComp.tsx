// tslint:disable:jsx-use-translation-function

import React, { Component, ComponentClass, Fragment, ReactElement } from 'react';
import { EngagementService } from './EngagementService';
import { ComponentList, EngagementMessage, InboxBlock } from './types';

export interface EngagementScreenProps {
  clickHandler: (id: string, story?: any) => void;
  story?: InboxBlock;
}

export default function(
  api: EngagementService,
  layoutComponents: ComponentList
): ComponentClass<EngagementScreenProps> {
  return class EngagementComp extends Component<EngagementScreenProps> {
    clickHandler: (id: string, story?: any) => void;
    state: {
      messages: EngagementMessage[];
      story?: InboxBlock;
    } = {
      messages: []
    };

    constructor(props: EngagementScreenProps) {
      super(props);

      this.clickHandler = (messageId: string, story?: any): void => {
        api.logEvent('ClickInboxMessage', {
          messageId
        });

        this.props.clickHandler(messageId, {messageId, ...story});
      };
    }

    renderBlock = (id: string, item: InboxBlock): ReactElement<any> | undefined => {
      const comps: ComponentList = layoutComponents;
      const comp: ComponentClass<any> = comps[item.private_type];

      if (!comp) {
        console.log(item.private_type + ' Component not found');
        return;
      }

      return React.createElement(
        comp,
        {
          // props
          ...item,
          // InjectedProps
          messageId: id,
          clickHandler: this.clickHandler,
          key: Math.floor(Math.random() * 1000000)
        },
        item.private_blocks && item.private_blocks.map(b => this.renderBlock(id, b))
      );
    }

    componentDidMount(): void {
      if (this.props.story) {
        console.log('setting story to ', this.props.story);
        this.setState({
          story: this.props.story
        });
        return;
      }

      api.getMessages()
        .then(messages => {
          if (messages) {
            this.setState({
              messages
            });
          }
        })
        .catch();
    }

    render(): JSX.Element {
      const { story, messages } = this.state;

      if (story) {
        return (
          <Fragment>
            {this.renderBlock(story.messageId, story)}
          </Fragment>
        );
      }

      return (
        <Fragment>
          {messages.map(msg => this.renderBlock(msg.id, msg.message))}
        </Fragment>
      );
    }
  };
}
