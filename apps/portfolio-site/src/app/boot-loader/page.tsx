import { Box } from '@mui/system';
import { BootMessage, BootUpSequence } from '@jc/boot-loader';
import { Typography } from '@mui/material';

const bootMessages: BootMessage[] = [
  'Initializing system...',
  ['Loading kernel modules...', 'Injecting backdoor...'],
  'Starting network services...',
  ['Mounting file systems...', 'Accessing classified data...'],
  'Starting user services...',
  ['System boot complete.', 'Welcome, Agent Smith.'],
  '',
  'Welcome to Terminal OS v2.1.0',
  ['Type "help" for available commands.', 'Type "hack" to begin infiltration.'],
];

export default function Index() {
  return (
    <Box>
      <BootUpSequence bootMessages={bootMessages} />8
    </Box>
  );
}
