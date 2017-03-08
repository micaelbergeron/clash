// manage the action creator that are used in the creation/loading of actors
// for now, let's simply load the actor definitions at boot

export const IMPORT_TEMPLATES = 'IMPORT_TEMPLATES';

export const importTemplates = template => ({
  templates,
  type: IMPORT_TEMPLATES,
});
