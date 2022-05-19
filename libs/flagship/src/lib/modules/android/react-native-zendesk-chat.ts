import { logError, logInfo } from '../../../helpers';
import type { Config } from '../../../types';
import * as fs from '../../fs';
import * as path from '../../path';

const kRepository = `maven { url 'https://zendesk.artifactoryonline.com/zendesk/repo' }`;

/**
 * Patches Android for the module.
 *
 * @param configuration The project configuration.
 */
export const postLink = (configuration: Config): void => {
  logInfo('patching Android for react-native-zendesk-chat');

  const gradlePath = path.android.gradlePath();
  const stylesPath = path.android.stylesPath();

  if (!configuration.zendeskChat || !configuration.zendeskChat.accountKey) {
    logError('zendeskChat.accountKey needs to be set in the project env');

    return process.exit(1);
  }

  // Add the repository to the project repositories.
  fs.update(gradlePath, 'repositories {', `repositories {\n        ${kRepository}`);

  // Add the default Zendesk style
  fs.update(
    stylesPath,
    '</resources>',
    '<style name="ZopimChatTheme" parent="ZopimChatTheme.Dark" />\n</resources>'
  );

  // RN link attempts to add the right imports to MainApplication.java automatically.
  // However, for reasons I have not fully investigated, the import is not correct
  // for this package, hence the replace. -BW
  fs.update(
    path.android.mainApplicationPath(configuration),
    'import com.taskrabbit.zendesk.RNZendeskChat.RNZendeskChatPackage;',
    `import com.taskrabbit.zendesk.*;`
  );
};
