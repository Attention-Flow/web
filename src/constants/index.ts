import LOGO_DISCORD from '@/assets/logo-discord.svg';
import LOGO_FARCASTER from '@/assets/logo-farcaster.svg';
import LOGO_LENS from '@/assets/logo-lens.gif';
import LOGO_REDDIT from '@/assets/logo-reddit.svg';
import LOGO_TELEGRAM from '@/assets/logo-telegram.svg';
import LOGO_TWITTER from '@/assets/logo-twitter.svg';
import LOGO_YOUTUBE from '@/assets/logo-youtube.svg';

export const Applications: Application[] = [
  {
    type: 'Telegram',
    icon: LOGO_TELEGRAM,
    name: 'Telegram',
    path: '/telegram',
    enabled: true,
    overviewGroups: [
      '1359461894',
      '1553109986',
      '1127478087',
      '1744945796',
      '1522895395',
    ],
  },
  {
    type: 'Farcaster',
    icon: LOGO_FARCASTER,
    name: 'Farcaster',
    path: '/farcaster',
    enabled: true,
    overviewGroups: [],
  },
  {
    type: 'Reddit',
    icon: LOGO_REDDIT,
    iconStyle: { borderRadius: '100%' },
    name: 'Reddit',
    path: '/reddit',
    enabled: false,
    overviewGroups: [],
  },
  {
    type: 'Lens',
    icon: LOGO_LENS,
    iconStyle: { borderRadius: '100%' },
    name: 'Lens',
    path: '/lens',
    enabled: false,
    overviewGroups: ['lenster', 'phaver'],
  },
  {
    type: 'Discord',
    icon: LOGO_DISCORD,
    name: 'Discord',
    path: '/discord',
    enabled: false,
    overviewGroups: [],
  },
  {
    type: 'Twitter',
    icon: LOGO_TWITTER,
    iconStyle: { width: 34, height: 34, margin: 3 },
    name: 'Twitter',
    path: '/twitter',
    enabled: false,
    overviewGroups: [],
  },
  {
    type: 'Youtube',
    icon: LOGO_YOUTUBE,
    name: 'Youtube',
    path: '/youtube',
    enabled: false,
    overviewGroups: [],
  },
];

export const ApplicationsMap: Record<string, Application> =
  Object.fromEntries<Application>(
    Applications.map((e) => [e.type.toLowerCase() as string, e]),
  );

export const TimeSpans: {
  label: string;
  value: TimeSpan;
  enabled: boolean;
}[] = [
  {
    label: 'Hour',
    value: 'hour',
    enabled: false,
  },
  {
    label: 'Day',
    value: 'day',
    enabled: true,
  },
  {
    label: 'Week',
    value: 'week',
    enabled: false,
  },
  {
    label: 'Month',
    value: 'month',
    enabled: false,
  },
];

export const DEV = process.env.NODE_ENV === 'development';
