<script context="module" lang="ts">
  /**
   * A dashed vertical marker at a regime boundary, with a boxed,
   * subscripted label drawn on top of it (e.g. V_TH, V_DS,SAT).
   */
  export interface Boundary {
    /** Data-space x position of the dashed line. */
    x: number;
    /** Main label text, e.g. 'V'. */
    label: string;
    /** Subscript text, e.g. 'TH' or 'DS,SAT'. */
    sublabel: string;
    /** Width of the boxed label backing rect, in px. */
    boxWidth: number;
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  /**
   * Deep Plot module.
   *
   * Owns everything about turning a sweep + render inputs into a drawn SVG:
   * scales, axes, the sampled curve, the regime-boundary marker with its
   * boxed subscript label, the operating point, the title, container-width
   * handling and the redraw cycle. Callers describe WHAT to plot; this
   * module decides HOW it is drawn. No d3 code leaks to callers.
   */

  /** ID as a function of the swept variable (held values closed over by the caller). */
  export let curve: (x: number) => number;
  /** Data-space domain of the x axis. */
  export let xDomain: [number, number] = [0, 5];
  export let xAxisLabel: string;
  export let yAxisLabel: string = 'ID (mA)';
  /** Regime boundary to mark, if any. */
  export let boundary: Boundary | null = null;
  /** Current operating point in data space; also drives the y-axis max. */
  export let operatingPoint: { x: number; y: number };
  export let title: string;
  export let curveColor = 'var(--curve-color)';
  export let pointColor = 'var(--point-color)';

  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const samples = 100;

  let svg: SVGSVGElement;
  let containerWidth = 400;

  function updatePlot() {
    if (!svg) return;

    const width = containerWidth;

    const svgSelection = d3.select(svg);
    svgSelection.selectAll('*').remove();

    // Y axis max scales with the operating point: 1.5x its value, floor of 3.
    const yMax = Math.max(3, 1.5 * operatingPoint.y);

    const xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    // X axis
    svgSelection
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));
    svgSelection
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', (width + margin.left - margin.right) / 2)
      .attr('y', height - 5)
      .text(xAxisLabel);

    // Y axis
    svgSelection
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
    svgSelection
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height + margin.top - margin.bottom) / 2)
      .attr('y', 15)
      .text(yAxisLabel);

    // Curve: `samples` points swept across the x domain
    const points: [number, number][] = [];
    for (let i = 0; i <= samples; i++) {
      const v = xDomain[0] + ((xDomain[1] - xDomain[0]) * i) / samples;
      points.push([v, curve(v)]);
    }
    svgSelection
      .append('path')
      .datum(points)
      .attr('class', 'id-curve')
      .attr('fill', 'none')
      .attr('stroke', curveColor)
      .attr('stroke-width', 2)
      .attr('d', d3.line().x(d => xScale(d[0])).y(d => yScale(d[1])));

    // Regime boundary: dashed line + boxed subscript label
    if (boundary) {
      const bx = xScale(boundary.x);
      svgSelection
        .append('line')
        .attr('x1', bx)
        .attr('y1', yScale(0))
        .attr('x2', bx)
        .attr('y2', yScale(yMax))
        .attr('stroke', 'var(--boundary-color)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');
      svgSelection
        .append('rect')
        .attr('x', bx - boundary.boxWidth / 2)
        .attr('y', yScale(yMax) + 12)
        .attr('width', boundary.boxWidth)
        .attr('height', 24)
        .attr('fill', 'var(--plot-bg)')
        .attr('stroke', 'var(--boundary-color)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4')
        .attr('rx', 2);
      svgSelection
        .append('text')
        .attr('x', bx)
        .attr('y', yScale(yMax) + 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'var(--boundary-color)')
        .text(boundary.label)
        .append('tspan')
        .attr('baseline-shift', 'sub')
        .attr('font-size', '10px')
        .text(boundary.sublabel);
    }

    // Operating point
    svgSelection
      .append('circle')
      .attr('class', 'operating-point')
      .attr('cx', xScale(operatingPoint.x))
      .attr('cy', yScale(operatingPoint.y))
      .attr('r', 5)
      .attr('fill', pointColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Title
    svgSelection
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', 'var(--text-primary)')
      .text(title);
  }

  // Redraw whenever any render input changes.
  $: xDomain, xAxisLabel, yAxisLabel, curve, boundary, operatingPoint, title, curveColor, pointColor, updatePlot();

  onMount(() => {
    if (svg && svg.parentElement) {
      containerWidth = svg.parentElement.clientWidth;
    }
    updatePlot();
  });
</script>

<svg bind:this={svg} width="100%" height={height}></svg>

<style>
  svg {
    background: var(--plot-bg);
    border-radius: 8px;
  }

  :global(.id-curve) {
    stroke: var(--curve-color);
  }

  :global(.operating-point) {
    fill: var(--point-color);
  }
</style>
