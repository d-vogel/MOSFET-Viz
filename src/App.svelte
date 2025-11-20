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
    <div class="visualization">
      <MosfetChannel />
    </div>

    <div class="plots-container">
      <div class="plot-with-control">
        <div class="plot">
          <IdVgsPlot />
        </div>
        <div class="control">
          <VgsSlider />
        </div>
      </div>
      
      <div class="plot-with-control">
        <div class="plot">
          <IdVdsPlot />
        </div>
        <div class="control">
          <VdsSlider />
        </div>
      </div>
    </div>
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
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .visualization {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    aspect-ratio: 5 / 3;
  }

  .plots-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .plot-with-control {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .plot {
    width: 100%;
  }

  .control {
    padding: 1rem;
    background: var(--controls-bg);
    border-radius: 8px;
    width: 100%;
  }

  @media (max-width: 1024px) {
    .plots-container {
      grid-template-columns: 1fr;
    }
  }
</style>
