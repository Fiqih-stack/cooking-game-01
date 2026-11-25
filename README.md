[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Fiqih-stack/cooking-game-01/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Fiqih-stack/cooking-game-01/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

# cooking-game-01 — Dapur Kilat

Dapur Kilat (Lightning Kitchen) is a complete 2D cooking game for the
[make.fun bounty](https://make.fun/bounty/best-cooking-game-20261125-0137):
orders arrive on the board with a draining patience bar, ingredients wait on
the counter, the cutting board and the stove turn them into dishes, and the
plate carries each dish to the customer. Serve 12 orders to close the day;
three failed orders end the shift. Four original recipes, keyboard and mouse
controls, no network, no external assets — every pixel is drawn in code.
This version (v2) polishes the kitchen: gradient panels with soft shadows,
smooth wood and metal textures, detailed shaded food art, and a neat,
fine-dining plating on a porcelain plate with a thin gold rim.

Screenshots in `screenshots/` show the title screen, mid-play, a dish ready
to serve, and the day-complete screen.

Referral code: `6sc35azz`

## Play it

```sh
node serve.ts
```

Then open http://localhost:8080/ in a desktop browser. Click ingredients
(or keys 1–6) to pick them up, click the cutting board or stove to process
them, click the plate to assemble, and click a matching order — or press
Space — to serve. P pauses, R restarts.

## Controls

- Mouse: ingredient, station, plate, order ticket, or the serve button.
- Keys 1–6: pick the ingredient in that counter slot.
- Space: serve the order the plate matches. P: pause. R: restart.

## License

MIT — see [LICENSE](./LICENSE).
