<script lang="ts">
  import VgsSlider from './lib/components/Controls/VgsSlider.svelte';
  import VdsSlider from './lib/components/Controls/VdsSlider.svelte';
  import MosfetChannel from './lib/components/Visualization/MosfetChannel.svelte';
  import IdVdsPlot from './lib/components/Plots/IdVdsPlot.svelte';
  import IdVgsPlot from './lib/components/Plots/IdVgsPlot.svelte';
</script>

<main>
  <header>
    <div class="header-content">
      <div class="header-col">
        <a href="https://www.fhnw.ch/de/life-sciences/ueber-uns/institute/medizintechnik-und-medizininformatik" target="_blank" rel="noopener noreferrer" class="logo-link">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/FHNW_Logo.svg" alt="FHNW Logo" class="logo" />
        </a>
      </div>
      <div class="header header-text">
        <h1>MOSFET Regimes</h1>
        <p>behavior in ohmic and saturation regions</p>
      </div>
      <div class="header-col">
      </div>
    </div>
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
    margin-bottom: 2rem;
  }

  .header-content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
  }

  .header-col {
    display: flex;
    align-items: center;
  }

  .header-col:nth-child(2) {
    justify-content: center;
    text-align: center;
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
