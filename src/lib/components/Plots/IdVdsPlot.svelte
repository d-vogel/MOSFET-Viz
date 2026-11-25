<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { VGS, VDS, Id, VdsSat } from '../../models/mosfet';
  import { createXScale, createYScale, drawXAxis, drawYAxis, drawCurve, drawPoint, selectOrAppend, type AxisConfig } from '../../utils/d3helpers';

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

    // Calculate y-axis max as 1.5 times current operating point ID
    const currentId = Id(vgs, vds);
    const yMax = currentId > 3 ? currentId * 1.5 : 3;

    const xScale = createXScale([0, 5], config);
    const yScale = createYScale([0, yMax], config);

    drawXAxis(svgSelection, xScale, config, 'VDS (V)');
    drawYAxis(svgSelection, yScale, config, 'ID (mA)');

    const points: [number, number][] = [];
    const samples = 100;
    for (let i = 0; i <= samples; i++) {
      const v = (5 * i) / samples;
      points.push([v, Id(vgs, v)]);
    }

    drawCurve(svgSelection, points, xScale, yScale, 'id-curve', 'var(--curve-color)');

    const vdsSat = VdsSat(vgs);
    const regionPoints: [number, number][] = [[0, 0], [vdsSat, Id(vgs, vdsSat)], [vdsSat, 0]];

    // Boundary line, label background and label: created once, updated in place.
    selectOrAppend(svgSelection, 'line.boundary-line', parent =>
      parent.append<SVGLineElement>('line').attr('class', 'boundary-line'))
      .attr('x1', xScale(vdsSat))
      .attr('y1', yScale(0))
      .attr('x2', xScale(vdsSat))
      .attr('y2', yScale(yMax))
      .attr('stroke', 'var(--boundary-color)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    selectOrAppend(svgSelection, 'rect.boundary-label-bg', parent =>
      parent.append<SVGRectElement>('rect').attr('class', 'boundary-label-bg'))
      .attr('x', xScale(vdsSat) - 21)
      .attr('y', yScale(yMax) + 12)
      .attr('width', 42)
      .attr('height', 24)
      .attr('fill', 'var(--plot-bg)')
      .attr('stroke', 'var(--boundary-color)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('rx', 2);

    // Label content ('V' + subscript) is static, so it is created once;
    // only the position is updated.
    selectOrAppend(svgSelection, 'text.boundary-label', parent => {
      const text = parent.append<SVGTextElement>('text')
        .attr('class', 'boundary-label')
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'var(--boundary-color)')
        .text('V');
      text.append<SVGTSpanElement>('tspan')
        .attr('baseline-shift', 'sub')
        .attr('font-size', '10px')
        .text('DS,SAT');
      return text;
    })
      .attr('x', xScale(vdsSat))
      .attr('y', yScale(yMax) + 25);

    drawPoint(svgSelection, vds, currentId, xScale, yScale, 'operating-point', 'var(--point-color)');

    selectOrAppend(svgSelection, 'text.plot-title', parent =>
      parent.append<SVGTextElement>('text').attr('class', 'plot-title'))
      .attr('x', config.width / 2)
      .attr('y', config.marginTop - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', 'var(--text-primary)')
      .text(`ID vs VDS (VGS = ${vgs.toFixed(2)}V)`);
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
