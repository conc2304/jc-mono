import { Box } from '@mui/system';
import { TorusFieldLoading } from './torus-field';
import { CyberpunkBootSequence } from './boot-sequence-full';
import GSAPTextExamples, { GlitchText } from './temp';
import { BootTextExample } from './boot-text-sequence';

export default function Index() {
  return (
    <Box>
      <Box>
        <Box
          sx={{
            opacity: 0.5,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          {/* <CyberpunkBootSequence /> */}
          {/* <GSAPTextExamples /> */}
          {/* <Box
            sx={{ position: 'relative', margin: '0 auto', textAlign: 'center' }}
          >
            <GlitchText variant="h1">STUFF THAT HAS STUFF</GlitchText>
          </Box> */}
          <BootTextExample />
        </Box>
        <Box
          sx={{
            opacity: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          {/* <TorusFieldLoading /> */}
        </Box>
      </Box>
    </Box>
  );
}
