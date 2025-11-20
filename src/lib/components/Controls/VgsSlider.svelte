<script lang="ts">
  import { VGS } from '../../models/mosfet';

  let value = 2.5;
  
  $: VGS.set(value);
</script>

<div class="slider-container">
  <label for="vgs-slider">
    VGS: {value.toFixed(2)} V
  </label>
  <input
    id="vgs-slider"
    type="range"
    min="0"
    max="5"
    step="0.1"
    bind:value={value}
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
