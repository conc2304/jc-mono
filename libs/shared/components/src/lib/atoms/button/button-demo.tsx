'use client';

import { ReactNode, SyntheticEvent, useState } from 'react';
import {
  Box,
  ButtonPropsColorOverrides,
  IconButton,
  IconButtonPropsColorOverrides,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  capitalize,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { OverridableStringUnion } from '@mui/types';
import { Property } from 'csstype';
import { RewindIcon, SaveAllIcon, SaveIcon, StarIcon } from 'lucide-react';

import { AugmentedButton as Button } from './button';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

type ButtonColor = OverridableStringUnion<
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning',
  ButtonPropsColorOverrides
>;

type IconButtonColor = OverridableStringUnion<
  | 'default'
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning',
  IconButtonPropsColorOverrides
>;

type ButtonSize = OverridableStringUnion<'large' | 'medium' | 'small'>;

type ButtonType = OverridableStringUnion<'text' | 'outlined' | 'contained'>;

type Props = {
  backgroundColor?: Property.BackgroundColor;
  inheritColor?: Property.Color;
  startIconOn?: boolean;
  endIconOn?: boolean;
  loadingOn?: boolean;
};
export const ButtonDemo = ({
  backgroundColor = '#EBEBEB',
  inheritColor = 'white',
  startIconOn,
  endIconOn,
  loadingOn = true,
}: Props) => {
  const [tabIndex, setTabIndex] = useState(1);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const tabs: Array<ButtonType | 'icon'> = [
    'contained',
    'outlined',
    'text',
    'icon',
  ];
  const sizeRows: Array<ButtonSize> = ['large', 'medium', 'small'];
  const colors: Array<ButtonColor | IconButtonColor> = [
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
    'inherit',
  ];

  const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box
            sx={{
              p: 3,
              background: (theme) =>
                theme.palette.background.default ?? backgroundColor,
            }}
          >
            {children}
          </Box>
        )}
      </div>
    );
  };

  type TableSectionProps = {
    size: ButtonSize;
    buttonVariant: ButtonType | 'icon';
    colors: Array<ButtonColor | IconButtonColor>;
    inheritColor: string;
  };
  const TableSection = ({
    size,
    buttonVariant,
    colors,
    inheritColor,
  }: TableSectionProps) => {
    return (
      <>
        <TableRow>
          <TableCell>{capitalize(size)}</TableCell>
          {[
            ...(buttonVariant === 'icon' ? ['default'] : []),
            ...colors,
            `inherit ${inheritColor}`,
          ].map((color) => (
            <TableCell align="center" key={color}>
              <Box
                component={'span'}
                color={
                  color === `inherit ${inheritColor}` ? inheritColor : undefined
                }
              >
                {buttonVariant !== 'icon' ? (
                  <Button
                    color={
                      color === `inherit ${inheritColor}`
                        ? 'inherit'
                        : (color as ButtonColor)
                    }
                    variant={buttonVariant}
                    size={size}
                    startIcon={startIconOn && <RewindIcon />}
                    endIcon={endIconOn && <SaveAllIcon />}
                  >
                    Label
                  </Button>
                ) : (
                  <IconButton
                    color={
                      color === `inherit ${inheritColor}`
                        ? 'inherit'
                        : (color as IconButtonColor)
                    }
                    size={size}
                  >
                    <StarIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            </TableCell>
          ))}
        </TableRow>
        {/* Disabled Styles */}
        <TableRow>
          <TableCell align="left">
            <Typography variant="caption">disabled</Typography>
          </TableCell>
          {[
            ...(buttonVariant === 'icon' ? ['default'] : []),
            ...colors,
            `inherit ${inheritColor}`,
          ].map((color) => (
            <TableCell align="center" key={`disabled-${color}`}>
              <Box
                component={'span'}
                color={
                  color === `inherit ${inheritColor}` ? inheritColor : undefined
                }
              >
                {buttonVariant !== 'icon' ? (
                  <Button
                    disabled
                    color={
                      color === `inherit ${inheritColor}`
                        ? 'inherit'
                        : (color as ButtonColor)
                    }
                    variant={buttonVariant}
                    size={size}
                    startIcon={startIconOn && <RewindIcon />}
                    endIcon={endIconOn && <SaveAllIcon />}
                  >
                    Label
                  </Button>
                ) : (
                  <IconButton disabled size={size}>
                    <StarIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            </TableCell>
          ))}
        </TableRow>
        {/* Loading Button Styles */}
        {/* {buttonVariant !== 'icon' && (
          // <TableRow>
          //   <TableCell align="left">
          //     <Typography variant="caption">loading</Typography>
          //   </TableCell>
          //   {[...colors, `inherit ${inheritColor}`].map((color) => (
          //     <TableCell align="center" key={`loading-${color}`}>
          //       <Box
          //         component={'span'}
          //         color={
          //           color === `inherit ${inheritColor}`
          //             ? inheritColor
          //             : undefined
          //         }
          //       >
          //         <LoadingButton
          //           variant={buttonVariant}
          //           color={
          //             color === `inherit ${inheritColor}`
          //               ? 'inherit'
          //               : (color as ButtonColor)
          //           }
          //           size={size}
          //           loading={loadingOn}
          //           startIcon={<SaveIcon />}
          //           loadingPosition="start"
          //           endIcon={endIconOn && <RewindIcon />}
          //         >
          //           Label
          //         </LoadingButton>
          //       </Box>
          //     </TableCell>
          //   ))}
          // </TableRow>
        )} */}
      </>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          {tabs.map((tabName) => (
            <Tab key={tabName} label={tabName.toUpperCase()} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((buttonVariant, i) => (
        <CustomTabPanel value={tabIndex} index={i} key={buttonVariant}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  {[
                    ...(buttonVariant === 'icon' ? ['default'] : []),
                    ...colors,
                    `inherit <'${inheritColor}'>`,
                  ].map((color) => (
                    <TableCell align="center" key={color}>
                      {capitalize(color)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sizeRows.map((size) => (
                  <TableSection
                    key={size}
                    size={size}
                    colors={colors}
                    buttonVariant={buttonVariant}
                    inheritColor={inheritColor}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
      ))}
    </Box>
  );
};
