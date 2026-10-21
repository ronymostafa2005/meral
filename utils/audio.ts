// Site audio is disabled. Calls stay so existing handlers do not need to change.
export const sound = {
  toggleMute(): boolean {
    return true;
  },
  getMuted(): boolean {
    return true;
  },
  playHover(): void {},
  playClick(): void {},
  playSuccess(): void {},
  playBlip(_freq?: number, _duration?: number): void {},
  playWaterDrop(): void {},
  playWaterRipple(): void {}
};
