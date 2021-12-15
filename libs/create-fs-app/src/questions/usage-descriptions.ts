import { DistinctQuestion } from 'inquirer';
import * as formatters from '../lib/formatters';
type UsageDescriptions = keyof import('../assets/base-config').BaseConfig['usageDescriptionIOS'];

export interface UsageDescriptionsAnswers {
  options: {
    usageDescriptions: boolean;
  };
  config?: {
    usageDescriptionIOS?: {
      [key in UsageDescriptions]: string;
    };
  };
}

const generateUsageDescription = (key: string): DistinctQuestion => ({
  type: 'input',
  name: `config.usageDescriptionIOS.${key}`,
  message: key,
  when: (answers) => answers.options.usageDescriptions,
  // TODO: Add better messaging
});

const usageDescriptionQuestions = [
  'NSAppleMusicUsageDescription',
  'NSBluetoothPeripheralUsageDescription',
  'NSCalendarsUsageDescription',
  'NSCameraUsageDescription',
  'NSLocationWhenInUseUsageDescription',
  'NSMotionUsageDescription',
  'NSPhotoLibraryAddUsageDescription',
  'NSPhotoLibraryUsageDescription',
  'NSSpeechRecognitionUsageDescription',
  'NSFaceIDUsageDescription',
].map(generateUsageDescription);

const questions: DistinctQuestion[] = [
  {
    type: 'confirm',
    name: 'options.usageDescriptions',
    message: 'Do you want to add usage descriptions?',
    suffix:
      'Text to be displayed to users when requesting access to features such as the camera or calendar. Please note that due to software restrictions, you must provide usage descriptions for every grant type even if your app does not implement all of them.',
    default: false,
  },
  ...usageDescriptionQuestions,
];

export const usageDescriptions = questions.map(formatters.ios);
