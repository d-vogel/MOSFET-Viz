/**
 * App-level operating-point state and the app's device.
 *
 * The device model (lib/models/mosfet) is pure computation; the operating
 * point the user drives through the sliders lives here, in the app wiring,
 * alongside the one device instance the app renders.
 */
import { writable } from 'svelte/store';
import { createDevice, defaultParams } from './models/mosfet';

/** Gate-source voltage (V). */
export const VGS = writable(2.5);

/** Drain-source voltage (V). */
export const VDS = writable(3.0);

/** The app's device. A second device with different physics is a one-liner:
 *  `createDevice({ Vth: 1.0, K: 2.0, lambda: 0.05 })`. */
export const device = createDevice(defaultParams);
