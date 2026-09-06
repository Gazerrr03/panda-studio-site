import type { Locale } from './i18n';

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
  side: 'left' | 'right';
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

export type StudioContent = {
  introActs: IntroAct[];
  albums: Album[];
};

// reveal uses normalized scroll progress (0–1). Keep a small gap between windows so each card reads on its own.
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
        side: 'left',
        kicker: 'ROOM / 01',
        title: 'A room before the brief.',
        copy: '[Placeholder] Introduce Panda Studio in one clear sentence.',
        imageLabel: 'IMAGE PLACEHOLDER / STUDIO VIEW',
        imageTone: 'room',
        alt: 'Placeholder for a photograph of the studio space',
        reveal: [0.02, 0.12],
        desktop: { x: '25%', y: '23%', width: '34%', rotate: '-2deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '-1deg' },
      },
      {
        id: 'room-02',
        act: 'room',
        side: 'right',
        kicker: 'ROOM / 02',
        title: 'Different people, one table.',
        copy: '[Placeholder] Add a short story about the people who gather here.',
        imageLabel: 'IMAGE PLACEHOLDER / WORK TABLE',
        imageTone: 'steel',
        alt: 'Placeholder for a photograph of people working around a table',
        reveal: [0.15, 0.25],
        desktop: { x: '75%', y: '23%', width: '34%', rotate: '1deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '1deg' },
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
        side: 'left',
        kicker: 'HARDWARE / 01',
        title: '3D printer',
        copy: '[Placeholder] Explain what this machine lets the studio prototype.',
        imageLabel: 'IMAGE PLACEHOLDER / 3D PRINTER',
        imageTone: 'gear',
        alt: 'Placeholder for a photograph of a 3D printer',
        reveal: [0.28, 0.38],
        desktop: { x: '25%', y: '23%', width: '31%', rotate: '-1deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '-1deg' },
      },
      {
        id: 'gear-02',
        act: 'gear',
        side: 'right',
        kicker: 'HARDWARE / 02',
        title: 'Laser engraver',
        copy: '[Placeholder] Describe the materials and experiments it opens up.',
        imageLabel: 'IMAGE PLACEHOLDER / LASER ENGRAVER',
        imageTone: 'ember',
        alt: 'Placeholder for a photograph of a laser engraving machine',
        reveal: [0.41, 0.51],
        desktop: { x: '75%', y: '23%', width: '34%', rotate: '1.5deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '1deg' },
      },
      {
        id: 'gear-03',
        act: 'gear',
        side: 'left',
        kicker: 'HARDWARE / 03',
        title: 'The workbench',
        copy: '[Placeholder] Add the other tools or one small detail from the workshop.',
        imageLabel: 'IMAGE PLACEHOLDER / WORKBENCH',
        imageTone: 'steel',
        alt: 'Placeholder for a photograph of the studio workbench',
        reveal: [0.54, 0.64],
        desktop: { x: '25%', y: '23%', width: '31%', rotate: '-1deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '-1deg' },
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
        side: 'right',
        kicker: 'SIGNAL / 01',
        title: 'Make room for the odd idea.',
        copy: '[Placeholder] State one studio value in a sentence people can remember.',
        imageLabel: 'IMAGE PLACEHOLDER / IN PROGRESS',
        imageTone: 'signal',
        alt: 'Placeholder for a photograph of an unfinished studio project',
        reveal: [0.67, 0.77],
        desktop: { x: '75%', y: '23%', width: '34%', rotate: '1deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '1deg' },
      },
      {
        id: 'signal-02',
        act: 'signal',
        side: 'left',
        kicker: 'SIGNAL / 02',
        title: 'One loud room.',
        copy: '[Placeholder] Replace this with the studio vision and what comes next.',
        imageLabel: 'IMAGE PLACEHOLDER / FINAL FRAME',
        imageTone: 'ember',
        alt: 'Placeholder for a final photograph representing the studio vision',
        reveal: [0.80, 0.90],
        desktop: { x: '25%', y: '23%', width: '34%', rotate: '-1deg' },
        mobile: { x: '50%', y: '17%', width: '84%', rotate: '-1deg' },
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

type SceneTranslation = Pick<IntroScene, 'kicker' | 'title' | 'copy' | 'imageLabel' | 'alt'>;
type ActTranslation = Pick<IntroAct, 'label' | 'title' | 'description'> & {
  scenes: Record<string, SceneTranslation>;
};
type AlbumTranslation = Pick<Album, 'title' | 'label' | 'format' | 'note' | 'tracks'>;
type StudioTranslation = {
  acts: Record<string, ActTranslation>;
  albums: Record<string, AlbumTranslation>;
};

const chineseStudio: StudioTranslation = {
  acts: {
    room: {
      label: '进入这间房',
      title: '在 brief 出现之前，先有一间房',
      description: '从空间、聚在这里的人，以及工作室存在的理由开始。',
      scenes: {
        'room-01': {
          kicker: '房间 / 01',
          title: '在 brief 出现之前，先有一间房',
          copy: '[占位] 用一句清楚的话介绍 Panda Studio。',
          imageLabel: '图片占位 / 工作室视角',
          alt: '工作室空间照片的占位图',
        },
        'room-02': {
          kicker: '房间 / 02',
          title: '不同的人，一张桌子',
          copy: '[占位] 写一小段关于聚在这里的人们的故事。',
          imageLabel: '图片占位 / 工作桌',
          alt: '人们围桌工作的照片占位图',
        },
      },
    },
    gear: {
      label: '看看这些装备',
      title: '每个想法，都需要一件乐器',
      description: '把硬件介绍成让想法变得具体的乐器。',
      scenes: {
        'gear-01': {
          kicker: '硬件 / 01',
          title: '3D 打印机',
          copy: '[占位] 解释这台机器让工作室可以把什么做成原型。',
          imageLabel: '图片占位 / 3D 打印机',
          alt: '3D 打印机照片的占位图',
        },
        'gear-02': {
          kicker: '硬件 / 02',
          title: '激光雕刻机',
          copy: '[占位] 描述它打开了哪些材料和实验。',
          imageLabel: '图片占位 / 激光雕刻机',
          alt: '激光雕刻机照片的占位图',
        },
        'gear-03': {
          kicker: '硬件 / 03',
          title: '工作台',
          copy: '[占位] 加入工作室里的另一件工具，或工作台上的一个小细节。',
          imageLabel: '图片占位 / 工作台',
          alt: '工作室工作台照片的占位图',
        },
      },
    },
    signal: {
      label: '调好信号',
      title: '给奇怪的想法留点空间',
      description: '最后落到这间房正在建立的价值和未来。',
      scenes: {
        'signal-01': {
          kicker: '信号 / 01',
          title: '给奇怪的想法留点空间',
          copy: '[占位] 用一句让人记得住的话说出工作室的一条价值观。',
          imageLabel: '图片占位 / 进行中',
          alt: '未完成的工作室项目照片占位图',
        },
        'signal-02': {
          kicker: '信号 / 02',
          title: '同一间大房间',
          copy: '[占位] 换成工作室愿景，以及下一步要做的事。',
          imageLabel: '图片占位 / 最终画面',
          alt: '代表工作室愿景的最终照片占位图',
        },
      },
    },
  },
  albums: {
    'record-001': {
      title: '未命名唱片 01',
      label: 'PANDA / 001',
      format: '项目故事占位',
      note: '这张唱片封套正在等待一段经过验证的项目故事：问题、在场的人、实验，以及最终发布的东西。',
      tracks: ['01 / 起点', '02 / 第一版粗糙原型', '03 / 发生了什么变化', '04 / 最终剪辑'],
    },
    'record-002': {
      title: '未命名唱片 02',
      label: 'PANDA / 002',
      format: '项目故事占位',
      note: '为另一件工作预留的可复用位置。替换文案和封面，不必改变档案的互动方式。',
      tracks: ['01 / Brief', '02 / 摩擦', '03 / 协作', '04 / 发布笔记'],
    },
    'record-003': {
      title: '现场录音 03',
      label: 'PANDA / LIVE 003',
      format: '实验占位',
      note: '把这张唱片留给更小的实验、工作坊或合作，不必假装它是一个完整产品。',
      tracks: ['01 / 参与者', '02 / 一夜规则', '03 / 意外噪音', '04 / 留下来的东西'],
    },
  },
};

export function getStudioContent(locale: Locale): StudioContent {
  if (locale === 'en') {
    return { introActs, albums };
  }

  return {
    introActs: introActs.map((act) => {
      const actTranslation = chineseStudio.acts[act.id];

      return {
        ...act,
        ...actTranslation,
        scenes: act.scenes.map((scene) => ({
          ...scene,
          ...actTranslation.scenes[scene.id],
        })),
      };
    }),
    albums: albums.map((album) => ({
      ...album,
      ...chineseStudio.albums[album.id],
    })),
  };
}
