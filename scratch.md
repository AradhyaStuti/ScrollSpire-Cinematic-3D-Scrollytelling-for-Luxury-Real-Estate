# scratch

random notes i don't want to lose

## the bug that took forever
- lenis + strictmode
- gsap.ticker.add kept stacking on every remount in dev
- fixed by storing tickerFn at module level, remove on destroy
- (fine in prod because no strictmode but lol)

## things to try
- catmull-rom camera path instead of the if/else ladder in CameraRig?
- lookAt target via drei's `CameraControls` with disabled interaction — might be cleaner
- instanced meshes for the 42 floors — only saves ~2ms tho, not worth right now
- drei `<Sparkles>` instead of my SparkEmitter... but mine's already cheap

## camera values i kept coming back to
- hero: y=2.6-3.2, z=10-11, target y=2-2.5
- reveal: y=2.6-4, z=10-8.5, target y=2.5-4
- tour: y=6-10, z=6.5-5.2 (the dive)
- lifestyle: y=10-6, z=5.2-12 (pull back)
- cta: y=6-4.5, z=12-9
- kept fiddling with the tour radius. 5.2 feels too close on wide monitors but 6 loses the dive feeling on 13" laptops. 5.2 wins more often.

## bloom threshold
- 0.18 was too low, picked up reflections on the glass and made the whole frame foggy
- 0.20 clean. anything over 0.25 kills the interior lights
- learned this the hard way

## abandoned
- DoF effect — looked muddy with bloom, not worth the perf cost
- gpu-particles for dust — overkill, cpu update with 400 points is fine
- `Sky` from drei — couldn't get the horizon color right, wrote SkyDome instead

## TODO
- heritage section needs better images, current brass/leather shots were the ones i cut
- the "08 of 12 remaining" number — hardcode or actually drive from inventory?
- schema.org structured data is probably wrong for Residence type, should check
- cta form. still. just. setTimeout.
