import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Header from '../Header';
import assets from '../../assets';

jest.mock('../../assets', () => ({
  logo: 'mocked-logo-source',
}));

jest.mock('../../lib/theme', () => ({
  createStyleSheet: jest.fn((fn) => () => fn({
    bg: '#FFFFFF',
  })),
}));

jest.mock('../Text', () => ({
  Text: ({children, type, style, testID}: any) => {
    const MockedText = require('react-native').Text;
    return (
      <MockedText testID={testID} type={type} style={style}>
        {children}
      </MockedText>
    );
  },
}));

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByText(/Welcome to/)).toBeTruthy();
  });

  it('displays the correct welcome text', () => {
    render(<Header />);
    const welcomeText = screen.getByText(/Welcome to/);
    expect(welcomeText).toBeTruthy();
    expect(welcomeText.props.children).toContain('Welcome to');
    expect(welcomeText.props.children).toContain('Flagship Code™');
  });

  it('renders with ImageBackground using the correct logo source', () => {
    const {UNSAFE_getByType} = render(<Header />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.source).toBe(assets.logo);
  });

  it('applies default styles to ImageBackground', () => {
    const {UNSAFE_getByType} = render(<Header />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#FFFFFF',
          paddingTop: 64,
          paddingBottom: 48,
          paddingHorizontal: 32,
          overflow: 'hidden',
        }),
      ]),
    );
  });

  it('applies custom style prop to ImageBackground', () => {
    const customStyle = {backgroundColor: '#000000', padding: 20};
    const {UNSAFE_getByType} = render(<Header style={customStyle} />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingTop: 64,
          paddingBottom: 48,
          paddingHorizontal: 32,
        }),
        customStyle,
      ]),
    );
  });

  it('applies correct imageStyle to the logo', () => {
    const {UNSAFE_getByType} = render(<Header />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.imageStyle).toEqual({
      opacity: 0.25,
      resizeMode: 'cover',
      marginBottom: -256,
    });
  });

  it('renders Text component with type="primary"', () => {
    const {UNSAFE_getByType} = render(<Header />);
    const text = UNSAFE_getByType(require('react-native').Text);
    expect(text.props.type).toBe('primary');
  });

  it('applies correct title styles to Text component', () => {
    const {UNSAFE_getByType} = render(<Header />);
    const text = UNSAFE_getByType(require('react-native').Text);
    expect(text.props.style).toEqual({
      fontSize: 32,
      fontWeight: '800',
      textAlign: 'center',
    });
  });

  it('handles undefined style prop gracefully', () => {
    const {UNSAFE_getByType} = render(<Header style={undefined} />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingTop: 64,
        }),
        undefined,
      ]),
    );
  });

  it('handles null style prop gracefully', () => {
    const {UNSAFE_getByType} = render(<Header style={null} />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingTop: 64,
        }),
        null,
      ]),
    );
  });

  it('handles array of styles in style prop', () => {
    const customStyles = [{marginTop: 10}, {marginBottom: 20}];
    const {UNSAFE_getByType} = render(<Header style={customStyles} />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingTop: 64,
        }),
        customStyles,
      ]),
    );
  });

  it('preserves newline character in welcome text', () => {
    render(<Header />);
    const welcomeText = screen.getByText(/Welcome to/);
    const textContent = welcomeText.props.children;
    expect(textContent).toContain('\n');
  });

  it('renders with correct component hierarchy', () => {
    const {UNSAFE_getByType} = render(<Header />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    const text = UNSAFE_getByType(require('react-native').Text);
    expect(imageBackground).toBeTruthy();
    expect(text).toBeTruthy();
  });

  it('uses createStyleSheet hook correctly', () => {
    const {createStyleSheet} = require('../../lib/theme');
    render(<Header />);
    expect(createStyleSheet).toHaveBeenCalled();
  });

  it('applies palette background color from theme', () => {
    const {UNSAFE_getByType} = render(<Header />);
    const imageBackground = UNSAFE_getByType(
      require('react-native').ImageBackground,
    );
    expect(imageBackground.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#FFFFFF',
        }),
      ]),
    );
  });
});