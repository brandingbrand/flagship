/*

  a bootstrap like style

*/
'use strict';

import { Platform } from 'react-native';
import { Dictionary } from '@brandingbrand/fsfoundation';

export interface FieldsColors {
  activeColor: string;
  errorColor: string;
  inactiveColor: string;
}

// returns an extended version of t-comb native default stylesheet
// extra styles are to make label templates possible while allowing for user to overwrite speicfic
// characteristics via fields style config

// tslint:disable-next-line:cyclomatic-complexity
export function styles(colors: FieldsColors): Dictionary {
  const LABEL_COLOR = colors.activeColor;
  const INPUT_COLOR = '#000000';
  const ERROR_COLOR = colors.errorColor;
  const HELP_COLOR = '#999999';
  const BORDER_COLOR = colors.activeColor;
  const DISABLED_COLOR = '#777777';
  const DISABLED_BACKGROUND_COLOR = '#eeeeee';
  const FONT_SIZE = 15;
  const FONT_WEIGHT = '200';

  return Object.freeze({
    fieldset: {},
    // the style applied to the container of all inputs
    colors: {
      error: ERROR_COLOR,
      active: colors.activeColor,
      inactive: colors.inactiveColor
    },
    formGroup: {
      normal: {
        marginBottom: 0
      },
      error: {
        marginBottom: 0
      }
    },
    inlineFormGroup: {
      normal: {
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'baseline',
        borderBottomWidth: 1,
        borderColor: colors.inactiveColor
      },
      error: {
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'baseline',
        borderBottomWidth: 1,
        borderColor: ERROR_COLOR
      }
    },
    controlLabel: {
      normal: {
        color: LABEL_COLOR,
        fontSize: 12,
        marginBottom: 7,
        fontWeight: FONT_WEIGHT
      },
      // the style applied when a validation error occours
      error: {
        color: ERROR_COLOR,
        fontSize: 12,
        marginBottom: 7,
        fontWeight: FONT_WEIGHT
      }
    },
    helpBlock: {
      normal: {
        color: HELP_COLOR,
        fontSize: FONT_SIZE,
        marginBottom: 2
      },
      // the style applied when a validation error occours
      error: {
        color: HELP_COLOR,
        fontSize: 13,
        marginBottom: 2
      }
    },
    errorBlock: {
      fontSize: 12,
      marginBottom: 3,
      color: ERROR_COLOR
    },
    textboxView: {
      normal: {
        position: 'relative',
        flexGrow: 100
      },
      error: {
        position: 'relative',
        flexGrow: 100
      },
      notEditable: {
        position: 'relative',
        flexGrow: 100
      }
    },
    textboxFullBorder: {
      normal: {
        color: INPUT_COLOR,
        fontSize: 15,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        paddingHorizontal: 7,
        borderRadius: 0,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 5,
        ...Platform.select({
          web: {
            outline: 'none'
          }
        })
      },
      // the style applied when a validation error occours
      error: {
        color: INPUT_COLOR,
        fontSize: 15,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        paddingHorizontal: 7,
        borderRadius: 0,
        borderColor: ERROR_COLOR,
        borderWidth: 1,
        marginBottom: 5,
        ...Platform.select({
          web: {
            outline: 'none'
          }
        })
      },
      // the style applied when the textbox is not editable
      notEditable: {
        fontSize: FONT_SIZE,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        paddingHorizontal: 7,
        borderRadius: 4,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
        marginBottom: 5,
        color: DISABLED_COLOR,
        backgroundColor: DISABLED_BACKGROUND_COLOR
      }
    },
    textboxInline: {
      normal: {
        color: INPUT_COLOR,
        fontSize: 15,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        paddingHorizontal: 7,
        borderRadius: 0,
        marginBottom: 5,
        ...Platform.select({
          web: {
            outline: 'none'
          }
        })
      },
      // the style applied when a validation error occours
      error: {
        color: INPUT_COLOR,
        fontSize: 15,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        paddingHorizontal: 7,
        borderRadius: 0,
        marginBottom: 5,
        ...Platform.select({
          web: {
            outline: 'none'
          }
        })
      },
      // the style applied when the textbox is not editable
      notEditable: {
        fontSize: FONT_SIZE,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        paddingHorizontal: 7,
        borderRadius: 4,
        marginBottom: 5,
        color: DISABLED_COLOR,
        backgroundColor: DISABLED_BACKGROUND_COLOR
      }
    },
    textboxUnderline: {
      normal: {
        color: INPUT_COLOR,
        fontSize: 15,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        borderRadius: 0,
        borderColor: BORDER_COLOR,
        borderBottomWidth: 1,
        marginBottom: 5,
        ...Platform.select({
          web: {
            outline: 'none'
          }
        })
      },
      // the style applied when a validation error occours
      error: {
        color: INPUT_COLOR,
        fontSize: 15,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        borderRadius: 0,
        borderColor: ERROR_COLOR,
        borderBottomWidth: 1,
        marginBottom: 5,
        ...Platform.select({
          web: {
            outline: 'none'
          }
        })
      },
      // the style applied when the textbox is not editable
      notEditable: {
        fontSize: FONT_SIZE,
        height: 36,
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        borderRadius: 4,
        borderColor: BORDER_COLOR,
        borderBottomWidth: 1,
        marginBottom: 5,
        color: DISABLED_COLOR,
        backgroundColor: DISABLED_BACKGROUND_COLOR
      }
    },
    checkbox: {
      normal: {
        marginBottom: 4
      },
      // the style applied when a validation error occours
      error: {
        marginBottom: 4
      }
    },
    pickerContainer: {
      normal: {
        marginBottom: 4,
        borderRadius: 4,
        borderColor: BORDER_COLOR,
        borderWidth: 1
      },
      error: {
        marginBottom: 4,
        borderRadius: 4,
        borderColor: ERROR_COLOR,
        borderWidth: 1
      },
      open: {
        // Alter styles when select container is open
      }
    },
    select: {
      normal: Platform.select({
        android: {
          paddingLeft: 7,
          color: INPUT_COLOR
        },
        ios: {}
      }),
      // the style applied when a validation error occours
      error: Platform.select({
        android: {
          paddingLeft: 7,
          color: ERROR_COLOR
        },
        ios: {}
      })
    },
    pickerTouchable: {
      normal: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center'
      },
      error: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center'
      },
      active: {
        borderBottomWidth: 1,
        borderColor: BORDER_COLOR
      },
      notEditable: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: DISABLED_BACKGROUND_COLOR
      }
    },
    pickerValue: {
      normal: {
        fontSize: FONT_SIZE,
        paddingLeft: 7
      },
      error: {
        fontSize: FONT_SIZE,
        paddingLeft: 7
      }
    },
    datepicker: {
      normal: {
        marginBottom: 4
      },
      // the style applied when a validation error occours
      error: {
        marginBottom: 4
      }
    },
    dateTouchable: {
      normal: {},
      error: {},
      notEditable: {
        backgroundColor: DISABLED_BACKGROUND_COLOR
      }
    },
    dateValue: {
      normal: {
        color: INPUT_COLOR,
        fontSize: FONT_SIZE,
        padding: 7,
        marginBottom: 5
      },
      error: {
        color: ERROR_COLOR,
        fontSize: FONT_SIZE,
        padding: 7,
        marginBottom: 5
      }
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
      alignSelf: 'center'
    },
    button: {
      height: 36,
      backgroundColor: '#48BBEC',
      borderColor: '#48BBEC',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      alignSelf: 'stretch',
      justifyContent: 'center'
    },
    alert: {
      width: 13,
      height: 12,
      marginRight: 20
    },
    check: {
      width: 14,
      height: 10,
      marginRight: 20
    },
    rightTextboxIcon: {
      position: 'absolute',
      right: 0,
      top: 15
    },
    floatingLabelView: {
      position: 'absolute',
      top: -12
    },
    inlineLabelView: {
      width: 80
    }
  });
}
