import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';
import { Portal } from './Portal';

const meta: Meta<typeof Portal> = {
  title: 'Components/Portal',
  component: Portal,
  tags: ['autodocs'],
  argTypes: {
    container: {
      control: { type: 'object' },
      description: 'Custom container element for the portal',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the portal content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Portal>;

export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='p-4 border rounded-lg relative'>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close Portal' : 'Open Portal'}
        </Button>

        {isOpen && (
          <Portal>
            <div className='p-4 mt-2 bg-background border rounded-lg shadow-lg'>
              <h3 className='text-lg font-medium'>Portal Content</h3>
              <p className='text-muted-foreground'>
                This content is rendered outside the parent DOM hierarchy
              </p>
            </div>
          </Portal>
        )}
      </div>
    );
  },
};

export const CustomContainer: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [customContainer, setCustomContainer] = useState<HTMLElement | null>(
      null,
    );

    return (
      <div className='space-y-4'>
        <div className='p-4 border rounded-lg'>
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close Portal' : 'Open in Custom Container'}
          </Button>
        </div>

        <div
          ref={node => setCustomContainer(node)}
          className='p-4 border-2 border-dashed rounded-lg bg-muted/50 min-h-[200px]'
        >
          <p className='text-sm text-muted-foreground'>Custom container area</p>

          {isOpen && customContainer && (
            <Portal container={customContainer}>
              <div className='p-4 mt-2 bg-background border rounded-lg'>
                <p>This content is portaled to the custom container</p>
              </div>
            </Portal>
          )}
        </div>
      </div>
    );
  },
};

export const DynamicContent: Story = {
  render: () => {
    const [count, setCount] = useState(0);

    return (
      <div className='p-4 border rounded-lg'>
        <Button onClick={() => setCount(c => c + 1)}>
          Update Portal Content
        </Button>

        <Portal>
          <div className='p-4 mt-2 bg-background border rounded-lg shadow-lg fixed bottom-4 right-4'>
            <p className='text-muted-foreground'>Count: {count}</p>
          </div>
        </Portal>
      </div>
    );
  },
};
