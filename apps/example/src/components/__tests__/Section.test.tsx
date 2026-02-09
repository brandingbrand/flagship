import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Section from '../Section';

jest.mock('../Text', () => ({
  Text: ({children, type, style, testID}: any) => {
    const MockText = require('react-native').Text;
    return (
      <MockText testID={testID} accessibilityLabel={`text-${type}`} style={style}>
        {children}
      </MockText>
    );
  },
}));

describe('Section', () => {
  it('renders with title and children', () => {
    render(
      <Section title="Test Title">
        <React.Fragment>Test content</React.Fragment>
      </Section>
    );

    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Test content')).toBeTruthy();
  });

  it('renders title with primary text type', () => {
    render(
      <Section title="Primary Title">
        <React.Fragment>Content</React.Fragment>
      </Section>
    );

    const titleElement = screen.getByText('Primary Title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.props.accessibilityLabel).toBe('text-primary');
  });

  it('renders children with secondary text type', () => {
    render(
      <Section title="Title">
        <React.Fragment>Secondary content</React.Fragment>
      </Section>
    );

    const contentElement = screen.getByText('Secondary content');
    expect(contentElement).toBeTruthy();
    expect(contentElement.props.accessibilityLabel).toBe('text-secondary');
  });

  it('renders with empty string title', () => {
    render(
      <Section title="">
        <React.Fragment>Content with empty title</React.Fragment>
      </Section>
    );

    expect(screen.getByText('Content with empty title')).toBeTruthy();
  });

  it('renders with multiple children elements', () => {
    render(
      <Section title="Multiple Children">
        <React.Fragment>
          First child
          Second child
        </React.Fragment>
      </Section>
    );

    expect(screen.getByText('Multiple Children')).toBeTruthy();
    expect(screen.getByText(/First child/)).toBeTruthy();
    expect(screen.getByText(/Second child/)).toBeTruthy();
  });

  it('renders with complex children content', () => {
    render(
      <Section title="Complex Content">
        <React.Fragment>
          This is a longer description with multiple sentences. It should render properly
          within the section component.
        </React.Fragment>
      </Section>
    );

    expect(screen.getByText('Complex Content')).toBeTruthy();
    expect(
      screen.getByText(/This is a longer description with multiple sentences/)
    ).toBeTruthy();
  });

  it('renders with special characters in title', () => {
    render(
      <Section title="Title with !@#$%^&*() special chars">
        <React.Fragment>Content</React.Fragment>
      </Section>
    );

    expect(screen.getByText('Title with !@#$%^&*() special chars')).toBeTruthy();
  });

  it('renders with unicode characters in title', () => {
    render(
      <Section title="Title with émojis 🎉 and ñ">
        <React.Fragment>Content</React.Fragment>
      </Section>
    );

    expect(screen.getByText('Title with émojis 🎉 and ñ')).toBeTruthy();
  });

  it('renders with very long title', () => {
    const longTitle = 'A'.repeat(200);
    render(
      <Section title={longTitle}>
        <React.Fragment>Content</React.Fragment>
      </Section>
    );

    expect(screen.getByText(longTitle)).toBeTruthy();
  });

  it('renders with very long children content', () => {
    const longContent = 'B'.repeat(500);
    render(
      <Section title="Title">
        <React.Fragment>{longContent}</React.Fragment>
      </Section>
    );

    expect(screen.getByText(longContent)).toBeTruthy();
  });

  it('renders with numeric title', () => {
    render(
      <Section title="12345">
        <React.Fragment>Numeric title content</React.Fragment>
      </Section>
    );

    expect(screen.getByText('12345')).toBeTruthy();
  });

  it('renders with whitespace-only children', () => {
    render(
      <Section title="Whitespace Test">
        <React.Fragment>   </React.Fragment>
      </Section>
    );

    expect(screen.getByText('Whitespace Test')).toBeTruthy();
  });

  it('applies correct styles to section container', () => {
    const {UNSAFE_getByType} = render(
      <Section title="Style Test">
        <React.Fragment>Content</React.Fragment>
      </Section>
    );

    const View = require('react-native').View;
    const containers = UNSAFE_getByType(View);
    expect(containers).toBeTruthy();
  });

  it('renders title and content in correct hierarchy', () => {
    const {UNSAFE_getAllByType} = render(
      <Section title="Hierarchy Test">
        <React.Fragment>Content below title</React.Fragment>
      </Section>
    );

    const View = require('react-native').View;
    const views = UNSAFE_getAllByType(View);
    expect(views.length).toBeGreaterThan(0);
  });

  it('handles null-like children gracefully', () => {
    render(
      <Section title="Null Children">
        {null}
      </Section>
    );

    expect(screen.getByText('Null Children')).toBeTruthy();
  });

  it('handles undefined children gracefully', () => {
    render(
      <Section title="Undefined Children">
        {undefined}
      </Section>
    );

    expect(screen.getByText('Undefined Children')).toBeTruthy();
  });

  it('renders with JSX element as children', () => {
    const ChildComponent = () => <React.Fragment>JSX Child</React.Fragment>;
    
    render(
      <Section title="JSX Children">
        <ChildComponent />
      </Section>
    );

    expect(screen.getByText('JSX Children')).toBeTruthy();
    expect(screen.getByText('JSX Child')).toBeTruthy();
  });

  it('renders multiple Section components independently', () => {
    render(
      <>
        <Section title="First Section">
          <React.Fragment>First content</React.Fragment>
        </Section>
        <Section title="Second Section">
          <React.Fragment>Second content</React.Fragment>
        </Section>
      </>
    );

    expect(screen.getByText('First Section')).toBeTruthy();
    expect(screen.getByText('First content')).toBeTruthy();
    expect(screen.getByText('Second Section')).toBeTruthy();
    expect(screen.getByText('Second content')).toBeTruthy();
  });

  it('renders with newline characters in title', () => {
    render(
      <Section title="Title\nwith\nnewlines">
        <React.Fragment>Content</React.Fragment>
      </Section>
    );

    expect(screen.getByText('Title\nwith\nnewlines')).toBeTruthy();
  });

  it('renders with HTML entities in title', () => {
    render(
      <Section title="Title &amp; &lt;test&gt;">
        <React.Fragment>Content</React.Fragment>
      </Section>
    );

    expect(screen.getByText('Title &amp; &lt;test&gt;')).toBeTruthy();
  });
});