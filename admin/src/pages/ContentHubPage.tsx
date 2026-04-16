const completedResources = [
  'Hero (singleton)',
  'About (singleton)',
  'Settings (singleton)',
  'Skills',
  'Projects',
  'Experience',
  'Services',
  'Testimonials',
  'Blog Posts',
  'Social Links',
  'Contact Messages',
];

const remainingEnhancements = [
  'Inline validation messages per field',
  'Bulk reorder UI for collections',
  'Richer markdown editor for blog content',
  'Optimistic updates and toast notifications',
];

export default function ContentHubPage() {
  return (
    <div>
      <h2>Content Hub</h2>
      <p className="subtitle">
        All core admin CRUD modules are implemented and connected to backend APIs.
      </p>

      <ul className="hub-list">
        {completedResources.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <h3>Next Enhancements</h3>
      <ul className="hub-list">
        {remainingEnhancements.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
