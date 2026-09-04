export type Album = {
  id: string;
  title: string;
  label: string;
  year: string;
  format: string;
  note: string;
  tracks: string[];
  cover: 'signal' | 'type' | 'cut';
  placeholder?: boolean;
};

export const albums: Album[] = [
  {
    id: 'record-001',
    title: 'Untitled Record 01',
    label: 'PANDA / 001',
    year: '20—',
    format: 'Project story placeholder',
    note: 'This sleeve is ready for one verified project story: the problem, the people in the room, the experiments, and what finally shipped.',
    tracks: ['01 / The situation', '02 / The first rough demo', '03 / What changed', '04 / The final cut'],
    cover: 'signal',
    placeholder: true,
  },
  {
    id: 'record-002',
    title: 'Untitled Record 02',
    label: 'PANDA / 002',
    year: '20—',
    format: 'Project story placeholder',
    note: 'A second reusable slot for another piece of work. Replace the copy and cover without changing the archive interaction.',
    tracks: ['01 / Brief', '02 / Friction', '03 / Collaboration', '04 / Release notes'],
    cover: 'type',
    placeholder: true,
  },
  {
    id: 'record-003',
    title: 'Live Session 03',
    label: 'PANDA / LIVE 003',
    year: '20—',
    format: 'Experiment placeholder',
    note: 'Use this pressing for a smaller experiment, workshop, or collaboration that deserves to be heard without pretending it was a full product.',
    tracks: ['01 / Participants', '02 / One-night rule', '03 / Unexpected noise', '04 / What remains'],
    cover: 'cut',
    placeholder: true,
  },
];

export const roles = [
  {
    instrument: 'Guitar',
    alias: 'Design collaborator',
    call: 'Shape the melody.',
    description: 'Turn an unclear feeling into a visual language, an interaction, or a form people can actually use.',
  },
  {
    instrument: 'Drums',
    alias: 'Engineering collaborator',
    call: 'Make the room move.',
    description: 'Give ideas a reliable rhythm: prototype fast, build carefully, and keep the strange parts alive in production.',
  },
];
