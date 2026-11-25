<script lang="ts">
  import { VGS, VDS, Id, params } from '../../models/mosfet';
  import Plot from './Plot.svelte';

  // Sweep descriptor: ID as a function of VGS at the current VDS.
  // Values track the app-wide stores; Plot owns all drawing.
  let vgs = 2.5;
  let vds = 3.0;

  VGS.subscribe(value => (vgs = value));
  VDS.subscribe(value => (vds = value));

  $: curve = (v: number) => Id(v, vds);
  $: boundary = { x: params.Vth, label: 'V', sublabel: 'TH', boxWidth: 24 };
  $: operatingPoint = { x: vgs, y: Id(vgs, vds) };
  $: title = `ID vs VGS (VDS = ${vds.toFixed(2)}V)`;
</script>

<Plot {curve} {boundary} {operatingPoint} {title} xAxisLabel="VGS (V)" />
