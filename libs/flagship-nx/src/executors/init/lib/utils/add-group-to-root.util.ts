import type { XCodeproject } from 'xcode';

import type { CreateIosFilesOptions } from '../create-ios-files';

export const addGroupToRoot = (
  project: XCodeproject,
  options: CreateIosFilesOptions,
  extGroup: { uuid: string; pbxGroup: string }
): void => {
  const groups = project.hash.project.objects.PBXGroup;
  for (const [key, group] of Object.entries(groups ?? {})) {
    if (group.children?.some(({ comment }) => comment === options.name) === true) {
      project.addToPbxGroup(extGroup.uuid, key);
    }
  }
};
