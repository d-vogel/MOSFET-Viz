<script lang="ts">
  import VgsSlider from './lib/components/Controls/VgsSlider.svelte';
  import VdsSlider from './lib/components/Controls/VdsSlider.svelte';
  import MosfetChannel from './lib/components/Visualization/MosfetChannel.svelte';
  import IdVdsPlot from './lib/components/Plots/IdVdsPlot.svelte';
  import IdVgsPlot from './lib/components/Plots/IdVgsPlot.svelte';
</script>

<main>
  <header>
    <h1>MOSFET Operation Visualization</h1>
    <p>Interactive animation of MOSFET behavior in ohmic and saturation regions</p>
  </header>

  <div class="content">
    <div class="left-panel">
      <div class="visualization">
        <MosfetChannel />
      </div>
    </div>

    <div class="right-panel">
      <div class="plot">
        <IdVdsPlot />
      </div>
      <div class="plot">
        <IdVgsPlot />
      </div>
    </div>
  </div>

  <div class="controls">
    <VgsSlider />
    <VdsSlider />
  </div>
</main>

<style>
  main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .left-panel {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .visualization {
    width: 100%;
    max-width: 600px;
    aspect-ratio: 5 / 3;
  }

  .right-panel {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .plot {
    width: 100%;
  }

  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    background: var(--controls-bg);
    border-radius: 8px;
  }

  @media (max-width: 1024px) {
    .content {
      grid-template-columns: 1fr;
    }

    .controls {
      grid-template-columns: 1fr;
    }
  }
</style>
