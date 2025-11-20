import { writable } from 'svelte/store';

export const VGS = writable(2.5);
export const VDS = writable(3.0);

export interface MOSFETParams {
  Vth: number;
  K: number;
  lambda: number;
}

const params: MOSFETParams = {
  Vth: 0.5,
  K: 1.0,
  lambda: 0.02
};

export function Id(Vgs: number, Vds: number): number {
  if (Vgs < params.Vth) {
    return 0;
  }
  
  const VdsSat = Vgs - params.Vth;
  
  if (Vds < VdsSat) {
    return params.K * ((Vgs - params.Vth) * Vds - 0.5 * Vds * Vds) * (1 + params.lambda * Vds);
  } else {
    return params.K * 0.5 * Math.pow(Vgs - params.Vth, 2) * (1 + params.lambda * Vds);
  }
}

export function VdsSat(Vgs: number): number {
  return Math.max(0, Vgs - params.Vth);
}

export function getRegion(Vgs: number, Vds: number): 'cutoff' | 'ohmic' | 'saturation' {
  if (Vgs < params.Vth) {
    return 'cutoff';
  }
  
  const vdsSat = VdsSat(Vgs);
  
  if (Vds < vdsSat) {
    return 'ohmic';
  } else {
    return 'saturation';
  }
}

export function getPinchOffPosition(Vgs: number, Vds: number): number {
  if (Vgs < params.Vth) {
    return 1.0;
  }
  
  const VdsSat = Vgs - params.Vth;
  
  if (Vds < VdsSat) {
    return Vds / VdsSat;
  } else {
    return 1.0;
  }
}

export function getChannelThickness(position: number, Vgs: number, Vds: number): number {
  if (Vgs < params.Vth) {
    return 0;
  }
  
  const VdsSat = Vgs - params.Vth;
  const V_channel = position * Math.min(Vds, VdsSat);
  const Vgc = Vgs - V_channel;
  
  const thickness = Math.max(0, (Vgc - params.Vth) / (Vgs - params.Vth));
  
  return thickness;
}

export function getChannelLength(Vgs: number, Vds: number): number {
  if (Vgs < params.Vth) {
    return 0;
  }
  
  const VdsSat = Vgs - params.Vth;
  
  // In ohmic region, channel extends full length (normalized to 1.0)
  if (Vds < VdsSat) {
    return 1.0;
  } else {
    // In saturation, channel length is reduced as pinch-off occurs
    // The pinch point is at position where V_channel = VdsSat
    return VdsSat / Vds;
  }
}

export { params };
