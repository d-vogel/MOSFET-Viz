<script lang="ts">
  import { VGS, VDS, Id, VdsSat } from '../../models/mosfet';
  import Plot from './Plot.svelte';

  // Sweep descriptor: ID as a function of VDS at the current VGS.
  // Values track the app-wide stores; Plot owns all drawing.
  let vgs = 2.5;
  let vds = 3.0;

  VGS.subscribe(value => (vgs = value));
  VDS.subscribe(value => (vds = value));

  $: curve = (v: number) => Id(vgs, v);
  $: boundary = { x: VdsSat(vgs), label: 'V', sublabel: 'DS,SAT', boxWidth: 42 };
  $: operatingPoint = { x: vds, y: Id(vgs, vds) };
  $: title = `ID vs VDS (VGS = ${vgs.toFixed(2)}V)`;
</script>

<Plot {curve} {boundary} {operatingPoint} {title} xAxisLabel="VDS (V)" />
