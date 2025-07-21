'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Paper, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: '#121212',
  color: '#ffffff',
  border: ' 1px solid cyan',
  // padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  border: '2px solid red',
  borderRadius: theme.spacing(1),
  // padding: theme.spacing(4),
  width: '100%',
  height: '100%',
}));

export const TrailingRadarChart = ({
  numTails = 4,
  lagSeconds = 1,
  autoStart = true,
  startColor = '#22c55e',
  endColor = '#ef4444',
  baseOpacity = 0.6,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(autoStart);
  const [animationSpeed, setAnimationSpeed] = useState(2000);
  const [tailCount, setTailCount] = useState(numTails);

  // Master data sequence that all layers follow
  const [dataSequence, setDataSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Define the data categories
  const categories = [
    'Performance',
    'Security',
    'Scalability',
    'Usability',
    'Reliability',
    'Maintainability',
  ];

  const maxValue = 100;
  const levels = 5;

  // Generate random data
  const generateRandomData = () => {
    return categories.map((category) => ({
      category,
      value: Math.random() * maxValue,
    }));
  };

  // Initialize data sequence with enough steps for all tails
  useEffect(() => {
    const initialSequence = Array.from({ length: tailCount + 10 }, () =>
      generateRandomData()
    );
    setDataSequence(initialSequence);
  }, [tailCount]);

  // Color interpolator for layers
  const colorInterpolator = d3.interpolate(startColor, endColor);

  // Get data for each layer based on current step and lag
  const getLayerData = (layerIndex, step) => {
    const lagSteps = Math.floor((lagSeconds * 1000) / animationSpeed);
    const layerStep = Math.max(0, step - layerIndex * lagSteps);

    if (layerStep >= dataSequence.length) {
      return dataSequence[dataSequence.length - 1] || generateRandomData();
    }

    return dataSequence[layerStep] || generateRandomData();
  };

  // Get target data for smooth transitions
  const getLayerTargetData = (layerIndex, step) => {
    const lagSteps = Math.floor((lagSeconds * 1000) / animationSpeed);
    const layerStep = Math.max(0, step - layerIndex * lagSteps);
    const nextStep = layerStep + 1;

    if (nextStep >= dataSequence.length) {
      // Generate new data and extend sequence
      const newData = generateRandomData();
      setDataSequence((prev) => [...prev, newData]);
      return newData;
    }

    return dataSequence[nextStep] || generateRandomData();
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const radius =
      Math.min(
        width - margin.left - margin.right,
        height - margin.top - margin.bottom
      ) / 1.25;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Set up the SVG
    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Angle for each axis
    const angleSlice = (Math.PI * 2) / categories.length;

    // Scale for radius
    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    // Create background circles (levels)
    const axisGrid = container.append('g').attr('class', 'axisWrapper');

    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => (radius / levels) * d)
      .style('fill', 'none')
      .style('stroke', '#424242')
      .style('stroke-width', '1px')
      .style('opacity', 0.5);

    // Add level labels
    axisGrid
      .selectAll('.axisLabel')
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', (d) => (-d * radius) / levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .style('fill', '#9e9e9e')
      .style('font-family', 'monospace')
      .text((d) => ((maxValue * d) / levels).toFixed(0));

    // Create axes
    const axis = axisGrid
      .selectAll('.axis')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'axis');

    // Add axis lines
    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr(
        'x2',
        (d, i) =>
          rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        'y2',
        (d, i) =>
          rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .attr('class', 'line')
      .style('stroke', '#616161')
      .style('stroke-width', '2px')
      .style('opacity', 0.6);

    // // Add axis labels
    // axis
    //   .append('text')
    //   .attr('class', 'legend')
    //   .style('font-size', '14px')
    //   .style('fill', '#f5f5f5')
    //   .style('font-family', 'monospace')
    //   .style('font-weight', 'bold')
    //   .attr('text-anchor', 'middle')
    //   .attr('dy', '0.35em')
    //   .attr(
    //     'x',
    //     (d, i) =>
    //       rScale(maxValue * 1.25) * Math.cos(angleSlice * i - Math.PI / 2)
    //   )
    //   .attr(
    //     'y',
    //     (d, i) =>
    //       rScale(maxValue * 1.25) * Math.sin(angleSlice * i - Math.PI / 2)
    //   )
    //   .text((d) => d);

    // Function to create path data
    const radarLine = d3
      .lineRadial()
      .angle((d, i) => i * angleSlice)
      .radius((d) => rScale(d.value))
      .curve(d3.curveLinearClosed);

    // Create layers data
    const layersData = Array.from({ length: tailCount }, (_, i) => ({
      index: i,
      current: getLayerData(i, currentStep),
      target: getLayerTargetData(i, currentStep),
    }));

    // Create layer groups (reverse order so first layer is on top)
    const layerGroups = container
      .selectAll('.layer')
      .data(layersData.slice().reverse())
      .enter()
      .append('g')
      .attr('class', (d) => `layer layer-${d.index}`);

    // Add radar areas for each layer
    const radarPaths = layerGroups
      .append('path')
      .datum((d) => d.current)
      .attr('d', radarLine)
      .style('stroke-width', (d) => 2.5 - d.index * 0.2)
      .style('stroke', (d) => {
        const normalizedIndex = d.index / Math.max(1, tailCount - 1);
        return colorInterpolator(normalizedIndex);
      })
      // .style('fill', (d) => {
      //   const normalizedIndex = d.index / Math.max(1, tailCount - 1);
      //   return colorInterpolator(normalizedIndex);
      // })
      // .style('fill-opacity', (d) => {
      //   // Make all layers translucent with decreasing opacity for tails
      //   const fadeAmount = (tailCount - 1 - d.index) / tailCount;
      //   return baseOpacity * (0.3 + fadeAmount * 0.7);
      // })
      .style('stroke-opacity', (d) => {
        // Stroke opacity follows similar pattern but stays more visible
        const fadeAmount = (tailCount - 1 - d.index) / tailCount;
        return baseOpacity * (0.5 + fadeAmount * 0.5);
      })
      .style('filter', (d) => {
        const normalizedIndex = d.index / Math.max(1, tailCount - 1);
        const color = colorInterpolator(normalizedIndex);
        const intensity = (tailCount - d.index) * 2;
        return `drop-shadow(0 0 ${intensity}px ${color})`;
      });

    // Add data points for each layer
    const dotGroups = layerGroups
      .selectAll('.radarCircle')
      .data((d) => d.current)
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', (d, i, nodes) => {
        const layerData = d3.select(nodes[i].parentNode).datum();
        return 2.5 + (tailCount - 1 - layerData.index) * 0.3;
      })
      .attr(
        'cx',
        (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        'cy',
        (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style('fill', (d, i, nodes) => {
        const layerData = d3.select(nodes[i].parentNode).datum();
        const normalizedIndex = layerData.index / Math.max(1, tailCount - 1);
        return colorInterpolator(normalizedIndex);
      })
      .style('stroke', '#000')
      .style('stroke-width', 0.5)
      .style('opacity', (d, i, nodes) => {
        const layerData = d3.select(nodes[i].parentNode).datum();
        const fadeAmount = (tailCount - 1 - layerData.index) / tailCount;
        return baseOpacity * (0.4 + fadeAmount * 0.6);
      });

    // Add value labels for the front layer only
    if (tailCount > 0) {
      const frontLayerData = getLayerData(0, currentStep);
      container
        .selectAll('.valueLabel')
        .data(frontLayerData)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .style('font-size', '11px')
        .style('fill', '#fff')
        .style('font-family', 'monospace')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .style('opacity', 0.8)
        .attr(
          'x',
          (d, i) =>
            (rScale(d.value) + 20) * Math.cos(angleSlice * i - Math.PI / 2)
        )
        .attr(
          'y',
          (d, i) =>
            (rScale(d.value) + 20) * Math.sin(angleSlice * i - Math.PI / 2)
        )
        .attr('dy', '0.35em')
        .text((d) => d.value.toFixed(0));
    }

    // Animation function
    const animateAllLayers = () => {
      if (!isAnimating) return;

      layersData.forEach((layerData, reversedIndex) => {
        const actualIndex = tailCount - 1 - reversedIndex;
        const interpolators = layerData.current.map((d, i) =>
          d3.interpolate(d.value, layerData.target[i].value)
        );

        const layerGroup = d3.select(`.layer-${actualIndex}`);
        const layerPath = layerGroup.select('path');
        const layerDots = layerGroup.selectAll('.radarCircle');

        const transition = d3
          .transition()
          .duration(animationSpeed)
          .ease(d3.easeQuadInOut);

        transition.tween(`radar-${actualIndex}`, () => {
          return (t) => {
            const interpolatedData = layerData.current.map((d, i) => ({
              ...d,
              value: interpolators[i](t),
            }));

            // Update path
            layerPath.datum(interpolatedData).attr('d', radarLine);

            // Update dots
            layerDots
              .data(interpolatedData)
              .attr(
                'cx',
                (d, i) =>
                  rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
              )
              .attr(
                'cy',
                (d, i) =>
                  rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
              );
          };
        });

        // Update labels for front layer
        if (actualIndex === 0) {
          const labels = container.selectAll('.valueLabel');
          transition.tween('labels', () => {
            return (t) => {
              const interpolatedData = layerData.current.map((d, i) => ({
                ...d,
                value: interpolators[i](t),
              }));

              labels
                .data(interpolatedData)
                .attr(
                  'x',
                  (d, i) =>
                    (rScale(d.value) + 20) *
                    Math.cos(angleSlice * i - Math.PI / 2)
                )
                .attr(
                  'y',
                  (d, i) =>
                    (rScale(d.value) + 20) *
                    Math.sin(angleSlice * i - Math.PI / 2)
                )
                .text((d) => d.value.toFixed(0));
            };
          });
        }
      });
    };

    animateAllLayers();
  }, [
    currentStep,
    isAnimating,
    animationSpeed,
    tailCount,
    lagSeconds,
    startColor,
    endColor,
    dataSequence,
    baseOpacity,
    containerRef,
  ]);

  // Animation step controller
  useEffect(() => {
    if (!isAnimating || dataSequence.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => prev + 1);
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [isAnimating, animationSpeed, dataSequence.length]);

  return (
    <StyledContainer>
      <ChartContainer elevation={0} ref={containerRef}>
        <svg ref={svgRef}></svg>
      </ChartContainer>
    </StyledContainer>
  );
};
