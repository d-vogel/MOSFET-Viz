import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { VdsSat } from './models/mosfet';

/**
 * The operating point of the MOSFET under study: one gate voltage and one
 * drain-source voltage, written by the controls and read by every view.
 */
export interface OperatingPoint {
  vgs: number;
  vds: number;
}

// The default operating point is declared here and nowhere else.
const defaultOperatingPoint: OperatingPoint = { vgs: 2.5, vds: 3.0 };

// A new drain voltage within this distance of pinch-off snaps onto pinch-off.
const SNAP_THRESHOLD = 0.15;

const current = writable<OperatingPoint>({ ...defaultOperatingPoint });

/**
 * The current operating point. Read it with `$operatingPoint` (Svelte
 * auto-subscribes and auto-unsubscribes); write only through setVgs/setVds.
 */
export const operatingPoint: Readable<OperatingPoint> = {
  subscribe: current.subscribe
};

/** Set the gate voltage. */
export function setVgs(vgs: number): void {
  current.update((point) => ({ ...point, vgs }));
}

/**
 * Set the drain-source voltage. Applies the snap-to-pinch-off rule: a value
 * within SNAP_THRESHOLD of VdsSat (at the current VGS) snaps onto VdsSat, so
 * the saturation boundary is easy to land on — for any caller, not just the
 * slider's pointer input.
 */
export function setVds(vds: number): void {
  current.update((point) => {
    const vdsSat = VdsSat(point.vgs);
    const snapped = Math.abs(vds - vdsSat) < SNAP_THRESHOLD ? vdsSat : vds;
    return { ...point, vds: snapped };
  });
}
