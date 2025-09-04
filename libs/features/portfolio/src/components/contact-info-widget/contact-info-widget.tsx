import { FaLinkedin, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Box, useTheme } from '@mui/material';
import { ResponsiveAction, SpeedDialResponsive } from '@jc/ui-components';
import { RiContactsFill } from 'react-icons/ri';

export const ContactInfoWidget: React.FC = () => {
  const handleLinkClick = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const theme = useTheme();
  const iconProps = {
    color: theme.palette.getInvertedMode('info'),
    size: '1.5rem',
    width: '40px',
  };

  const connectActions: ResponsiveAction[] = [
    {
      key: 'email',
      icon: <MdEmail {...iconProps} />,
      label: 'Email me',
      onClick: () => handleLinkClick('mailto:jose.conchello@gmail.com'),
    },
    {
      key: 'linkedin',
      icon: <FaLinkedin {...iconProps} />,
      label: 'LinkedIn profile',
      onClick: () =>
        handleLinkClick('https://www.linkedin.com/in/jose-conchello/'),
    },
    {
      key: 'github',
      icon: <FaGithub {...iconProps} />,
      label: 'GitHub profile',
      onClick: () => handleLinkClick('https://github.com/conc2304'),
    },
    {
      key: 'instagram',
      icon: <FaInstagram {...iconProps} />,
      label: 'Instagram profile',
      onClick: () => handleLinkClick('https://instagram.com/clyzby'),
    },
    {
      key: 'youtube',
      icon: <FaYoutube {...iconProps} />,
      label: 'YouTube channel',
      onClick: () => handleLinkClick('https://youtube.com/@joseconchello6829'),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SpeedDialResponsive
        slotProps={{
          buttonGroup: {
            lowerClip: '0.25rem',
            upperClip: '1rem',
            buttonSx: {
              px: 2,
            },
          },
          speedDial: {
            mainIcon: (
              <RiContactsFill
                {...iconProps}
                color={theme.palette.background.paper}
              />
            ),
          },
        }}
        actions={connectActions}
        direction="row"
        arcStartDegree={270}
        arcEndDegree={90}
        spacing={1}
        itemSize={44}
      />
    </Box>
  );
};
