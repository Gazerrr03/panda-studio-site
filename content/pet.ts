import type { Locale } from './i18n';

export type PetLink = {
  href: string;
  label: string;
};

export type PetAnswer = {
  id: string;
  question: string;
  answer: string;
  keywords: readonly string[];
  link?: PetLink;
};

export type PetCopy = {
  open: string;
  greeting: string;
  shortcutsLabel: string;
  shortcuts: {
    home: string;
    records: string;
    auditions: string;
  };
  askLabel: string;
  suggestions: readonly string[];
  inputLabel: string;
  inputPlaceholder: string;
  submit: string;
  close: string;
  inputEmpty: string;
  unknownAnswer: string;
  answers: readonly PetAnswer[];
};

const petCopy = {
  en: {
    open: 'Open helper',
    greeting: 'Ask me about Panda Studio or this site.',
    shortcutsLabel: 'Quick routes',
    shortcuts: {
      home: 'Back to home',
      records: 'Open the records',
      auditions: 'Join the room',
    },
    askLabel: 'Ask about this site',
    suggestions: ['Who are you?', 'What do you make?', 'How can I join?'],
    inputLabel: 'Your question',
    inputPlaceholder: 'Ask about Panda Studio…',
    submit: 'Ask',
    close: 'Close helper',
    inputEmpty: 'Type a question first.',
    unknownAnswer:
      'I only know this room for now. Ask me about the studio, the records, the gear, or joining the room.',
    answers: [
      {
        id: 'identity',
        question: 'Who are you?',
        answer:
          'Panda Studio is an independent creative studio for people who do not fit neatly into the usual rankings. We make strange, useful things together.',
        keywords: ['who are you', 'who is panda', 'panda studio', 'studio', 'identity'],
      },
      {
        id: 'work',
        question: 'What do you make?',
        answer:
          'We turn unclear ideas into visual languages, interactions, prototypes, and other things people can actually use. The records area will hold the work as project stories.',
        keywords: ['what do you make', 'what do you do', 'make', 'work', 'projects', '做什么'],
        link: { href: '#records', label: 'Open the records' },
      },
      {
        id: 'records',
        question: 'What is in the records?',
        answer:
          'The records are album-like sleeves for project stories: the situation, the rough demo, what changed, and the final cut. Some entries are still marked as placeholders.',
        keywords: ['records', 'projects', 'albums', 'portfolio', '作品', '唱片', '档案'],
        link: { href: '#records', label: 'Go to the records' },
      },
      {
        id: 'join',
        question: 'How can I join?',
        answer:
          'The open call is forming a band rather than filling fixed job boxes. Design collaborators bring melody; engineering collaborators make the room move. The contact channel still needs to be added.',
        keywords: ['how can i join', 'join', 'hiring', 'open call', 'audition', '招募', '加入'],
        link: { href: '#auditions', label: 'See the open call' },
      },
      {
        id: 'room',
        question: 'Why is this site built like a room?',
        answer:
          'The introduction moves through three acts: enter the room, check the gear, and tune the signal. It treats the studio as a place where people, tools, and ideas meet—not just as a list of services.',
        keywords: ['why this site', 'why a room', 'design', 'room', 'three acts', '网页', '网站', '房间'],
      },
      {
        id: 'gear',
        question: 'What are the tools for?',
        answer:
          'The 3D printer, laser engraver, and workbench are introduced as instruments that help ideas become physical. Their detailed stories are still placeholders on this page.',
        keywords: ['tools', 'gear', '3d printer', 'laser', 'workbench', '设备', '硬件', '打印机', '雕刻机'],
      },
    ],
  },
  zh: {
    open: '打开小助手',
    greeting: '问我关于 Panda Studio 和这个网页的事。',
    shortcutsLabel: '快速入口',
    shortcuts: {
      home: '回到主页',
      records: '查看作品',
      auditions: '查看招募',
    },
    askLabel: '问问这个网页',
    suggestions: ['你们是谁？', '你们做什么？', '怎么加入？'],
    inputLabel: '你的问题',
    inputPlaceholder: '问问 Panda Studio……',
    submit: '提问',
    close: '关闭小助手',
    inputEmpty: '先输入一个问题。',
    unknownAnswer: '我目前只认识这间房。你可以问我工作室、作品、设备，或加入方式。',
    answers: [
      {
        id: 'identity',
        question: '你们是谁？',
        answer:
          'Panda Studio 是一个独立创意工作室，聚集那些无法被常规排名准确归类的人，然后一起做出奇怪而有用的东西。',
        keywords: ['你们是谁', '你是谁', 'panda studio', '工作室', '介绍', '身份'],
      },
      {
        id: 'work',
        question: '你们做什么？',
        answer:
          '我们把模糊的感受和想法变成视觉语言、交互、原型，以及真正能被人使用的东西。作品区会把这些工作写成一张张项目唱片。',
        keywords: ['你们做什么', '做什么', '做啥', '工作', '项目', '创作'],
        link: { href: '#records', label: '去看作品' },
      },
      {
        id: 'records',
        question: '作品区里有什么？',
        answer:
          '作品区把项目做成唱片封套：从问题、第一版粗糙原型，到发生了什么变化，再到最终剪辑。目前其中一些条目仍然是占位内容。',
        keywords: ['作品', '作品区', '唱片', '档案', '项目故事', '案例'],
        link: { href: '#records', label: '去看作品区' },
      },
      {
        id: 'join',
        question: '怎么加入？',
        answer:
          '这里不是在填充固定职位，而是在组一支乐队。设计协作者负责塑造旋律，工程协作者让房间动起来；联系渠道目前还待补充。',
        keywords: ['怎么加入', '加入', '招募', '招聘', '试音', '协作者'],
        link: { href: '#auditions', label: '去看招募' },
      },
      {
        id: 'room',
        question: '为什么网页像一间房？',
        answer:
          '介绍部分分成三幕：进入这间房、看看这些装备、调好信号。它把工作室理解成一个让人、工具和想法相遇的地方，而不只是一串服务列表。',
        keywords: ['为什么网页', '为什么网站', '网页设计', '网站设计', '房间', '三幕', '怎么设计'],
      },
      {
        id: 'gear',
        question: '这些设备是做什么的？',
        answer:
          '3D 打印机、激光雕刻机和工作台被当作让想法变得具体的乐器。它们各自的详细故事，目前还是页面里的占位内容。',
        keywords: ['设备', '硬件', '3d打印机', '打印机', '激光雕刻机', '雕刻机', '工作台', '装备'],
      },
    ],
  },
} satisfies Record<Locale, PetCopy>;

export function getPetCopy(locale: Locale): PetCopy {
  return petCopy[locale];
}

function normalizeQuestion(value: string): string {
  return value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

export function resolvePetAnswer(copy: PetCopy, question: string): PetAnswer | null {
  const normalizedQuestion = normalizeQuestion(question);

  return (
    copy.answers.find((answer) =>
      answer.keywords.some((keyword) => normalizedQuestion.includes(normalizeQuestion(keyword))),
    ) ?? null
  );
}
