<script lang="ts">
  import { VdsSat } from '../../models/mosfet';
  import { operatingPoint, setVds } from '../../operatingPoint';

  $: vgs = $operatingPoint.vgs;
  $: vds = $operatingPoint.vds;
  $: vdsSat = VdsSat(vgs);

  // The snap-to-VdsSat rule lives in setVds, so pointer, keyboard and any
  // future caller behave the same.
  function handleInput(event: Event) {
    setVds(parseFloat((event.target as HTMLInputElement).value));
  }
</script>

<div class="slider-container">
  <label for="vds-slider">
    VDS: {vds.toFixed(2)} V {Math.abs(vds - vdsSat) < 0.01 ? '(VDSsat)' : ''}
  </label>
  <input
    id="vds-slider"
    type="range"
    min="0"
    max="5"
    step="0.01"
    value={vds}
    on:input={handleInput}
  />
</div>

<style>
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    color: var(--text-primary);
  }

  input[type="range"] {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: var(--slider-bg);
    outline: none;
    -webkit-appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }

  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: none;
  }
</style>
