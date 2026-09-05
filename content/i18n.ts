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
    auditions: string;
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
    openRecord: (title: string) => string;
    nowPlaying: string;
    sampleContent: string;
  };
  auditions: {
    eyebrow: string;
    title: SectionTitle;
    description: string;
    calloutEyebrow: string;
    callout: string;
    contact: string;
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
      auditions: 'Auditions',
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
      openRecord: (title) => `Open ${title}`,
      nowPlaying: 'Now playing',
      sampleContent: 'Sample content · replace with verified work',
    },
    auditions: {
      eyebrow: 'Open call / Auditions',
      title: ['We are not hiring.', 'We are forming a band.'],
      description:
        'Titles are aliases, not boxes. Bring another instrument if these two do not sound like you.',
      calloutEyebrow: 'Rehearsal room',
      callout:
        'Show us the one thing you made that still feels a little too strange for the usual portfolio.',
      contact: 'CONTACT CHANNEL / TO BE ADDED',
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
      auditions: '招募',
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
      title: ['进来找到你的“乐器”'],
      chapters: '俱乐部介绍章节',
    },
    records: {
      eyebrow: '档案 / 作品',
      title: ['我们做过的事，', '压成一张张唱片'],
      description: '打开一张唱片封套，像读唱片内页一样读懂项目——而不是面对一墙案例卡片。',
    },
    archive: {
      projects: '项目作品',
      openRecord: (title) => `打开 ${title}`,
      nowPlaying: '正在播放',
      sampleContent: '示例内容 · 替换为已验证的作品',
    },
    auditions: {
      eyebrow: '公开招募 / 试音',
      title: ['我们不是在招聘', '我们正在组一支乐队'],
      description: '职位是别名，不是框框。如果下面两种声音都不像你，带上另一件乐器来。',
      calloutEyebrow: '排练室',
      callout: '把那件对常规作品集来说有点太奇怪、但你仍然做出来的东西给我们看看。',
      contact: '联系渠道 / 待补充',
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
