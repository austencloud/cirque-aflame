// Navigation types for mobile and desktop navigation components

export type ModuleId = string;

export interface Section {
  id: string;
  label: string;
  icon: string;
  color?: string;
  gradient?: string;
  disabled?: boolean;
}

export interface ModuleDefinition {
  id: ModuleId;
  label: string;
  icon: string;
  color?: string;
  isMain?: boolean;
  sections: Section[];
}

// Predefined module configurations for CircusSync
export const circusSyncModules: ModuleDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    color: 'flame',
    isMain: true,
    sections: [],
  },
  {
    id: 'events',
    label: 'Events',
    icon: 'calendar',
    color: 'royal',
    isMain: true,
    sections: [],
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: 'users',
    color: 'cyan',
    isMain: true,
    sections: [
      {
        id: 'all-clients',
        label: 'All Clients',
        icon: 'list',
        color: '#06b6d4',
      },
      {
        id: 'active',
        label: 'Active',
        icon: 'user-check',
        color: '#10b981',
      },
      {
        id: 'archived',
        label: 'Archived',
        icon: 'archive',
        color: '#6b7280',
      },
    ],
  },
  {
    id: 'performers',
    label: 'Performers',
    icon: 'star',
    color: 'gold',
    isMain: true,
    sections: [
      {
        id: 'roster',
        label: 'Roster',
        icon: 'users',
        color: 'var(--color-gold-600)',
      },
      {
        id: 'skills',
        label: 'Skills & Acts',
        icon: 'star',
        color: '#f59e0b',
      },
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: 'briefcase',
    color: 'purple',
    isMain: true,
    sections: [
      {
        id: 'all-agents',
        label: 'All Agents',
        icon: 'list',
        color: '#a855f7',
      },
    ],
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: 'file-text',
    color: 'green',
    isMain: true,
    sections: [
      {
        id: 'active-contracts',
        label: 'Active',
        icon: 'file-contract',
        color: '#10b981',
      },
      {
        id: 'pending',
        label: 'Pending',
        icon: 'clock',
        color: '#f59e0b',
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: 'copy',
        color: '#6366f1',
      },
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'check-square',
    color: 'blue',
    isMain: true,
    sections: [
      {
        id: 'my-tasks',
        label: 'My Tasks',
        icon: 'user',
        color: '#3b82f6',
      },
      {
        id: 'completed',
        label: 'Completed',
        icon: 'check-circle',
        color: '#10b981',
      },
    ],
  },
];
