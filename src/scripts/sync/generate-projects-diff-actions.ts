import { OPEN_SOURCE_PACKAGE_MANAGERS } from '../../lib/supported-project-types/supported-manifests';
import type { SnykProject } from '../../lib/types';

export function generateProjectDiffActions(
  repoManifests: string[],
  snykMonitoredProjects: SnykProject[],
  manifestTypes: string[] = Object.keys(OPEN_SOURCE_PACKAGE_MANAGERS),
): {
  import: string[];
  deactivate: SnykProject[];
} {
  const filesToImport: string[] = [];
  const deactivate: SnykProject[] = [];

  // any files in the repo, not in Snyk already should be
  // imported
  for (const manifest of repoManifests) {
    const snykProjectManifests = snykMonitoredProjects.map(
      (p) => p.name.split(':')[1],
    );
    if (!snykProjectManifests.includes(manifest)) {
      filesToImport.push(manifest);
    }
  }

  // any files in Snyk, not found in the repo should have the
  // related project de-activated
  for (const project of snykMonitoredProjects) {
    if (!repoManifests.includes(project.name.split(':')[1])) {
      if (manifestTypes.includes(project.type)) {
        deactivate.push(project);
      }
    }
  }

  return {
    import: filesToImport,
    deactivate,
  };
}
