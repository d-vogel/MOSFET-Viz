/**
 * App-level operating-point state.
 *
 * The device model (lib/models/mosfet) is pure computation; the operating
 * point the user drives through the sliders lives here, in the app wiring.
 */
import { writable } from 'svelte/store';

/** Gate-source voltage (V). */
export const VGS = writable(2.5);

/** Drain-source voltage (V). */
export const VDS = writable(3.0);
