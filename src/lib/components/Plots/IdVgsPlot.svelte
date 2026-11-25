<script lang="ts">
  import { device, operatingPoint } from '../../state';
  import Plot from './Plot.svelte';

  // Sweep descriptor: ID as a function of VGS at the current VDS.
  // Values track the app-wide operating point; Plot owns all drawing.
  $: op = $operatingPoint;
  $: curve = (v: number) => device.Id(v, op.vds);
  $: boundary = { x: device.params.Vth, label: 'V', sublabel: 'TH', boxWidth: 24 };
  $: point = { x: op.vgs, y: device.Id(op.vgs, op.vds) };
  $: title = `ID vs VGS (VDS = ${op.vds.toFixed(2)}V)`;
</script>

<Plot {curve} {boundary} operatingPoint={point} {title} xAxisLabel="VGS (V)" />
