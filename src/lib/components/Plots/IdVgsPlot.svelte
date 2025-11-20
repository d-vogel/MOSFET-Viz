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
    width: 400,
    height: 300,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 40,
    marginLeft: 50
  };

  function updatePlot() {
    if (!svg) return;

    const svgSelection = d3.select(svg);
    svgSelection.selectAll('*').remove();

    const xScale = createXScale([0, 5], config);
    const yScale = createYScale([0, 3], config);

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
      .attr('y2', yScale(3))
      .attr('stroke', 'var(--boundary-color)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    const currentId = Id(vgs, vds);
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
    updatePlot();
  });
</script>

<svg bind:this={svg} width={config.width} height={config.height}></svg>

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
