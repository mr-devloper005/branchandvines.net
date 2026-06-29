import { slot4BrandConfig } from '@/editable/theme/brand.config'

const brand = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'A curated library of saved links & collections',
      description:
        'Discover hand-picked bookmarks, tools and resources, organized into collections worth coming back to.',
      openGraphTitle: 'A curated library of saved links & collections',
      openGraphDescription:
        'Browse curated collections of the best links, tools and references — one calm, organized library.',
      keywords: ['social bookmarking', 'curated collections', 'saved links', 'resources', 'content discovery', 'bookmarks'],
    },
    hero: {
      badge: 'Curated library',
      title: ['Save the links worth keeping.', 'Discover the ones worth finding.'],
      description:
        'A calm home for bookmarking and discovering the best resources, tools and references — gathered into collections you can actually browse.',
      primaryCta: { label: 'Browse collections', href: '/sbm' },
      secondaryCta: { label: 'Search the library', href: '/search' },
      searchPlaceholder: 'Search collections, tools, resources…',
      focusLabel: 'Featured',
      featureCardBadge: 'featured collection',
      featureCardTitle: 'Fresh saves shape the shelves at the top of the library.',
      featureCardDescription: 'The newest bookmarks and collections stay front and centre, without changing how anything works underneath.',
    },
    intro: {
      badge: 'How the library works',
      title: 'Built for saving, organizing, and rediscovering the links that matter.',
      paragraphs: [
        'Instead of losing good links in scattered tabs and notes, this library keeps them gathered into clean collections anyone can browse.',
        'Every save carries its source, a short note and a topic — so resources stay easy to scan, compare and return to.',
        'Start from a topic, a collection or a search, and keep pulling the thread to related resources without friction.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Collections-first home with the freshest saves up top.',
        'Every bookmark shows its source, note and topic.',
        'Topic shelves make discovery feel calm and deliberate.',
        'Lightweight, fast, and built for return visits.',
      ],
      primaryLink: { label: 'Browse collections', href: '/sbm' },
      secondaryLink: { label: 'Search resources', href: '/search' },
    },
    featured: {
      eyebrow: 'Featured collections',
      title: 'Shelves worth starting with',
      description: 'Hand-picked collections of the most useful links, gathered and kept current.',
    },
    topics: {
      eyebrow: 'Browse by topic',
      title: 'Find your corner of the library',
      description: 'Jump straight into the topic you came for.',
    },
    popular: {
      eyebrow: 'Popular this week',
      title: 'What people are saving',
      description: 'The resources getting the most attention across the library right now.',
    },
    latest: {
      eyebrow: 'Latest saves',
      title: 'Fresh to the shelves',
      description: 'The newest links and resources added across every collection.',
    },
    stats: {
      eyebrow: 'The library at a glance',
      items: [
        { value: 'Curated', label: 'Every link reviewed before it lands on a shelf' },
        { value: 'Organized', label: 'Saves grouped into clean, browsable collections' },
        { value: 'Sourced', label: 'Source, note and topic on every bookmark' },
        { value: 'Current', label: 'Fresh saves surface to the top continuously' },
      ],
    },
    cta: {
      badge: 'Add to the library',
      title: 'Found a link worth keeping? Add it to the shelves.',
      description: 'Save a resource, start a collection, or suggest a link for the curated library.',
      primaryCta: { label: 'Save a link', href: '/create' },
      secondaryCta: { label: 'Suggest a resource', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest saves in this collection.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A calmer way to save and rediscover the web.',
    description: `${brand} is a curated bookmarking library — a place to collect the links, tools and references worth keeping, and to discover the ones worth finding.`,
    paragraphs: [
      'Good resources are easy to lose: buried in tabs, dropped in chats, forgotten in notes. The library keeps them gathered into clean collections that stay easy to browse.',
      'Every save carries context — its source, a short note, and a topic — so a link is useful long after the moment you found it. Start from a topic, a collection, or a search and keep discovering.',
    ],
    values: [
      {
        title: 'Curated, not cluttered',
        description: 'Every link is reviewed and given context before it lands on a shelf, so the library stays genuinely useful.',
      },
      {
        title: 'Organized for discovery',
        description: 'Collections and topics turn a pile of bookmarks into something you can actually browse and return to.',
      },
      {
        title: 'Calm and trustworthy',
        description: 'Clean structure and clear sources help you find the right resource faster, without the noise.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${brand}`,
    title: 'Tell us what belongs in the library.',
    description: 'Suggest a resource, propose a collection, or ask about curation — we will route it to the right shelf instead of a generic inbox.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search saved links, collections, topics and resources across the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find the exact resource you need.',
      description: 'Search by keyword, topic or collection to surface saved links and resources from across the library.',
      placeholder: 'Search links, tools, topics, or collections',
    },
    resultsTitle: 'Across the library',
  },
  create: {
    metadata: {
      title: 'Save a link',
      description: 'Save a new link or resource to the library.',
    },
    locked: {
      badge: 'Curator access',
      title: 'Sign in to save links to the library.',
      description: 'Use your account to open the curation workspace and add resources to your collections.',
    },
    hero: {
      badge: 'Curation workspace',
      title: 'Save a resource to the shelves.',
      description: 'Add the link, give it a source, a short note and a topic, and drop it into the right collection.',
    },
    formTitle: 'Resource details',
    submitLabel: 'Save to library',
    successTitle: 'Saved to the library.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the library.',
      badge: 'Curator access',
      title: 'Welcome back to your shelves.',
      description: 'Sign in to keep saving links, building collections and curating the library from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create one first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create a library account.',
      badge: 'Join the library',
      title: 'Start your own shelves.',
      description: 'Create an account to save links, organize collections and curate resources across the library.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reading',
      fallbackTitle: 'Reading details',
    },
    listing: {
      relatedTitle: 'Related places',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'More from this curator',
      fallbackDescription: 'Curator details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const
