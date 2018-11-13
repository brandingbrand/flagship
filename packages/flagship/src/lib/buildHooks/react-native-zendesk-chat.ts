import * as path from '../path';
import * as fs from '../fs';
import {
  logError,
  logInfo
} from '../../helpers';
import { BuildHook } from '../buildHooks';

const kRepository = `maven { url 'https://zendesk.artifactoryonline.com/zendesk/repo' }`;

const buildHooks: BuildHook[] = [
  {
    name: 'react-native-zendesk-chat android patch',
    platforms: ['android'],
    lifeCycle: 'afterLink',
    packages: [{
      packageName: /^(@[^\/]+\/)?react-native-zendesk-chat$/
    }],
    script: configuration => {
      logInfo('patching Android for react-native-zendesk-chat');

      const gradlePath = path.android.gradlePath();
      const stylesPath = path.android.stylesPath();

      if (!configuration.zendeskChat || !configuration.zendeskChat.accountKey) {
        logError('zendeskChat.accountKey needs to be set in the project env');

        process.exit(1);
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
    }
  }
];

module.exports = buildHooks;
