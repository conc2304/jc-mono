import { useState, useLayoutEffect, useRef } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { Property } from 'csstype';
interface OverflowChipContainerProps {
  tags?: string[];
  favorite?: boolean;
  color: Property.Color;
}
export const OverflowChipContainer = ({
  tags = [],
  favorite = false,
  color,
}: OverflowChipContainerProps) => {
  const [visibleTags, setVisibleTags] = useState(tags);
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const calculateVisibleChips = () => {
      if (!containerRef.current || tags.length === 0) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;

      // Account for star icon width and gaps
      const starWidth = favorite ? 16 + 8 : 0; // 16px icon + 8px gap
      const availableWidth = containerWidth - starWidth - 16; // extra padding

      let totalWidth = 0;
      let visibleCount = 0;
      const moreChipWidth = 80; // Approximate width for "X more" chip

      // Create temporary elements to measure chip widths
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.top = '-1000px';
      tempContainer.style.pointerEvents = 'none';
      document.body.appendChild(tempContainer);

      const chipWidths = tags.map((tag) => {
        // Create a temporary MUI Chip to measure
        const tempChip = document.createElement('div');
        tempChip.className =
          'MuiChip-root MuiChip-outlined MuiChip-sizeSmall MuiChip-colorDefault MuiChip-clickable MuiChip-outlinedDefault';
        tempChip.style.cssText = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 24px;
          outline: 0;
          padding: 0;
          vertical-align: middle;
          box-sizing: border-box;
          font-family: "Roboto","Helvetica","Arial",sans-serif;
          font-size: 0.8125rem;
          font-weight: 400;
          line-height: 1.43;
        `;

        const label = document.createElement('span');
        label.className = 'MuiChip-label MuiChip-labelSmall';
        label.style.cssText = `
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: 8px;
          padding-right: 8px;
          font-size: 0.75rem;
          white-space: nowrap;
        `;
        label.textContent = tag;

        tempChip.appendChild(label);
        tempContainer.appendChild(tempChip);

        const width = tempChip.offsetWidth + 8; // +8 for gap
        return width;
      });

      document.body.removeChild(tempContainer);

      // Calculate visible chips
      for (let i = 0; i < tags.length; i++) {
        const chipWidth = chipWidths[i];
        const remainingChips = tags.length - i - 1;
        const needsMoreChip = remainingChips > 0;
        const requiredWidth =
          totalWidth + chipWidth + (needsMoreChip ? moreChipWidth : 0);

        if (requiredWidth <= availableWidth) {
          totalWidth += chipWidth;
          visibleCount++;
        } else {
          break;
        }
      }

      // Ensure at least one chip is visible if there's space for it
      if (
        visibleCount === 0 &&
        tags.length > 0 &&
        chipWidths[0] <= availableWidth
      ) {
        visibleCount = 1;
      }

      setVisibleTags(tags.slice(0, visibleCount));
      setHiddenTags(tags.slice(visibleCount));
    };

    // Initial calculation with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateVisibleChips, 100);

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(calculateVisibleChips, 50);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [tags, favorite]);

  const renderHiddenTagsList = () => (
    <Box
      data-augmented-ui="border br-clip tl-clip"
      sx={(theme) => ({
        background: theme.palette.background.paper,
        p: 1,
        '&[data-augmented-ui]': {
          '--aug-border-all': '1px',
          '--aug-border-bg': theme.palette.secondary.main,
          '--aug-br': '0.5rem',
          '--aug-tl': '0.5rem',
        },
      })}
    >
      {hiddenTags.map((tag, index) => (
        <Box
          key={tag}
          sx={{
            mb: index < hiddenTags.length - 1 ? 0.5 : 0,
            fontSize: '0.75rem',
            color: 'text.primary',
          }}
        >
          {tag}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      className="OverflowChipContainer--root"
      ref={containerRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        flex: '1 1 auto',
        mr: 1,
        gap: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {/* Render visible chips */}
      {visibleTags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          variant="outlined"
          // color="inherit"
          slotProps={{
            label: {
              sx: { color: color },
            },
          }}
          sx={{ flexShrink: 0 }}
        />
      ))}

      {/* Render "more" chip if there are hidden tags */}
      {hiddenTags.length > 0 && (
        <Tooltip
          title={renderHiddenTagsList()}
          placement="top"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: 'unset',
                m: 0,
                p: 0,
                color: 'text.primary',
                fontSize: '0.75rem',
                maxWidth: 'none',
              },
            },
            arrow: {
              sx: { color: 'secondary.main' },
            },
          }}
        >
          <Chip
            label={`+${hiddenTags.length} more`}
            size="small"
            variant="outlined"
            sx={{
              flexShrink: 0,
              bgcolor: 'action.hover',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.selected',
                borderColor: 'action.selected',
              },
              cursor: 'default',
            }}
            slotProps={{
              label: {
                sx: {
                  color: 'text.secondary',
                  fontWeight: 500,
                },
              },
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};
