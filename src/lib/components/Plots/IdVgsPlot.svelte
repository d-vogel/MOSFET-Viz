<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { VGS, VDS, Id, params } from '../../models/mosfet';
  import { createXScale, createYScale, drawXAxis, drawYAxis, drawCurve, drawPoint, type AxisConfig } from '../../utils/d3helpers';

  let svg: SVGSVGElement;
  let vgs = 2.5;
  let vds = 3.0;
  
  VGS.subscribe(value => vgs = value);
  VDS.subscribe(value => vds = value);

  const config: AxisConfig = {
    width: 100,
    height: 300,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 40,
    marginLeft: 50
  };

  let containerWidth = 400;

  function updatePlot() {
    if (!svg) return;

    // Update config width based on container
    config.width = containerWidth;

    const svgSelection = d3.select(svg);
    svgSelection.selectAll('*').remove();

    // Calculate y-axis max as 1.5 times current operating point ID
    const currentId = Id(vgs, vds);
    const yMax = currentId > 3 ? currentId * 1.5 : 3;

    const xScale = createXScale([0, 5], config);
    const yScale = createYScale([0, yMax], config);

    drawXAxis(svgSelection, xScale, config, 'VGS (V)');
    drawYAxis(svgSelection, yScale, config, 'ID (mA)');

    const points: [number, number][] = [];
    const samples = 100;
    for (let i = 0; i <= samples; i++) {
      const v = (5 * i) / samples;
      points.push([v, Id(v, vds)]);
    }

    drawCurve(svgSelection, points, xScale, yScale, 'id-curve', 'var(--curve-color)');

    svgSelection.append('line')
      .attr('x1', xScale(params.Vth))
      .attr('y1', yScale(0))
      .attr('x2', xScale(params.Vth))
      .attr('y2', yScale(yMax))
      .attr('stroke', 'var(--boundary-color)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');
    // Add background rectangle for Vth label
    svgSelection.append('rect')
      .attr('x', xScale(params.Vth) - 12)
      .attr('y', yScale(yMax) + 12)
      .attr('width', 24)
      .attr('height', 16)
      .attr('fill', 'var(--plot-bg)')
      .attr('stroke', 'var(--boundary-color)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('rx', 2);

    svgSelection.append('text')
      .attr('x', xScale(params.Vth))
      .attr('y', yScale(yMax)+25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'var(--boundary-color)')
      .text('V')
      .append('tspan')
      .attr('baseline-shift', 'sub')
      .attr('font-size', '10px')
      .text('TH');

    drawPoint(svgSelection, vgs, currentId, xScale, yScale, 'operating-point', 'var(--point-color)');

    svgSelection.append('text')
      .attr('x', config.width / 2)
      .attr('y', config.marginTop - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', 'var(--text-primary)')
      .text(`ID vs VGS (VDS = ${vds.toFixed(2)}V)`);
  }

  $: vgs, vds, updatePlot();

  onMount(() => {
    // Get container width on mount
    if (svg && svg.parentElement) {
      containerWidth = svg.parentElement.clientWidth;
    }
    updatePlot();
  });
</script>

<svg bind:this={svg} width="100%" height={config.height}></svg>

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
