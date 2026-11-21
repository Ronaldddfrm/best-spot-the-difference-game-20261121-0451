// main.js — bootstrap: read the staging query (used only for screenshots)
// and start the hunt. Normal play opens with no query at all:
//   game/index.html            -> Sunny Garden, fresh round
//   ?level=1                   -> Harbour at Dusk
//   ?level=0&found=0,2,4&time=143 -> Garden with 3 differences pre-marked
//   ?level=2&found=0,1,3,5,7&time=61 -> Observatory mid-hunt
//   ?level=0&shot=win          -> Garden fully solved, win card showing
import { SpotGame } from './game.js';

const params = new URLSearchParams(window.location.search);

function parseStaged() {
  if (!params.has('found') && !params.has('shot')) return null;
  const found = params.has('found')
    ? params.get('found').split(',').map((s) => Number(s.trim())).filter((n) => Number.isFinite(n))
    : [];
  return {
    level: Number(params.get('level') ?? 0),
    found,
    time: params.has('time') ? Number(params.get('time')) : null,
    shot: params.get('shot') ?? 'play',
  };
}

const staged = parseStaged();
const level = staged ? staged.level : Number(params.get('level') ?? 0);

const game = new SpotGame({ level, staged });
game.start();
