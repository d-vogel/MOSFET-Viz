<script lang="ts">
  import { VGS, VDS, device } from '../../state';
  import Plot from './Plot.svelte';

  // Sweep descriptor: ID as a function of VGS at the current VDS.
  // Values track the app-wide stores; Plot owns all drawing.
  $: vgs = $VGS;
  $: vds = $VDS;
  $: curve = (v: number) => device.Id(v, vds);
  $: boundary = { x: device.params.Vth, label: 'V', sublabel: 'TH', boxWidth: 24 };
  $: point = { x: vgs, y: device.Id(vgs, vds) };
  $: title = `ID vs VGS (VDS = ${vds.toFixed(2)}V)`;
</script>

<Plot {curve} {boundary} operatingPoint={point} {title} xAxisLabel="VGS (V)" />
