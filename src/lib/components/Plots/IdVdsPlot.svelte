<script lang="ts">
  import { device, operatingPoint } from '../../state';
  import Plot from './Plot.svelte';

  // Sweep descriptor: ID as a function of VDS at the current VGS.
  // Values track the app-wide operating point; Plot owns all drawing.
  $: op = $operatingPoint;
  $: curve = (v: number) => device.Id(op.vgs, v);
  $: boundary = { x: device.VdsSat(op.vgs), label: 'V', sublabel: 'DS,SAT', boxWidth: 42 };
  $: point = { x: op.vds, y: device.Id(op.vgs, op.vds) };
  $: title = `ID vs VDS (VGS = ${op.vgs.toFixed(2)}V)`;
</script>

<Plot {curve} {boundary} operatingPoint={point} {title} xAxisLabel="VDS (V)" />
