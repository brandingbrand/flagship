import React, { PureComponent } from 'react';
// @ts-ignore TODO: Update photoswipe to support typing
import Photoswipe from 'photoswipe';
// @ts-ignore TODO: Update photoswipe to support typing
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
// tslint:enable
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
  items: { src: any; w: number; h: number }[];
  options?: any;
  onClose?: () => void;
  beforeChange?: (instance: any) => void;
  afterChange?: (instance: any) => void;
  imageLoadComplete?: (instance: any) => void;
  resize?: (instance: any) => void;
  gettingData?: (instance: any) => void;
  mouseUsed?: (instance: any) => void;
  initialZoomIn?: (instance: any) => void;
  initialZoomInEnd?: (instance: any) => void;
  initialZoomOut?: (instance: any) => void;
  initialZoomOutEnd?: (instance: any) => void;
  parseVerticalMargin?: (instance: any) => void;
  close?: (instance: any) => void;
  unbindEvents?: (instance: any) => void;
  destroy?: (instance: any) => void;
  updateScrollOffset?: (instance: any) => void;
  preventDragEvent?: (instance: any) => void;
  shareLinkClick?: (instance: any) => void;
}

export class PhotoSwipe extends PureComponent<PhotoSwipeProps> {
  photoSwipe: any;
  pswpElement: any;

  componentDidMount(): void {
    if (this.props.isOpen) {
      this.openPhotoSwipe(this.props);
    }
  }

  componentDidUpdate(prevProps: PhotoSwipeProps): void {
    if (prevProps.isOpen && !this.props.isOpen) {
      this.closePhotoSwipe();
    } else if (!prevProps.isOpen && this.props.isOpen) {
      requestAnimationFrame(() => {
        this.openPhotoSwipe(this.props);
      });
    }
  }

  componentWillUnmount(): void {
    this.closePhotoSwipe();
  }

  openPhotoSwipe = (props: PhotoSwipeProps) => {
    const { items, options } = props;

    this.photoSwipe = new Photoswipe(this.pswpElement, PhotoswipeUIDefault, items, options);

    events.forEach((event: any) => {
      const callback = get(props, event);
      if (callback || event === 'destroy') {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.photoSwipe.listen(event, function (...args: any[]): void {
          if (callback) {
            // @ts-ignore: TODO how to handle this in typescript
            // eslint-disable-next-line no-invalid-this
            args.unshift(this);
            callback(...args);
          }
          if (event === 'destroy') {
            self.handleClose();
          }
        });
      }
    });

    this.photoSwipe.init();
  };

  closePhotoSwipe = () => {
    if (!this.photoSwipe) {
      return;
    }

    this.photoSwipe.close();
  };

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render(): JSX.Element {
    return (
      <Modal visible={this.props.isOpen} transparent={true}>
        <div
          className={`pswp`}
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
          ref={(node) => {
            this.pswpElement = node;
          }}
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
