/**
 * App-level state: the operating point the user drives through the controls,
 * and the one device instance the app renders.
 *
 * The device model (lib/models/mosfet) is pure computation; everything that
 * changes while the app runs lives here, behind one small interface: read the
 * operating point with `$operatingPoint`, write it only through setVgs/setVds.
 */
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { createDevice, defaultParams } from './models/mosfet';

/** The operating point of the MOSFET under study: one gate and one drain-source voltage. */
export interface OperatingPoint {
  vgs: number;
  vds: number;
}

/** The app's device. A second device with different physics is a one-liner:
 *  `createDevice({ Vth: 1.0, K: 2.0, lambda: 0.05 })`. */
export const device = createDevice(defaultParams);

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
    const vdsSat = device.VdsSat(point.vgs);
    const snapped = Math.abs(vds - vdsSat) < SNAP_THRESHOLD ? vdsSat : vds;
    return { ...point, vds: snapped };
  });
}
