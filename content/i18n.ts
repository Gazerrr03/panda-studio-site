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
    chapters: string;
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
    backToProjects: string;
    openRecord: (title: string) => string;
    nowPlaying: string;
    sampleContent: string;
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
      eyebrow: 'Club intro / Three acts',
      title: ['Come inside.', 'Find your instrument.'],
      chapters: 'Club introduction chapters',
    },
    records: {
      eyebrow: 'Archive / Records',
      title: ['Things we made,', 'pressed as albums.'],
      description:
        'Open a sleeve to read the project like liner notes—not as a wall of case-study cards.',
    },
    archive: {
      projects: 'Project records',
      previous: 'Previous project',
      next: 'Next project',
      backToProjects: 'Back to projects',
      openRecord: (title) => `Open ${title}`,
      nowPlaying: 'Now playing',
      sampleContent: 'Sample content · replace with verified work',
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
      description: '我们聚集那些无法被常规排名准确归类的人，然后一起做出奇怪而有用的东西。',
      cta: '播放作品集',
      indexSignal: '静默信号',
    },
    intro: {
      eyebrow: '俱乐部介绍 / 三幕',
      title: ['进来', '找到你的“乐器”'],
      chapters: '俱乐部介绍章节',
    },
    records: {
      eyebrow: '档案 / 作品',
      title: ['我们做过的事，', '压成一张张唱片'],
      description: '打开一张唱片封套，像读唱片内页一样读懂项目——而不是面对一墙案例卡片。',
    },
    archive: {
      projects: '项目作品',
      previous: '上一个作品',
      next: '下一个作品',
      backToProjects: '返回作品列表',
      openRecord: (title) => `打开 ${title}`,
      nowPlaying: '正在播放',
      sampleContent: '示例内容 · 替换为已验证的作品',
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
