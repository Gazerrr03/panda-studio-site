import type { StaticImageData } from 'next/image';
import type { Locale } from './i18n';

import image3DPrintingResults from '../images/3D printing results.jpeg';
import imageArchitecturalModel from '../images/Architectural model.jpeg';
import imageLaserEngraver from '../images/Laser engraving machine.jpeg';
import imageMeetingArea from '../images/Meeting area.jpeg';
import imageMetaQuest from '../images/Meta Quest.jpeg';
import imageStudioEnvironment2 from '../images/Studio Environment 2.jpeg';
import imageStudioEnvironment from '../images/Studio environment.jpeg';
import imagePrinters from '../images/Weixin Image_20260912174320_82_1948.jpg';
import imageSticker from '../images/sticker.png';

export type Album = {
  id: string;
  title: string;
  label: string;
  year: string;
  format: string;
  note: string;
  tracks: string[];
  image?: StaticImageData;
};

export type IntroCard = {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  status?: string;
  image?: StaticImageData | string;
  imageLabel: string;
  imageTone: 'room' | 'gear' | 'signal' | 'ember' | 'steel';
  alt: string;
};

export type IntroDimension = {
  id: 'about' | 'hardware' | 'research';
  number: string;
  label: string;
  title: string;
  description: string;
  cards: IntroCard[];
};

export type StudioContent = {
  introDimensions: IntroDimension[];
  sharedCapabilities: string[];
  albums: Album[];
};

// Three chapters in the vertical studio archive. Every entry stays in reading order.
export const introDimensions: IntroDimension[] = [
  {
    id: 'about',
    number: '01',
    label: 'Meet Panda',
    title: 'A studio organised around projects.',
    description:
      'Meet the room first, then the people who make things inside it.',
    cards: [
      {
        id: 'about-studio',
        kicker: 'ABOUT / 01',
        title: 'Studio introduction',
        copy: 'Start with a real problem, make a testable prototype, then validate it through competitions and hackathons.',
        image: imageMeetingArea,
        imageLabel: 'PHOTO / MEETING AREA',
        imageTone: 'room',
        alt: 'Meeting area inside Panda Studio',
      },
      {
        id: 'about-members',
        kicker: 'ABOUT / 02',
        title: 'Member introduction',
        copy: 'People from different disciplines learn, form teams, and bring their own tools to the same table.',
        status: 'MEMBER DETAILS TO ADD',
        image: imageStudioEnvironment,
        imageLabel: 'PHOTO / STUDIO ENVIRONMENT',
        imageTone: 'steel',
        alt: 'Panda Studio workspace with a shared display and work tables',
      },
    ],
  },
  {
    id: 'hardware',
    number: '02',
    label: 'Use the tools',
    title: 'Turn an idea into something you can touch.',
    description:
      'Shared facilities help every project move from a screen to a physical or spatial prototype.',
    cards: [
      {
        id: 'hardware-printer',
        kicker: 'HARDWARE / 01',
        title: '3D printer',
        copy: 'Turn a digital model into a physical object quickly—a prototyping tool shared by every direction.',
        image: imagePrinters,
        imageLabel: 'PHOTO / 3D PRINTERS',
        imageTone: 'gear',
        alt: 'Several 3D printers in the studio',
      },
      {
        id: 'hardware-laser',
        kicker: 'HARDWARE / 02',
        title: 'Laser engraver',
        copy: 'Cut, engrave, and test sheet materials quickly.',
        status: 'SPECS TO VERIFY',
        image: imageLaserEngraver,
        imageLabel: 'PHOTO / LASER ENGRAVING MACHINE',
        imageTone: 'ember',
        alt: 'Laser engraving machine in the studio',
      },
      {
        id: 'hardware-mr',
        kicker: 'HARDWARE / 03',
        title: 'MR devices',
        copy: 'Build mixed-reality experiences and spatial interaction prototypes.',
        status: 'SPECS TO VERIFY',
        image: imageMetaQuest,
        imageLabel: 'PHOTO / META QUEST',
        imageTone: 'signal',
        alt: 'Meta Quest headset and related equipment on a work table',
      },
    ],
  },
  {
    id: 'research',
    number: '03',
    label: 'Choose a direction',
    title: 'Four directions, one project-based path.',
    description:
      'Members explore through projects, then use competitions and hackathons as public tests of the result.',
    cards: [
      {
        id: 'research-hardware',
        kicker: 'RESEARCH / 01',
        title: 'Small hardware',
        copy: 'Combine PCBs, sensors, and 3D-printed parts into compact physical prototypes.',
        image: image3DPrintingResults,
        imageLabel: 'PHOTO / 3D PRINTING RESULTS',
        imageTone: 'gear',
        alt: '3D printed prototypes and filament on a work table',
      },
      {
        id: 'research-gamification',
        kicker: 'RESEARCH / 02',
        title: 'Gamification',
        copy: 'Not simply making games—use game mechanics to help people understand or solve a problem.',
        image: imageSticker,
        imageLabel: 'PHOTO / PANDA STICKER SHEET',
        imageTone: 'ember',
        alt: 'Panda Studio sticker sheet with illustrated characters',
      },
      {
        id: 'research-campus',
        kicker: 'RESEARCH / 03',
        title: 'Campus applications',
        copy: 'Start with real campus problems and connect small apps to channels, identity, and activities.',
        image: imageStudioEnvironment2,
        imageLabel: 'PHOTO / STUDIO ENVIRONMENT',
        imageTone: 'signal',
        alt: 'Shared studio environment with workstations and tables',
      },
      {
        id: 'research-robotics',
        kicker: 'RESEARCH / 04',
        title: 'Robotic arms',
        copy: 'Start with desktop robotic arms to explore grasping, making, and architecture-related tasks.',
        image: imageArchitecturalModel,
        imageLabel: 'PHOTO / ARCHITECTURAL MODEL',
        imageTone: 'steel',
        alt: 'Architectural models displayed in a studio',
      },
    ],
  },
];

export const sharedCapabilities = [
  'AI collaboration',
  '3D printing',
  'Product thinking',
];

export const albums: Album[] = [
  {
    id: 'record-001',
    title: 'The shared table',
    label: 'PANDA / 001',
    year: '2026',
    format: 'Studio system',
    note: 'A working room for people, tools, and unfinished ideas. We shaped the studio around the moments when a loose question becomes something testable.',
    tracks: [
      '01 / Gather the signal',
      '02 / Make the first cut',
      '03 / Put it on the table',
      '04 / Keep what works',
    ],
    image: imageMeetingArea,
  },
  {
    id: 'record-002',
    title: 'Small machines, big questions',
    label: 'PANDA / 002',
    year: '2026',
    format: 'Making research',
    note: 'We use desktop fabrication as a way to think with our hands: quick printed parts, imperfect tests, and a faster route from a hunch to a useful object.',
    tracks: [
      '01 / Start with a hunch',
      '02 / Print the question',
      '03 / Test the edges',
      '04 / Share the result',
    ],
    image: image3DPrintingResults,
  },
  {
    id: 'record-003',
    title: 'A robot in the room',
    label: 'PANDA / LIVE 003',
    year: '2026',
    format: 'Open experiment',
    note: 'A study of what happens when a small robotic arm becomes part of the studio vocabulary—less a finished product, more a new material to reason with.',
    tracks: [
      '01 / Give it a task',
      '02 / Watch it fail',
      '03 / Change the setup',
      '04 / Leave a trace',
    ],
    image: imageArchitecturalModel,
  },
];

type CardTranslation = Pick<
  IntroCard,
  'kicker' | 'title' | 'copy' | 'imageLabel' | 'alt'
> & {
  status?: string;
};
type DimensionTranslation = Pick<
  IntroDimension,
  'label' | 'title' | 'description'
> & {
  cards: Record<string, CardTranslation>;
};
type AlbumTranslation = Pick<
  Album,
  'title' | 'label' | 'format' | 'note' | 'tracks'
>;
type StudioTranslation = {
  dimensions: Record<string, DimensionTranslation>;
  sharedCapabilities: string[];
  albums: Record<string, AlbumTranslation>;
};

const chineseStudio: StudioTranslation = {
  dimensions: {
    about: {
      label: '认识 Panda',
      title: '一个以项目为组织方式的工作室',
      description: '先认识这间工作室，再认识一起把事情做出来的人。',
      cards: {
        'about-studio': {
          kicker: '介绍 / 01',
          title: '工作室介绍',
          copy: '从真实问题出发，把想法做成原型，再通过竞赛与黑客松验证。',
          imageLabel: '照片 / 会议区',
          alt: 'Panda Studio 内的会议区',
        },
        'about-members': {
          kicker: '介绍 / 02',
          title: '成员介绍',
          copy: '不同专业的成员在这里学习、组队，并把各自的工具带到同一张桌上。',
          status: '成员信息待补',
          imageLabel: '照片 / 工作室环境',
          alt: 'Panda Studio 的共享工作区，包含显示屏和工作桌',
        },
      },
    },
    hardware: {
      label: '使用设施',
      title: '把想法变成可以触摸的东西',
      description: '共用设施帮助每个项目从屏幕走向实体或空间原型。',
      cards: {
        'hardware-printer': {
          kicker: '硬件 / 01',
          title: '3D 打印机',
          copy: '把数字模型快速变成实体，是所有方向共用的原型工具。',
          imageLabel: '照片 / 3D 打印机',
          alt: '工作室内的多台 3D 打印机',
        },
        'hardware-laser': {
          kicker: '硬件 / 02',
          title: '激光雕刻机',
          copy: '用于板材切割、雕刻和快速材料测试。',
          status: '参数待核实',
          imageLabel: '照片 / 激光雕刻机',
          alt: '工作室内的激光雕刻机',
        },
        'hardware-mr': {
          kicker: '硬件 / 03',
          title: 'MR 设备',
          copy: '用于混合现实体验和空间交互原型。',
          status: '参数待核实',
          imageLabel: '照片 / Meta Quest',
          alt: '工作桌上的 Meta Quest 头显和相关设备',
        },
      },
    },
    research: {
      label: '选择方向',
      title: '四个方向，一条项目制路径',
      description: '成员通过项目探索方向，再用竞赛与黑客松检验成果。',
      cards: {
        'research-hardware': {
          kicker: '研究 / 01',
          title: '小硬件',
          copy: '结合 PCB、传感器和 3D 打印，快速完成小型实体产品原型。',
          imageLabel: '照片 / 3D 打印成果',
          alt: '工作桌上的 3D 打印原型和耗材',
        },
        'research-gamification': {
          kicker: '研究 / 02',
          title: '游戏化',
          copy: '不是单纯做游戏，而是用游戏机制帮助人理解或解决问题。',
          imageLabel: '照片 / Panda 贴纸',
          alt: '印有 Panda Studio 插画角色的贴纸页',
        },
        'research-campus': {
          kicker: '研究 / 03',
          title: '校园应用',
          copy: '从校园真实问题出发，用小应用连接校内渠道、认证与活动。',
          imageLabel: '照片 / 工作室环境',
          alt: '包含工作台和工作站的共享工作室环境',
        },
        'research-robotics': {
          kicker: '研究 / 04',
          title: '机械臂',
          copy: '从桌面机械臂入手，探索抓取、制作与建筑相关任务。',
          imageLabel: '照片 / 建筑模型',
          alt: '工作室内展示的建筑模型',
        },
      },
    },
  },
  sharedCapabilities: ['AI 协同', '3D 打印', '产品思维'],
  albums: {
    'record-001': {
      title: '共享的桌面',
      label: 'PANDA / 001',
      format: '工作室系统',
      note: '一个容纳人、工具和未完成想法的工作空间。我们从那些让模糊问题变得可测试的时刻出发，重新组织了这个工作室。',
      tracks: [
        '01 / 收集信号',
        '02 / 做第一刀',
        '03 / 把它放上桌',
        '04 / 留下有效的部分',
      ],
    },
    'record-002': {
      title: '小机器，大问题',
      label: 'PANDA / 002',
      format: '制作研究',
      note: '我们把桌面制造当作一种用手思考的方法：快速打印零件、并不完美的测试，以及从直觉到有用物件的更短路径。',
      tracks: [
        '01 / 从直觉开始',
        '02 / 打印问题',
        '03 / 测试边界',
        '04 / 分享结果',
      ],
    },
    'record-003': {
      title: '房间里的机器人',
      label: 'PANDA / LIVE 003',
      format: '开放实验',
      note: '研究一只小型机械臂成为工作室语言的一部分之后会发生什么——它不是完成品，而是一种可以继续推理的新材料。',
      tracks: [
        '01 / 给它一个任务',
        '02 / 看它失败',
        '03 / 改变设置',
        '04 / 留下一点痕迹',
      ],
    },
  },
};

export function getStudioContent(locale: Locale): StudioContent {
  if (locale === 'en') {
    return { introDimensions, sharedCapabilities, albums };
  }

  return {
    introDimensions: introDimensions.map((dimension) => {
      const dimensionTranslation = chineseStudio.dimensions[dimension.id];

      return {
        ...dimension,
        ...dimensionTranslation,
        cards: dimension.cards.map((card) => ({
          ...card,
          ...dimensionTranslation.cards[card.id],
        })),
      };
    }),
    sharedCapabilities: chineseStudio.sharedCapabilities,
    albums: albums.map((album) => ({
      ...album,
      ...chineseStudio.albums[album.id],
    })),
  };
}
