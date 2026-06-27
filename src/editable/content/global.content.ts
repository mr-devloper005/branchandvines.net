import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A curated library of saved links',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated collections & saved links',
    // Public navigation — essential pages only. No profile, no raw task feeds.
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Collections', href: '/sbm' },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    searchPlaceholder: 'Search collections & resources',
    actions: {
      primary: { label: 'Browse collections', href: '/sbm' },
      secondary: { label: 'Suggest a link', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Saved links, tools and references worth keeping.',
    description:
      'A curated library for bookmarking and discovering the links, tools and resources worth coming back to — organized into collections you can actually use.',
    newsletter: {
      title: 'Get the weekly shelf',
      description: 'A short note of the best new saves and collections, sent once a week. No noise.',
      placeholder: 'you@example.com',
      cta: 'Subscribe',
    },
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'All collections', href: '/sbm' },
          { label: 'Popular this week', href: '/sbm' },
          { label: 'Latest saves', href: '/sbm' },
          { label: 'Search the library', href: '/search' },
        ],
      },
      {
        title: 'Library',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for calm discovery and links worth keeping.',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest saves',
    related: 'Related',
    published: 'Saved',
  },
} as const
