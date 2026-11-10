import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Status' }, // Figma's sample text, for side-by-side comparison
  argTypes: {
    tone: { control: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { tone: 'neutral' } };
export const Info: Story = { args: { tone: 'info' } };
export const Success: Story = { args: { tone: 'success' } };
export const Warning: Story = { args: { tone: 'warning' } };
export const Danger: Story = { args: { tone: 'danger' } };

/** All tones together, matching the Figma component set. */
export const AllTones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
      {(['neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
        <Badge key={tone} {...args} tone={tone} />
      ))}
    </div>
  ),
};
