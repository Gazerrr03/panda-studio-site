export type Locale = 'en' | 'zh';

export type SectionTitle = readonly string[];

export type SiteCopy = {
  metadata: {
    title: string;
    description: string;
  };
  language: {
    label: string;
    english: string;
    chinese: string;
    switchToEnglish: string;
    switchToChinese: string;
  };
  brandHome: string;
  navigation: {
    primary: string;
    records: string;
  };
  hero: {
    eyebrow: string;
    title: SectionTitle;
    description: string;
    cta: string;
    indexSignal: string;
  };
  intro: {
    eyebrow: string;
    title: SectionTitle;
    dimensions: string;
    previousCard: string;
    nextCard: string;
    sharedCapabilities: string;
  };
  records: {
    eyebrow: string;
    title: SectionTitle;
    description: string;
  };
  archive: {
    projects: string;
    previous: string;
    next: string;
    browseHint: string;
    closeProject: string;
    backToProjects: string;
    openRecord: (title: string) => string;
    nowPlaying: string;
  };
  footer: {
    tagline: string;
    backToTop: string;
  };
};

export const siteCopy = {
  en: {
    metadata: {
      title: 'Panda Studio — Different noise, one loud room',
      description:
        'An independent studio gathering unconventional creative people to make strange, useful things together.',
    },
    language: {
      label: 'Switch language',
      english: 'EN',
      chinese: '中',
      switchToEnglish: 'Switch to English',
      switchToChinese: '切换到中文',
    },
    brandHome: 'Panda Studio home',
    navigation: {
      primary: 'Primary navigation',
      records: 'Records',
    },
    hero: {
      eyebrow: 'Independent creative studio · Est. somewhere underground',
      title: ['Different noise.', 'One loud room.'],
      description:
        'We gather people who do not fit neatly into the usual rankings—then make strange, useful things together.',
      cta: 'Play the records',
      indexSignal: 'SILENT SIGNAL',
    },
    intro: {
      eyebrow: 'Club intro / Content matrix',
      title: ['Meet Panda.', 'In three dimensions.'],
      dimensions: 'Club introduction dimensions',
      previousCard: 'Previous card',
      nextCard: 'Next card',
      sharedCapabilities: 'Shared capabilities',
    },
    records: {
      eyebrow: 'Archive / Records',
      title: ['Things we made,', 'held as objects.'],
      description:
        'Move through the archive. Open an object when something catches your eye.',
    },
    archive: {
      projects: 'Project records',
      previous: 'Previous project',
      next: 'Next project',
      browseHint: 'Drag to browse / Click to open',
      closeProject: 'Close project',
      backToProjects: 'Back to projects',
      openRecord: (title) => `Open ${title}`,
      nowPlaying: 'Project',
    },
    footer: {
      tagline: 'Different noise. One loud room.',
      backToTop: 'Back to top',
    },
  },
  zh: {
    metadata: {
      title: 'Panda Studio — 不同噪音，同一间大房间',
      description: '一个聚集非典型创作者、一起做出奇怪而有用之物的独立工作室。',
    },
    language: {
      label: '切换语言',
      english: 'EN',
      chinese: '中',
      switchToEnglish: 'Switch to English',
      switchToChinese: '切换到中文',
    },
    brandHome: 'Panda Studio 首页',
    navigation: {
      primary: '主导航',
      records: '作品',
    },
    hero: {
      eyebrow: '独立创意工作室 · 成立于某个地下空间',
      title: ['不同的噪音', '同一间大房间'],
      description:
        '我们聚集那些无法被常规排名准确归类的人，然后一起做出奇怪而有用的东西。',
      cta: '播放作品集',
      indexSignal: '静默信号',
    },
    intro: {
      eyebrow: '俱乐部介绍 / 内容矩阵',
      title: ['三个维度', '认识 Panda'],
      dimensions: '俱乐部介绍内容维度',
      previousCard: '上一张卡片',
      nextCard: '下一张卡片',
      sharedCapabilities: '共同能力',
    },
    records: {
      eyebrow: '档案 / 作品',
      title: ['我们做过的事，', '收进一个个对象'],
      description: '滑过档案，看到让你感兴趣的对象，就打开它。',
    },
    archive: {
      projects: '项目作品',
      previous: '上一个作品',
      next: '下一个作品',
      browseHint: '拖动浏览 / 点击打开',
      closeProject: '关闭作品',
      backToProjects: '返回作品列表',
      openRecord: (title) => `打开 ${title}`,
      nowPlaying: '项目',
    },
    footer: {
      tagline: '不同的噪音，同一间大房间',
      backToTop: '返回顶部',
    },
  },
} satisfies Record<Locale, SiteCopy>;

export function getSiteCopy(locale: Locale): SiteCopy {
  return siteCopy[locale];
}
