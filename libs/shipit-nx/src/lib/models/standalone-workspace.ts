import type { Project } from '../utils/find-closed-projects.util';

export interface StandaloneWorkspace {
  projects: { [key: string]: string | Project };
}
