/* tslint:disable */
// TODO: add proper types
import React, { Component, ComponentType } from 'react';
import { Dictionary } from '@brandingbrand/fsfoundation';

export interface ProjectWrapperComponent {}

/**
 * wrapp the component with high order component to support
 * component default props, it can be used to specify project
 * specific styling
 */
export default function applyDefaults<T>(
  defaultProps: Dictionary,
  ComponentHolder: ComponentType<T>
): ProjectWrapperComponent {
  if (isStateless(ComponentHolder)) {
    return function ProjectWrapperComponent(props: T): React.ReactElement {
      const mergedProps = mergeProps(defaultProps, props);
      return <ComponentHolder {...mergedProps} />;
    };
  } else {
    // this is not elegant, the wrapper component is masking the origin component,
    // which makes the origin component method not accessible from ref. So we have
    // to create the same method in the wrapper component that delegate to the origin
    // component. But luckily, there is not too much of these methods.
    return class ProjectWrapperComponent extends Component {
      comp: any;

      setValue = (v: any) => {
        if (this.comp.setValue) {
          this.comp.setValue(v);
        }
      };
      extratRef = (comp: any) => (this.comp = comp);
      render() {
        const mergedProps = mergeProps(defaultProps, this.props);
        return <ComponentHolder ref={this.extratRef} {...mergedProps} />;
      }
    };
  }
}

/**
 * merge new props to default props,
 * if the default prop is array or object, merge them
 * or override default
 */
export function mergeProps(defaultProps: any, newProps: any) {
  if (!defaultProps) {
    return newProps;
  }

  const props = { ...defaultProps };

  Object.keys(newProps).forEach(key => {
    const val = newProps[key];

    if (props[key]) {
      // if default props is array, insert the new prop
      if (Array.isArray(props[key])) {
        if (Array.isArray(val)) {
          props[key] = [...props[key], ...val];
        } else {
          props[key] = [...props[key], val];
        }
      } else if (
        typeof props[key] === 'object' &&
        !React.isValidElement(props[key])
      ) {
        // if default props is plan object (not react element), merge
        if (typeof val === 'object') {
          props[key] = { ...props[key], ...val };
        } else if (typeof val === 'number') {
          // heuristic: if default prop is an object, and
          // override prop is a number (by StyleSheet.create),
          // it must be style, so we put them into an array.
          props[key] = [props[key], val];
        }
      } else {
        // otherwise, override
        props[key] = val;
      }
    } else {
      props[key] = val;
    }
  });

  return props;
}

export function isStateless<T>(Component: ComponentType<T>) {
  return !Component.prototype.render;
}
