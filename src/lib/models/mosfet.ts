/**
 * The Device module: a MOSFET transistor as a deep module.
 *
 * `createDevice` accepts the physical parameters once and returns a closed
 * object that answers every question about an operating point (Vgs, Vds):
 * drain current, saturation voltage, operating region, and the channel
 * geometry the visualization draws. The regime boundary (Vgs < Vth) and the
 * saturation point (Vds vs Vgs - Vth) are decided here, once — callers never
 * re-derive them.
 *
 * Pure computation: no stores, no framework, no shared state. A second device
 * with different physics is one line: `createDevice({ Vth: 1, K: 1, lambda: 0.02 })`.
 */

/** Physical parameters of a MOSFET device. */
export interface MOSFETParams {
  /** Threshold voltage (V). */
  Vth: number;
  /** Process transconductance (mA/V^2). */
  K: number;
  /** Channel-length modulation (1/V). */
  lambda: number;
}

/** Operating region of the transistor at an operating point. */
export type Region = 'cutoff' | 'ohmic' | 'saturation';

/** A MOSFET device: everything a caller can ask about its operating points. */
export interface Device {
  /** Drain current (mA) at (Vgs, Vds). Zero below threshold. */
  Id(Vgs: number, Vds: number): number;
  /** Drain-source voltage where the channel pinches off, for gate drive Vgs. Clamped at 0. */
  VdsSat(Vgs: number): number;
  /** Operating region at (Vgs, Vds). */
  region(Vgs: number, Vds: number): Region;
  /** Normalized channel thickness (0..1) at `position` along the channel (0 = source, 1 = drain). */
  channelThickness(position: number, Vgs: number, Vds: number): number;
  /** Normalized channel length (0..1): 1 in ohmic, VdsSat/Vds in saturation, 0 in cutoff. */
  channelLength(Vgs: number, Vds: number): number;
  /** The parameters this device was created from (frozen copy). */
  readonly params: MOSFETParams;
}

/** Parameters of the device this app renders. */
export const defaultParams: MOSFETParams = {
  Vth: 0.5,
  K: 1.0,
  lambda: 0.02
};

export function createDevice(params: MOSFETParams): Device {
  // Take a frozen copy: the device is immune to later changes of the caller's object.
  const p = Object.freeze({ ...params });

  // The regime boundary, decided once and consumed by every method below.
  const isOff = (Vgs: number): boolean => Vgs < p.Vth;

  function Id(Vgs: number, Vds: number): number {
    if (isOff(Vgs)) {
      return 0;
    }

    const vdsSat = Vgs - p.Vth;

    if (Vds < vdsSat) {
      return p.K * ((Vgs - p.Vth) * Vds - 0.5 * Vds * Vds) * (1 + p.lambda * Vds);
    } else {
      return p.K * 0.5 * Math.pow(Vgs - p.Vth, 2) * (1 + p.lambda * Vds);
    }
  }

  function VdsSat(Vgs: number): number {
    return Math.max(0, Vgs - p.Vth);
  }

  function region(Vgs: number, Vds: number): Region {
    if (isOff(Vgs)) {
      return 'cutoff';
    }

    const vdsSat = Vgs - p.Vth;

    if (Vds < vdsSat) {
      return 'ohmic';
    } else {
      return 'saturation';
    }
  }

  function channelThickness(position: number, Vgs: number, Vds: number): number {
    if (isOff(Vgs)) {
      return 0;
    }

    const vdsSat = Vgs - p.Vth;
    const V_channel = position * Math.min(Vds, vdsSat);
    const Vgc = Vgs - V_channel;

    return Math.max(0, (Vgc - p.Vth) / (Vgs - p.Vth));
  }

  function channelLength(Vgs: number, Vds: number): number {
    if (isOff(Vgs)) {
      return 0;
    }

    const vdsSat = Vgs - p.Vth;

    // In ohmic region, channel extends full length (normalized to 1.0)
    if (Vds < vdsSat) {
      return 1.0;
    } else {
      // In saturation, channel length is reduced as pinch-off occurs
      // The pinch point is at position where V_channel = vdsSat
      return vdsSat / Vds;
    }
  }

  return { Id, VdsSat, region, channelThickness, channelLength, params: p };
}
