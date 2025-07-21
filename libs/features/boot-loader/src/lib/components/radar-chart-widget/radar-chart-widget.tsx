import * as d3 from 'd3';
import { useEffect, useState, useRef, ReactNode, useMemo } from 'react';
import set from 'lodash.set';
import { useResizeObserver } from './use-resize-observer';
import { Property } from 'csstype';
import { wrap } from '../utils';

// Generic radar data types
export type RadarDataEntry = {
  axis: string;
  value: number;
  metricGroupName?: string;
  formatFn?: (
    n:
      | number
      | {
          valueOf(): number;
        }
  ) => string;
};
export type MetricGroup = RadarDataEntry[];
export type RadarData = MetricGroup[];

// Transition configuration
export type TransitionConfig = {
  duration?: number; // Transition duration in milliseconds
  ease?: (timeStep: number) => number; // D3 easing function
  enabled?: boolean; // Whether transitions are enabled
};

type Props = {
  data?: RadarData;
  id: string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  levels?: number; // How many levels or inner circles should there be drawn
  labelFactor?: number; // How much farther than the radius of the outer circle should the labels be placed
  wrapWidth?: number; // The number of pixels after which a label needs to be given a new line
  opacityArea?: number; // The opacity of the area of the blob
  dotRadius?: number; // The size of the colored circles of each blog
  opacityCircles?: number; // The opacity of the circles of each blob
  strokeWidth?: number; // The width of the stroke around each blob
  roundStrokes?: boolean; // If true the area and stroke will follow a round path (cardinal-closed)
  color?: readonly string[]; // Color array
  lineType?: 'curved' | 'linear';
  areValuesNormalized?: boolean; // If true, all of the values for the different metrics are on the same scale, if false they each have a different scale on their axis
  selectedGroup?: string | 'ALL'; // Generic selected group instead of selectedState
  title?: string | ReactNode;
  maxTopGroups?: number; // Maximum number of top groups to highlight (default: 3)
  colors?: {
    primary?: Property.Color;
    accent?: Property.Color;
    series?: Property.Color[];
  };
  transitionConfig?: TransitionConfig; // NEW: Transition configuration
};

export const RadarChart = ({
  data,
  id,
  margin = {}, // The margins of the SVG
  levels = 3, // How many levels or inner circles should there be drawn
  labelFactor = 1.25, // How much farther than the radius of the outer circle should the labels be placed
  wrapWidth = 60, // The number of pixels after which a label needs to be given a new line
  opacityArea = 0.15, // The opacity of the area of the blob
  dotRadius = 4, // The size of the colored circles of each blog
  opacityCircles = 0.1, // The opacity of the circles of each blob
  strokeWidth = 2, // The width of the stroke around each blob
  color = d3.schemeCategory10, // Color function
  lineType = 'linear',
  areValuesNormalized = true,
  selectedGroup = 'ALL',
  title,
  maxTopGroups = 3,
  colors = {},
  transitionConfig = {}, // NEW: Default empty transition config
}: Props) => {
  const svgRef = useRef<SVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); // Parent of SVG
  const dimensions = useResizeObserver(wrapperRef);

  const colorScale = useRef<d3.ScaleOrdinal<string, unknown, never>>(null);

  const [innerDimension, setInnerDimensions] = useState({ w: 0, h: 0 });
  const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 };
  const marg = { ...defaultMargin, margin };

  const defaultColors = {
    primary: 'red',
    accent: 'orange',
    series: ['white', 'cyan', 'blue'],
  };
  const colorScheme = { ...defaultColors, ...colors };

  // Default transition configuration

  const transitionSettings = useMemo(() => {
    const defaultTransitionConfig: Required<TransitionConfig> = {
      duration: 50,
      ease: d3.easeQuadInOut,
      enabled: true,
    };
    return { ...defaultTransitionConfig, ...transitionConfig };
  }, [
    transitionConfig?.duration,
    transitionConfig?.enabled,
    transitionConfig?.ease,
  ]);

  useEffect(() => {
    // if we dont have data yet dont render
    if (!data || !data.length || !data[0].length) return;
    if (!wrapperRef.current || !dimensions) return;

    const svg = d3.select(svgRef.current);

    const { width: svgWidth, height: svgHeight } =
      wrapperRef.current.getBoundingClientRect();

    const innerWidth = svgWidth - marg.left - marg.right;
    const innerHeight = svgHeight - marg.top - marg.bottom;
    setInnerDimensions({ w: innerWidth, h: innerHeight });

    const tooltip = tooltipRef.current;

    svg.attr('width', svgWidth).attr('height', svgHeight);
    const svgContent = svg
      .select('.content')
      .attr('transform', `translate(${0}, ${0})`);

    // Configure the Chart
    const axisNames = data[0].map((d) => d.axis);
    const axisQty = axisNames.length;
    const diameter = Math.min(innerWidth, innerHeight);
    const radius = diameter / 2 / (labelFactor * 1.2);

    const angleSize = (Math.PI * 2) / axisQty;

    const getMaxByAxis = (axisName: string, data: RadarData) => {
      return d3.max(data, (i) => {
        return d3.max(
          i.map((o) => {
            if (o.axis === axisName) return o.value;
            return 0;
          })
        );
      });
    };

    // add all of the scales to this map for getting later
    const axisScaleMap: Record<
      string,
      d3.ScaleLinear<number, number, never>
    > = {};
    axisNames.forEach((axisName) => {
      const axisMax = getMaxByAxis(axisName, data);
      const axisScale = d3
        .scaleLinear()
        .range([0, radius])
        .domain([0, axisMax === 0 ? 100 : axisMax]);
      set(axisScaleMap, axisName, axisScale);
    });

    const domainMax = d3.max(data, (i) => d3.max(i.map((j) => j.value)));
    const rScale = d3
      .scaleLinear()
      .range([0, radius])
      .domain([0, domainMax === 0 ? 100 : domainMax]);

    const colorSeries = colorScheme.series;
    // not sure why it has to be in this order
    colorScale.current = d3
      .scaleOrdinal()
      .range([colorSeries[2], colorSeries[0], colorSeries[1]]);

    const colorDomain = [...data]
      .filter((entry) => {
        const groupName = entry[0].metricGroupName || '';
        const isGroupSelected =
          selectedGroup &&
          selectedGroup.toLowerCase() === groupName.toLowerCase();

        // filter out the selected group if its not one of the top groups
        if (data.length > maxTopGroups && isGroupSelected) {
          return false;
        }
        return true;
      })
      .map((entry) => entry[0].metricGroupName || '');

    colorScale.current.domain(colorDomain);

    //Draw the background circles
    const axisGrid = svg.select('.axis-grid');

    // Draw the radial axis circles
    axisGrid
      .selectAll('.gridCircle')
      .data(d3.range(1, levels + 1).reverse())
      .join('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d, i) => (radius / levels) * d)
      .attr('cx', svgWidth / 2)
      .attr('cy', svgHeight / 2)
      .style('fill', 'black')
      .style('fill-opacity', opacityCircles)
      .style('stroke', colorScheme.primary)
      .style('stroke-opacity', 0.2)
      .style('filter', 'url(#glow)');

    // Label the Axis Markers
    const getTextAnchorValue = (_, i: number) => {
      const x = Math.cos(angleSize * i - Math.PI / 2);
      const y = Math.sin(angleSize * i - Math.PI / 2);

      if (y === 1 || y === -1) return 'middle';
      if (x > 0) return 'start';
      if (x < 0) return 'end';
      return 'middle';
    };

    axisGrid
      .selectAll('.axis-label')
      .data(axisNames)
      .join('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', getTextAnchorValue)
      .attr('dy', '0.35em')
      .attr(
        'x',
        (d, i) =>
          svgWidth / 2 +
          radius * labelFactor * Math.cos(angleSize * i - Math.PI / 2)
      )
      .attr(
        'y',
        (d, i) =>
          svgHeight / 2 +
          radius * labelFactor * Math.sin(angleSize * i - Math.PI / 2)
      )
      .style('font-size', '12px')
      .style('fill', colorScheme.primary)
      .style('fill-opacity', 0.8)
      .text(function (d) {
        return d;
      })
      .call(wrap, wrapWidth);

    //Create the straight lines radiating outward from the center
    axisGrid
      .selectAll('.line')
      .data(axisNames)
      .join('line')
      .attr('x1', svgWidth / 2)
      .attr('y1', svgHeight / 2)
      .attr('x2', function (d, i) {
        return svgWidth / 2 + radius * Math.cos(angleSize * i - Math.PI / 2);
      })
      .attr('y2', function (d, i) {
        return svgHeight / 2 + radius * Math.sin(angleSize * i - Math.PI / 2);
      })
      .attr('class', 'line')
      .attr('mix-blend-mode', 'multiply')
      .style('stroke', colorScheme.primary)
      .style('stroke-opacity', '0.4')
      .style('stroke-width', '0.5px');

    // Draw the Radar Points and Lines
    const radarLineGenerator = d3
      .lineRadial()
      .curve(
        lineType === 'linear' ? d3.curveLinearClosed : d3.curveCardinalClosed
      )
      //@ts-ignore
      .radius((d: { axis: string; value: number }) => {
        const thisScale = areValuesNormalized ? rScale : axisScaleMap[d.axis];
        return thisScale(d.value);
      })
      .angle((d, i) => i * angleSize);

    // add a wrapper for each item
    const radarWrapper = svgContent
      .selectAll('.radar-wrapper')
      .data(data)
      .join('g')
      .attr('class', 'radar-wrapper')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);

    // Helper function to get group name from data entry
    const getGroupName = (d: RadarDataEntry[]) => d[0].metricGroupName || '';

    // Helper function to check if group is selected
    const isGroupSelected = (groupName: string) =>
      selectedGroup && selectedGroup.toLowerCase() === groupName.toLowerCase();

    // Helper function to create transition
    const createTransition = (selection: any) => {
      if (transitionSettings.enabled) {
        return selection
          .transition()
          .duration(transitionSettings.duration)
          .ease(transitionSettings.ease);
      }
      return selection;
    };

    // PROPER D3 ENTER/UPDATE/EXIT PATTERN: background of area
    const radarAreas = radarWrapper.selectAll('.radar-area').data(
      (d) => [d],
      (d) => getGroupName(d)
    ); // Use group name as key

    // Merge enter and update selections for common operations
    radarAreas
      .enter()
      .append('path')
      .attr('class', 'radar-area')
      .style('fill-opacity', 0) // Start invisible for enter transition
      .merge(radarAreas) // Merge with existing elements
      .on('mouseover', function (event: MouseEvent, d) {
        if (!tooltip) return;

        //Dim all blobs
        d3.selectAll('.radar-area')
          .transition()
          .duration(transitionSettings.duration)
          .style('fill-opacity', 0.1);
        //Bring back the hovered over blob
        d3.select(this)
          .transition()
          .duration(transitionSettings.duration)
          .style('fill-opacity', 0.5);

        // prep the tooltip
        const groupName = getGroupName(d);

        tooltip.innerHTML = backgroundAreaTooltip(groupName, d);
        const tWidth = 240;
        tooltip.style.width = `${tWidth}px`;
        const tooltipXPos = innerWidth - tWidth / 4;

        tooltip.style.left = `${tooltipXPos}px`;
        tooltip.style.top = `${0}px`;
        tooltip.classList.add('active');
      })
      .on('mouseout', function () {
        //Bring back all blobs
        if (!tooltip) return;

        d3.selectAll('.radar-area')
          .transition()
          .duration(transitionSettings.duration)
          .style('fill-opacity', opacityArea);
        tooltip.classList.remove('active');
      })
      .call((selection) =>
        createTransition(selection)
          .attr('d', radarLineGenerator)
          .style('fill', (d) => {
            const groupName = getGroupName(d);
            return isGroupSelected(groupName)
              ? colorScheme.accent
              : colorScale.current
              ? (colorScale.current(groupName) as string)
              : 'orange';
          })
          .style('fill-opacity', opacityArea)
      );

    // Remove exiting areas
    radarAreas
      .exit()
      .call((selection) =>
        createTransition(selection).style('fill-opacity', 0).remove()
      );

    // PROPER D3 ENTER/UPDATE/EXIT PATTERN: add outline of shape
    const radarStrokes = radarWrapper.selectAll('.radar-stroke').data(
      (d) => [d],
      (d) => getGroupName(d)
    ); // Use group name as key

    // Merge enter and update selections
    radarStrokes
      .enter()
      .append('path')
      .attr('class', 'radar-stroke')
      .style('stroke-opacity', 0) // Start invisible for enter transition
      .merge(radarStrokes) // Merge with existing elements
      .call((selection) =>
        createTransition(selection)
          .attr('d', radarLineGenerator)
          .style('stroke-width', strokeWidth + 'px')
          .style('stroke', (d) => {
            const groupName = getGroupName(d);
            return isGroupSelected(groupName)
              ? colorScheme.accent
              : colorScale.current
              ? (colorScale.current(groupName) as string)
              : 'orange';
          })
          .style('fill', 'none')
          .style('filter', 'url(#glow)')
          .style('stroke-opacity', 1)
      );

    // Remove exiting strokes
    radarStrokes
      .exit()
      .call((selection) =>
        createTransition(selection).style('stroke-opacity', 0).remove()
      );

    // PROPER D3 ENTER/UPDATE/EXIT PATTERN: add the data points
    const radarCircles = radarWrapper.selectAll('.radar-circle').data(
      (d) => d,
      (d: any) => `${getGroupName([d])}-${d.axis}`
    ); // Use composite key

    // Merge enter and update selections
    radarCircles
      .enter()
      .append('circle')
      .attr('class', 'radar-circle')
      .attr('r', 0) // Start with radius 0 for enter transition
      .style('fill-opacity', 0) // Start invisible
      .merge(radarCircles) // Merge with existing elements
      .call((selection) =>
        createTransition(selection)
          .attr('r', dotRadius)
          .attr('cx', (d: { axis: string; value: number }, i: number) => {
            const axisName = d.axis;
            const scale = areValuesNormalized ? rScale : axisScaleMap[axisName];
            return scale(d.value) * Math.cos(angleSize * i - Math.PI / 2);
          })
          .attr('cy', function (d, i) {
            const axisName = d.axis;
            const scale = areValuesNormalized ? rScale : axisScaleMap[axisName];
            return scale(d.value) * Math.sin(angleSize * i - Math.PI / 2);
          })
          .style('fill', (d) => {
            const groupName = d.metricGroupName || '';
            return isGroupSelected(groupName)
              ? colorScheme.accent
              : colorScale.current
              ? (colorScale.current(groupName) as string)
              : 'orange';
          })
          .style('fill-opacity', 0.8)
      );

    // Remove exiting circles
    radarCircles
      .exit()
      .call((selection) =>
        createTransition(selection)
          .attr('r', 0)
          .style('fill-opacity', 0)
          .remove()
      );

    // PROPER D3 ENTER/UPDATE/EXIT PATTERN: Radar tooltip (invisible circles)
    const circleWrapper = svgContent
      .selectAll('.circle-wrapper')
      .data(data)
      .join('g')
      .attr('class', 'circle-wrapper')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);

    const invisibleCircles = circleWrapper.selectAll('.invisible-circle').data(
      (d) => d,
      (d: any) => `${d.metricGroupName}-${d.axis}`
    ); // Use composite key

    // Merge enter and update selections
    invisibleCircles
      .enter()
      .append('circle')
      .attr('class', 'invisible-circle')
      .attr('r', dotRadius * 1.5)
      .attr('fill', 'none')
      .style('pointer-events', 'all')
      .merge(invisibleCircles) // Merge with existing elements
      .on('mouseover', function (event, d) {
        if (!tooltip) return;

        const newX = parseFloat(d3.select(this).attr('cx')) + 20;
        const newY = parseFloat(d3.select(this).attr('cy')) - 16;

        const groupName = d.metricGroupName || 'Unknown';
        const formattedValue = d.formatFn
          ? d.formatFn(d.value)
          : d.value.toString();

        tooltip.innerHTML = `<div><span>${groupName}</span>: ${formattedValue}</div>`;
        tooltip.style.left = `${newX + svgWidth / 2}px`;
        tooltip.style.top = `${newY + svgHeight / 2}px`;
        tooltip.style.width = '150px';
        tooltip.classList.add('active');
      })
      .on('mouseout', function () {
        if (!tooltip) return;

        tooltip.classList.remove('active');
      })
      .call((selection) =>
        createTransition(selection)
          .attr('cx', (d: { axis: string; value: number }, i: number) => {
            const axisName = d.axis;
            const scale = areValuesNormalized ? rScale : axisScaleMap[axisName];
            return scale(d.value) * Math.cos(angleSize * i - Math.PI / 2);
          })
          .attr('cy', function (d, i) {
            const axisName = d.axis;
            const scale = areValuesNormalized ? rScale : axisScaleMap[axisName];
            return scale(d.value) * Math.sin(angleSize * i - Math.PI / 2);
          })
      );

    // Remove exiting invisible circles
    invisibleCircles.exit().remove();
  }, [
    data,
    selectedGroup,
    maxTopGroups,
    wrapperRef,
    dimensions,
    transitionSettings,
  ]);

  function backgroundAreaTooltip(groupName: string, data: RadarDataEntry[]) {
    const lineItem = (entry: RadarDataEntry) => `
    <div>
      <strong>${entry.axis}:</strong>
      <span>${entry.formatFn ? entry.formatFn(entry.value) : entry.value}</span>
    </div>`;

    const tableData = data.map(lineItem).toString().replaceAll('</div>,', '');
    return (
      `
      <div>
        <div class="text-center"><strong>${groupName}</strong></div>` +
      tableData +
      `</div>`
    );
  }

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      className={`${id}-wrapper radar-chart position-relative d-flex flex-column justify-content-center`}
    >
      {title && (
        <div
          className="radar-title"
          style={{ position: 'relative', top: 0, left: 10, fontSize: '14px' }}
        >
          {title}
        </div>
      )}
      <div
        ref={wrapperRef}
        style={{ width: '100%', height: '100%', position: 'relative' }}
        className={`${id}-wrapper radar-chart position-relative`}
      >
        <svg ref={svgRef}>
          <defs>
            <clipPath id={`${id}`}>
              <rect x="0" y="0" width={innerDimension.w} height="100%" />
            </clipPath>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="content" clipPath={`url(#${id})`}>
            <g className="axis-grid" />
          </g>
        </svg>
        {/* <div ref={tooltipRef} className="tooltip-ui"></div> */}
      </div>
    </div>
  );
};
