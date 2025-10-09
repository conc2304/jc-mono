import { Typography, TypographyProps } from '@mui/material';

export const SectionTitle = ({
  title,
  ...props
}: { title: string } & TypographyProps) => (
  <Typography
    variant="h3"
    gutterBottom
    color="primary"
    fontWeight="bold"
    mx="auto"
    my={3}
    textAlign="center"
    {...props}
  >
    {title}
  </Typography>
);
