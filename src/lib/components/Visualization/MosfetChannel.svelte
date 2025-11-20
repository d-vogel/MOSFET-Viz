<script lang="ts">
  import { VGS, VDS, getChannelThickness, getChannelLength, getRegion, params } from '../../models/mosfet';

  let vgs = 2.5;
  let vds = 3.0;
  
  VGS.subscribe(value => vgs = value);
  VDS.subscribe(value => vds = value);

  $: region = getRegion(vgs, vds);
  
  const width = 500;
  const height = 300;
  const channelLength = 400;
  const channelY = height / 2;
  const maxChannelHeight = 80;
  const sourcedrainHeight = maxChannelHeight * 1.2;
  const sourceX = 50;
  const drainX = sourceX + channelLength;

  $: channelPath = (() => {
    if (region === 'cutoff') {
      return '';
    }
    
    // Get channel thickness at source (position = 0) and drain (position = 1)
    const sourceThickness = getChannelThickness(0, vgs, vds);
    const drainThickness = getChannelThickness(1, vgs, vds);
    
    // Convert normalized thickness (0-1) to pixel heights
    const sourceHeight = sourceThickness * maxChannelHeight;
    const drainHeight = drainThickness * maxChannelHeight;
    
    // Get normalized channel length (0-1)
    const normalizedLength = getChannelLength(vgs, vds);
    
    // Convert to pixel position
    const effectiveChannelLength = normalizedLength * channelLength;
    const channelEndX = sourceX + effectiveChannelLength;
    
    // Four corners of the channel polygon:
    // 1. Top-left (source side, top)
    const topLeftX = sourceX;
    const topLeftY = channelY;
    
    // 2. Top-right (channel end, top)
    const topRightX = channelEndX;
    const topRightY = channelY;
    
    // 3. Bottom-right (channel end, bottom)
    const bottomRightX = channelEndX;
    const bottomRightY = channelY + drainHeight;
    
    // 4. Bottom-left (source side, bottom)
    const bottomLeftX = sourceX;
    const bottomLeftY = channelY + sourceHeight;
    
    return `M ${topLeftX} ${topLeftY} L ${topRightX} ${topRightY} L ${bottomRightX} ${bottomRightY} L ${bottomLeftX} ${bottomLeftY} Z`;
  })();
</script>

<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Source terminal -->
  <rect x="0" y={channelY} width="50" height={sourcedrainHeight} fill="var(--terminal-color)" />
  <text x="25" y={channelY + sourcedrainHeight / 2} font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(-90 25 {channelY + sourcedrainHeight / 2})">SOURCE</text>
  
  <!-- Drain terminal -->
  <rect x={width - 50} y={channelY} width="50" height={sourcedrainHeight} fill="var(--terminal-color)" />
  <text x={width - 25} y={channelY + sourcedrainHeight / 2} font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(-90 {width - 25} {channelY + sourcedrainHeight / 2})">DRAIN</text>
  
  <!-- Gate electrode -->
  <rect x={sourceX} y={channelY-15} width={channelLength} height={5} fill="var(--terminal-color)" />
  <rect x={sourceX} y={channelY-10} width={channelLength} height={10} fill="var(--substrate-color)" opacity="0.6" />
  <text x={width / 2 - 10} y={channelY - 20} font-size="14" font-weight="bold" fill="var(--text-primary)" text-anchor="middle">GATE</text>
  
  <!-- Substrate -->
  <rect x="50" y={channelY} width={channelLength} height={sourcedrainHeight} fill="var(--substrate-color)" opacity="0.3" />
  
  <!-- Channel: rectangle in ohmic region, triangle in saturation -->
  <path d={channelPath} fill="var(--channel-color)" stroke="var(--channel-stroke)" stroke-width="1.5" 
        style="transition: d 0.3s ease" />
  
  <!-- Region indicator -->
  <text x={width / 2} y={channelY + sourcedrainHeight + 20} font-size="14" font-weight="600" fill="var(--text-primary)" text-anchor="middle">
    {region.toUpperCase()}
  </text>
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
    background: var(--viz-bg);
    border-radius: 8px;
  }

  text {
    user-select: none;
  }
</style>
