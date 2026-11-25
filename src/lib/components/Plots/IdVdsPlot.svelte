<script lang="ts">
  import { VGS, VDS, device } from '../../state';
  import Plot from './Plot.svelte';

  // Sweep descriptor: ID as a function of VDS at the current VGS.
  // Values track the app-wide stores; Plot owns all drawing.
  $: vgs = $VGS;
  $: vds = $VDS;
  $: curve = (v: number) => device.Id(vgs, v);
  $: boundary = { x: device.VdsSat(vgs), label: 'V', sublabel: 'DS,SAT', boxWidth: 42 };
  $: point = { x: vds, y: device.Id(vgs, vds) };
  $: title = `ID vs VDS (VGS = ${vgs.toFixed(2)}V)`;
</script>

<Plot {curve} {boundary} operatingPoint={point} {title} xAxisLabel="VDS (V)" />
