import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {Text} from '../Text';

jest.mock('../../lib/theme', () => ({
  createStyleSheet: jest.fn((fn) => {
    const mockPalette = {
      fg: '#000000',
      fgSecondary: '#666666',
    };
    const styles = fn(mockPalette);
    return () => styles;
  }),
}));

describe('Text', () => {
  it('renders with default props', () => {
    render(<Text>Hello World</Text>);
    
    const textElement = screen.getByText('Hello World');
    expect(textElement).toBeTruthy();
  });

  it('renders children text content', () => {
    const testText = 'Test content';
    render(<Text>{testText}</Text>);
    
    expect(screen.getByText(testText)).toBeTruthy();
  });

  it('applies primary type styles by default', () => {
    render(<Text testID="text-element">Primary Text</Text>);
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({color: '#000000'})
      ])
    );
  });

  it('applies secondary type styles when type is secondary', () => {
    render(<Text type="secondary" testID="text-element">Secondary Text</Text>);
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({color: '#666666'})
      ])
    );
  });

  it('applies primary type styles when type is explicitly primary', () => {
    render(<Text type="primary" testID="text-element">Primary Text</Text>);
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({color: '#000000'})
      ])
    );
  });

  it('merges custom styles with type styles', () => {
    const customStyle = {fontSize: 20, fontWeight: 'bold' as const};
    render(
      <Text type="primary" style={customStyle} testID="text-element">
        Styled Text
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({color: '#000000'}),
        customStyle
      ])
    );
  });

  it('custom styles override type styles when conflicting', () => {
    const customStyle = {color: '#ff0000'};
    render(
      <Text type="primary" style={customStyle} testID="text-element">
        Custom Color
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    const styles = textElement.props.style;
    const flatStyle = Array.isArray(styles) 
      ? Object.assign({}, ...styles) 
      : styles;
    expect(flatStyle.color).toBe('#ff0000');
  });

  it('passes through React Native Text props', () => {
    render(
      <Text
        testID="text-element"
        numberOfLines={2}
        ellipsizeMode="tail"
        accessible={true}
        accessibilityLabel="Test label"
      >
        Text with props
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.numberOfLines).toBe(2);
    expect(textElement.props.ellipsizeMode).toBe('tail');
    expect(textElement.props.accessible).toBe(true);
    expect(textElement.props.accessibilityLabel).toBe('Test label');
  });

  it('handles onPress prop', () => {
    const onPressMock = jest.fn();
    render(
      <Text testID="text-element" onPress={onPressMock}>
        Pressable Text
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.onPress).toBe(onPressMock);
  });

  it('renders with empty children', () => {
    render(<Text testID="text-element" />);
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement).toBeTruthy();
  });

  it('renders with multiple children', () => {
    render(
      <Text testID="text-element">
        First part <Text>nested</Text> last part
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement).toBeTruthy();
  });

  it('handles array of styles', () => {
    const style1 = {fontSize: 16};
    const style2 = {fontWeight: 'bold' as const};
    render(
      <Text type="secondary" style={[style1, style2]} testID="text-element">
        Multiple Styles
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({color: '#666666'}),
        style1,
        style2
      ])
    );
  });

  it('handles null or undefined style prop', () => {
    render(
      <Text type="primary" style={undefined} testID="text-element">
        No custom style
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({color: '#000000'})
      ])
    );
  });

  it('renders with numeric children', () => {
    render(<Text testID="text-element">{42}</Text>);
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement).toBeTruthy();
  });

  it('applies allowFontScaling prop', () => {
    render(
      <Text testID="text-element" allowFontScaling={false}>
        No scaling
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.allowFontScaling).toBe(false);
  });

  it('applies maxFontSizeMultiplier prop', () => {
    render(
      <Text testID="text-element" maxFontSizeMultiplier={1.5}>
        Limited scaling
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.maxFontSizeMultiplier).toBe(1.5);
  });

  it('applies selectable prop', () => {
    render(
      <Text testID="text-element" selectable={true}>
        Selectable text
      </Text>
    );
    
    const textElement = screen.getByTestId('text-element');
    expect(textElement.props.selectable).toBe(true);
  });
});