import { mkdir, writeFile } from "node:fs/promises";
// Original instrumental: warm bell-like keys. No samples or audio dependencies.
const rate = 24000;
const seconds = 32;
const samples = new Float64Array(rate * seconds);
const chords = [
  [60, 64, 67, 71],
  [57, 60, 64, 67],
  [53, 57, 60, 64],
  [55, 60, 62, 67],
];
function note(midi: number, start: number, gain: number) {
  const frequency = 440 * 2 ** ((midi - 69) / 12);
  for (let i = 0; i < rate * 6; i++) {
    const time = i / rate;
    const envelope = (1 - Math.exp(-time * 14)) * Math.exp(-time / 1.65);
    const tone =
      Math.sin(2 * Math.PI * frequency * time) +
      0.2 * Math.sin(2 * Math.PI * frequency * 2 * time) * Math.exp(-time) +
      0.06 * Math.sin(2 * Math.PI * frequency * 3 * time) * Math.exp(-time * 2);
    const index = (Math.round(start * rate) + i) % samples.length;
    samples[index] += gain * envelope * tone;
  }
}
chords.forEach((chord, bar) => {
  note(chord[0] - 12, bar * 8, 0.12);
  [0, 2, 1, 3, 2, 1].forEach((degree, beat) =>
    note(chord[degree] + 12, bar * 8 + beat * 1.25, 0.13),
  );
});
const wav = Buffer.alloc(44 + samples.length * 2);
wav.write("RIFF", 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(rate, 24);
wav.writeUInt32LE(rate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(samples.length * 2, 40);
for (let i = 0; i < samples.length; i++)
  wav.writeInt16LE(Math.round(Math.tanh(samples[i]) * 32767), 44 + i * 2);
await mkdir("public/audio", { recursive: true });
await writeFile("public/audio/forever-in-bloom.wav", wav);
console.log(`Created original ${seconds}s ambient loop (${wav.length} bytes).`);
