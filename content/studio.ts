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

export type IntroScene = {
  id: string;
  act: 'room' | 'gear' | 'signal';
  kicker: string;
  title: string;
  copy: string;
  image?: string;
  imageLabel: string;
  imageTone: 'room' | 'gear' | 'signal' | 'ember' | 'steel';
  alt: string;
  reveal: [number, number];
  desktop: { x: string; y: string; width: string; rotate: string };
  mobile: { x: string; y: string; width: string; rotate: string };
};

export type IntroAct = {
  id: IntroScene['act'];
  number: string;
  label: string;
  title: string;
  description: string;
  scenes: IntroScene[];
};

// Replace the placeholder image labels, copy, and paths here when the real story is ready.
// The ClubIntro component only depends on this shape, so content changes stay isolated.
export const introActs: IntroAct[] = [
  {
    id: 'room',
    number: '01',
    label: 'Enter the room',
    title: 'A room before the brief.',
    description: 'Start with the place, the people, and the reason this studio exists.',
    scenes: [
      {
        id: 'room-01',
        act: 'room',
        kicker: 'ROOM / 01',
        title: 'A room before the brief.',
        copy: '[Placeholder] Introduce Panda Studio in one clear sentence.',
        imageLabel: 'IMAGE PLACEHOLDER / STUDIO VIEW',
        imageTone: 'room',
        alt: 'Placeholder for a photograph of the studio space',
        reveal: [0.02, 0.2],
        desktop: { x: '24%', y: '7%', width: '34%', rotate: '-2deg' },
        mobile: { x: '50%', y: '7%', width: '84%', rotate: '-1deg' },
      },
      {
        id: 'room-02',
        act: 'room',
        kicker: 'ROOM / 02',
        title: 'Different people, one table.',
        copy: '[Placeholder] Add a short story about the people who gather here.',
        imageLabel: 'IMAGE PLACEHOLDER / WORK TABLE',
        imageTone: 'steel',
        alt: 'Placeholder for a photograph of people working around a table',
        reveal: [0.14, 0.34],
        desktop: { x: '70%', y: '30%', width: '37%', rotate: '1deg' },
        mobile: { x: '50%', y: '12%', width: '84%', rotate: '1deg' },
      },
    ],
  },
  {
    id: 'gear',
    number: '02',
    label: 'Check the gear',
    title: 'Every idea needs an instrument.',
    description: 'Introduce the hardware as a set of instruments for making ideas physical.',
    scenes: [
      {
        id: 'gear-01',
        act: 'gear',
        kicker: 'HARDWARE / 01',
        title: '3D printer',
        copy: '[Placeholder] Explain what this machine lets the studio prototype.',
        imageLabel: 'IMAGE PLACEHOLDER / 3D PRINTER',
        imageTone: 'gear',
        alt: 'Placeholder for a photograph of a 3D printer',
        reveal: [0.3, 0.5],
        desktop: { x: '25%', y: '52%', width: '31%', rotate: '-1deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '-1deg' },
      },
      {
        id: 'gear-02',
        act: 'gear',
        kicker: 'HARDWARE / 02',
        title: 'Laser engraver',
        copy: '[Placeholder] Describe the materials and experiments it opens up.',
        imageLabel: 'IMAGE PLACEHOLDER / LASER ENGRAVER',
        imageTone: 'ember',
        alt: 'Placeholder for a photograph of a laser engraving machine',
        reveal: [0.43, 0.63],
        desktop: { x: '72%', y: '11%', width: '36%', rotate: '1.5deg' },
        mobile: { x: '50%', y: '22%', width: '84%', rotate: '1deg' },
      },
      {
        id: 'gear-03',
        act: 'gear',
        kicker: 'HARDWARE / 03',
        title: 'The workbench',
        copy: '[Placeholder] Add the other tools or one small detail from the workshop.',
        imageLabel: 'IMAGE PLACEHOLDER / WORKBENCH',
        imageTone: 'steel',
        alt: 'Placeholder for a photograph of the studio workbench',
        reveal: [0.57, 0.76],
        desktop: { x: '72%', y: '50%', width: '30%', rotate: '-1deg' },
        mobile: { x: '50%', y: '27%', width: '84%', rotate: '-1deg' },
      },
    ],
  },
  {
    id: 'signal',
    number: '03',
    label: 'Tune the signal',
    title: 'Make room for the odd idea.',
    description: 'Finish with the values and the future this room is trying to build.',
    scenes: [
      {
        id: 'signal-01',
        act: 'signal',
        kicker: 'SIGNAL / 01',
        title: 'Make room for the odd idea.',
        copy: '[Placeholder] State one studio value in a sentence people can remember.',
        imageLabel: 'IMAGE PLACEHOLDER / IN PROGRESS',
        imageTone: 'signal',
        alt: 'Placeholder for a photograph of an unfinished studio project',
        reveal: [0.7, 0.88],
        desktop: { x: '26%', y: '12%', width: '35%', rotate: '1deg' },
        mobile: { x: '50%', y: '32%', width: '84%', rotate: '1deg' },
      },
      {
        id: 'signal-02',
        act: 'signal',
        kicker: 'SIGNAL / 02',
        title: 'One loud room.',
        copy: '[Placeholder] Replace this with the studio vision and the invitation to join.',
        imageLabel: 'IMAGE PLACEHOLDER / FINAL FRAME',
        imageTone: 'ember',
        alt: 'Placeholder for a final photograph representing the studio vision',
        reveal: [0.83, 1],
        desktop: { x: '68%', y: '32%', width: '35%', rotate: '-1deg' },
        mobile: { x: '50%', y: '37%', width: '84%', rotate: '-1deg' },
      },
    ],
  },
];

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
