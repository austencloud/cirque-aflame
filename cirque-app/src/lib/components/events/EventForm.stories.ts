import type { Meta, StoryObj } from '@storybook/svelte';
import EventForm from './EventForm.svelte';

const meta = {
  title: 'Components/Events/EventForm',
  component: EventForm,
  tags: ['autodocs'],
  argTypes: {
    submitLabel: {
      control: 'text',
      description: 'Label for the submit button',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state for the form',
    },
    showCancelButton: {
      control: 'boolean',
      description: 'Show or hide the cancel button',
    },
  },
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
} satisfies Meta<EventForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    submitLabel: 'Create Event',
    isLoading: false,
    showCancelButton: true,
    event: null,
    preselectedClientId: null,
    preselectedPerformerId: null,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    submitLabel: 'Creating...',
    isLoading: true,
    showCancelButton: true,
    event: null,
  },
};

// Edit existing event
export const EditEvent: Story = {
  args: {
    submitLabel: 'Update Event',
    isLoading: false,
    showCancelButton: true,
    event: {
      id: 'evt-123',
      name: 'Summer Music Festival',
      date: new Date('2025-07-15'),
      client: 'client-456',
      location: {
        address: '123 Main St, Seattle, WA 98101',
        notes: 'Outdoor venue',
        mapLink: 'https://maps.google.com/?q=123+Main+St+Seattle+WA',
      },
      status: 'confirmed',
      performers: [],
      services: ['Fire Performance', 'Juggling'],
      performanceTime: {
        start: '18:00',
        end: '20:00',
      },
      callTime: '17:00',
      costume: 'Summer theme - bright colors',
      equipmentNeeded: ['Fire props', 'Sound system'],
      contract: {
        sent: true,
        sentDate: new Date('2025-06-01'),
        received: true,
        receivedDate: new Date('2025-06-05'),
        url: 'https://example.com/contract.pdf',
      },
      deposit: {
        required: true,
        amount: 500,
        received: true,
        receivedDate: new Date('2025-06-10'),
      },
      payment: {
        totalValue: 2000,
        paid: false,
        paidDate: null,
        method: 'check',
      },
      notes: 'Client requested extra fire performers',
      clientLiaison: 'John Doe',
      gigManager: 'Jane Smith',
    },
  },
};

// Without cancel button
export const NoCancelButton: Story = {
  args: {
    submitLabel: 'Save Event',
    isLoading: false,
    showCancelButton: false,
    event: null,
  },
};
