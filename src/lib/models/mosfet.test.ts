import { test } from 'node:test';
import { ok, strictEqual } from 'node:assert';
import { createDevice, defaultParams } from './mosfet.ts';

// Tests exercise the Device module's interface only: observable outcomes of
// createDevice(...) calls. No internal state is inspected or mutated.
const device = createDevice(defaultParams);

test('cutoff: below threshold there is no current, no channel, no saturation voltage', () => {
  strictEqual(device.Id(0.4, 3.0), 0);
  strictEqual(device.region(0.4, 3.0), 'cutoff');
  strictEqual(device.channelThickness(0.5, 0.4, 3.0), 0);
  strictEqual(device.channelLength(0.4, 3.0), 0);
  strictEqual(device.VdsSat(0.4), 0); // clamped, never negative
});

test('Id matches the square-law model exactly at known operating points', () => {
  // ohmic: K * ((Vgs - Vth) * Vds - Vds^2 / 2) * (1 + lambda * Vds)
  ok(Math.abs(device.Id(2.5, 1.0) - 1.53) < 1e-9);
  // saturation: K / 2 * (Vgs - Vth)^2 * (1 + lambda * Vds)
  ok(Math.abs(device.Id(2.5, 3.0) - 2.12) < 1e-9);
});

test('Id is continuous across Vds = VdsSat', () => {
  const Vgs = 2.5;
  const sat = device.VdsSat(Vgs); // 2.0
  const eps = 1e-6;
  const at = device.Id(Vgs, sat);

  ok(Math.abs(device.Id(Vgs, sat - eps) - at) < 1e-4);
  ok(Math.abs(device.Id(Vgs, sat + eps) - at) < 1e-4);

  // Both branches of the formula agree at the boundary.
  const ohmic =
    defaultParams.K *
    ((Vgs - defaultParams.Vth) * sat - 0.5 * sat * sat) *
    (1 + defaultParams.lambda * sat);
  const saturation =
    defaultParams.K * 0.5 * Math.pow(Vgs - defaultParams.Vth, 2) * (1 + defaultParams.lambda * sat);
  ok(Math.abs(at - ohmic) < 1e-9);
  ok(Math.abs(at - saturation) < 1e-9);
});

test('region boundary: just below VdsSat is ohmic, at or above is saturation', () => {
  const sat = device.VdsSat(2.5); // 2.0
  strictEqual(device.region(2.5, sat - 1e-9), 'ohmic');
  strictEqual(device.region(2.5, sat), 'saturation');
  strictEqual(device.region(2.5, sat + 1e-9), 'saturation');
});

test('channel thickness: 1 at the source, tapering to 0 at pinch-off in saturation', () => {
  strictEqual(device.channelThickness(0, 2.5, 5.0), 1); // Vds >= VdsSat
  strictEqual(device.channelThickness(0, 2.5, 2.0), 1); // exactly at VdsSat

  let previous = device.channelThickness(0, 2.5, 5.0);
  for (let i = 1; i <= 10; i++) {
    const t = device.channelThickness(i / 10, 2.5, 5.0);
    ok(t <= previous + 1e-12, `thickness must not grow toward the drain (${t} after ${previous})`);
    previous = t;
  }
  strictEqual(device.channelThickness(1, 2.5, 5.0), 0); // pinch-off point
});

test('channel thickness in ohmic: tapers but stays open at the drain', () => {
  const t = device.channelThickness(1, 2.5, 1.0); // Vds < VdsSat
  ok(t > 0 && t < 1);
  ok(Math.abs(t - 0.5) < 1e-12); // (2.5 - 1.0 - 0.5) / 2.0
});

test('channel length: full in ohmic, VdsSat/Vds in saturation, 0 in cutoff', () => {
  strictEqual(device.channelLength(2.5, 1.0), 1.0);
  strictEqual(device.channelLength(2.5, 3.0), 2 / 3);
  strictEqual(device.channelLength(0.4, 3.0), 0);
});

test('a device built with different params shifts its own thresholds', () => {
  const highVth = createDevice({ Vth: 1.0, K: 1.0, lambda: 0.02 });

  // A 0.9 V gate is on for the default device, off for the high-threshold one.
  strictEqual(highVth.region(0.9, 0.2), 'cutoff');
  strictEqual(highVth.Id(0.9, 0.2), 0);
  strictEqual(device.region(0.9, 0.2), 'ohmic');
  ok(device.Id(0.9, 0.2) > 0);

  // K scales the current.
  const k2 = createDevice({ Vth: 0.5, K: 2.0, lambda: 0.02 });
  strictEqual(k2.Id(2.5, 3.0), 2 * device.Id(2.5, 3.0));
});

test('params are accepted, not mutated: caller changes never reach a built device', () => {
  const mine = { Vth: 0.5, K: 1.0, lambda: 0.02 };
  const d = createDevice(mine);

  mine.Vth = 10.0;
  strictEqual(d.region(0.9, 0.2), 'ohmic'); // still behaves as built (Vth 0.5)
  ok(d.Id(0.9, 0.2) > 0);

  strictEqual(defaultParams.Vth, 0.5); // shared defaults untouched
  strictEqual(device.params.Vth, 0.5);
  strictEqual(device.params, device.params); // stable read-only view
});
