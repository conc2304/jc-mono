import {
  Paper,
  PaperProps,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { RadarData } from '../radar-chart-widget';
import { rollup } from 'd3';

const DataPanelStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  minHeight: 128,
  borderRadius: 0,

  '&[data-augmented-ui]': {
    '--aug-bl': '0.5rem',
    '--aug-br': '0.5rem',
    '--aug-tl': '0.5rem',
    '--aug-tr': '0.5rem',
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.primary.main,
  },
}));

const DataPanelAugmented = (props: PaperProps) => (
  <DataPanelStyled
    data-augmented-ui="border bl-clip br-clip tl-2-clip-y tr-clip "
    {...props}
  />
);

interface DataPanelProps {
  metrics: RadarData;
  title?: string;
  maxDisplayedMetrics?: number;
  showGroupNames?: boolean; // Whether to display metric group names
}

export const DataPanel: React.FC<DataPanelProps> = ({
  metrics,
  title = 'SYS STATUS',
  maxDisplayedMetrics = 6,
}) => {
  // Format axis name for display (uppercase, truncate if needed)
  const formatAxisName = (axis: string): string => {
    return axis.toUpperCase().substring(0, 10); // Truncate to fit panel width
  };

  const displayMetrics = metrics.slice(0, maxDisplayedMetrics);
  const flatData = displayMetrics.flat();
  const metricGroups = rollup(
    flatData,
    (values) => ({
      axis: values[0].axis,
      allMetricGroupValues: values.map((d) => ({
        groupId: d.metricGroupName,
        value: d.formatFn ? d.formatFn(d.value) : d.value,
      })),
    }),
    (d) => d.axis
  );
  const metricData = Array.from(metricGroups.values());

  const MetricRow = ({
    axisTitle,
    metrics,
  }: {
    axisTitle: string;
    metrics: { value: any; groupId: any }[];
  }) => {
    return (
      <TableRow>
        <TableCell
          component="th"
          sx={{
            textWrap: 'nowrap',
            p: 0,
          }}
        >
          {formatAxisName(axisTitle)}:
        </TableCell>
        {metrics.map((m) => (
          <TableCell
            key={axisTitle + m.groupId}
            sx={{ p: 0, textAlign: 'right' }}
          >
            <Typography fontSize="0.75rem">{m.value}</Typography>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  return (
    <DataPanelAugmented elevation={0}>
      <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          mb: 1,
          display: 'block',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      <Table size="small">
        <TableBody>
          {metricData.map((metric, index) => (
            <MetricRow
              key={metric.axis}
              axisTitle={metric.axis}
              metrics={metric.allMetricGroupValues}
            />
          ))}
        </TableBody>
      </Table>

      {displayMetrics.length === 0 && (
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', textAlign: 'center' }}
        >
          No data available
        </Typography>
      )}
    </DataPanelAugmented>
  );
};
