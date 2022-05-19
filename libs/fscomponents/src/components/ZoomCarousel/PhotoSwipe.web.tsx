import React, { PureComponent } from 'react';

// @ts-expect-error TODO: Update photoswipe to support typing
import Photoswipe from 'photoswipe';
// @ts-expect-error TODO: Update photoswipe to support typing
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';

import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Modal } from '../Modal';

import { get } from 'lodash-es';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const componentTranslationKeys = translationKeys.flagship.zoomCarousel;

const events = [
  'beforeChange',
  'afterChange',
  'imageLoadComplete',
  'resize',
  'gettingData',
  'mouseUsed',
  'initialZoomIn',
  'initialZoomInEnd',
  'initialZoomOut',
  'initialZoomOutEnd',
  'parseVerticalMargin',
  'close',
  'unbindEvents',
  'destroy',
  'updateScrollOffset',
  'preventDragEvent',
  'shareLinkClick',
];

export interface PhotoSwipeProps {
  isOpen: boolean;
  items: Array<{ src: unknown; w: number; h: number }>;
  options?: unknown;
  onClose?: () => void;
  beforeChange?: (instance: unknown) => void;
  afterChange?: (instance: unknown) => void;
  imageLoadComplete?: (instance: unknown) => void;
  resize?: (instance: unknown) => void;
  gettingData?: (instance: unknown) => void;
  mouseUsed?: (instance: unknown) => void;
  initialZoomIn?: (instance: unknown) => void;
  initialZoomInEnd?: (instance: unknown) => void;
  initialZoomOut?: (instance: unknown) => void;
  initialZoomOutEnd?: (instance: unknown) => void;
  parseVerticalMargin?: (instance: unknown) => void;
  close?: (instance: unknown) => void;
  unbindEvents?: (instance: unknown) => void;
  destroy?: (instance: unknown) => void;
  updateScrollOffset?: (instance: unknown) => void;
  preventDragEvent?: (instance: unknown) => void;
  shareLinkClick?: (instance: unknown) => void;
}

export class PhotoSwipe extends PureComponent<PhotoSwipeProps> {
  private photoSwipe: Photoswipe;
  private pswpElement: unknown;

  private readonly openPhotoSwipe = (props: PhotoSwipeProps) => {
    const { items, options } = props;

    this.photoSwipe = new Photoswipe(this.pswpElement, PhotoswipeUIDefault, items, options);

    for (const event of events) {
      const callback = get(props, event);
      if (callback || event === 'destroy') {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.photoSwipe.listen(event, function (...args: unknown[]): void {
          if (callback) {
            // @ts-expect-error: TODO how to handle this in typescript

            args.unshift(this);
            callback(...args);
          }
          if (event === 'destroy') {
            self.handleClose();
          }
        });
      }
    }

    this.photoSwipe.init();
  };

  private readonly closePhotoSwipe = () => {
    if (!this.photoSwipe) {
      return;
    }

    this.photoSwipe.close();
  };

  private readonly handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  public componentDidMount(): void {
    if (this.props.isOpen) {
      this.openPhotoSwipe(this.props);
    }
  }

  public componentDidUpdate(prevProps: PhotoSwipeProps): void {
    if (prevProps.isOpen && !this.props.isOpen) {
      this.closePhotoSwipe();
    } else if (!prevProps.isOpen && this.props.isOpen) {
      requestAnimationFrame(() => {
        this.openPhotoSwipe(this.props);
      });
    }
  }

  public componentWillUnmount(): void {
    this.closePhotoSwipe();
  }

  public render(): JSX.Element {
    return (
      <Modal transparent visible={this.props.isOpen}>
        <div
          aria-hidden="true"
          className="pswp"
          ref={(node) => {
            this.pswpElement = node;
          }}
          role="dialog"
          tabIndex={-1}
        >
          <div className="pswp__bg" />
          <div className="pswp__scroll-wrap">
            <div className="pswp__container">
              <div className="pswp__item" />
              <div className="pswp__item" />
              <div className="pswp__item" />
            </div>
            <div className="pswp__ui pswp__ui--hidden">
              <div className="pswp__top-bar">
                <div className="pswp__counter" />
                <button
                  className="pswp__button pswp__button--close"
                  title={FSI18n.string(componentTranslationKeys.actions.close.actionBtn)}
                />
                <button
                  className="pswp__button pswp__button--share"
                  title={FSI18n.string(componentTranslationKeys.actions.share.actionBtn)}
                />
                <button
                  className="pswp__button pswp__button--fs"
                  title={FSI18n.string(componentTranslationKeys.actions.fullscreen.actionBtn)}
                />
                <button
                  className="pswp__button pswp__button--zoom"
                  title={FSI18n.string(componentTranslationKeys.actions.zoom.actionBtn)}
                />
                <div className="pswp__preloader">
                  <div className="pswp__preloader__icn">
                    <div className="pswp__preloader__cut">
                      <div className="pswp__preloader__donut" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div className="pswp__share-tooltip" />
              </div>
              <button
                className="pswp__button pswp__button--arrow--left"
                title={FSI18n.string(componentTranslationKeys.actions.prev.actionBtn)}
              />
              <button
                className="pswp__button pswp__button--arrow--right"
                title={FSI18n.string(componentTranslationKeys.actions.next.actionBtn)}
              />
              <div className="pswp__caption">
                <div className="pswp__caption__center" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
