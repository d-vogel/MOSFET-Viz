<script lang="ts">
  import { VDS, VGS, VdsSat } from '../../models/mosfet';

  let value = 3.0;
  let vgs = 2.5;
  
  VGS.subscribe(v => vgs = v);
  
  $: vdsSat = VdsSat(vgs);
  $: snapThreshold = 0.15; // Snap within 0.15V of VdsSat
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let newValue = parseFloat(target.value);
    
    // Snap to VdsSat if within threshold
    if (Math.abs(newValue - vdsSat) < snapThreshold) {
      newValue = vdsSat;
    }
    
    value = newValue;
    VDS.set(value);
  }
</script>

<div class="slider-container">
  <label for="vds-slider">
    VDS: {value.toFixed(2)} V {Math.abs(value - vdsSat) < 0.01 ? '(VDSsat)' : ''}
  </label>
  <input
    id="vds-slider"
    type="range"
    min="0"
    max="5"
    step="0.01"
    value={value}
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
