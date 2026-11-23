# Treasure Quest

A scavenger hunt for the Cone home.

Treasure Quest is a small web app that runs a video scavenger hunt on a phone. A wizard delivers each clue as a short video. The player watches, works out the riddle, types an answer, and gets sent to the next spot in the room. I built it for my daughter, and the whole hunt takes place in our playroom. The prize at the end is a book safe full of candy.

**Live:** [barnabus.vercel.app](https://barnabus.vercel.app)

## How the hunt works

1. A QR code on the playroom wall opens the app on a phone.
2. The wizard appears and delivers the first clue as a video riddle.
3. The player types an answer. A wrong guess gets a gentle "Sorry, that's not it. Try again." A right one fades into the next clue, which starts playing on its own.
4. Some clues are answered on the phone. Others send the player off to find something in the room, like a number hidden under the coffee table.
5. The last clue points to the hiding place: a hollow dictionary with a combination lock. Inside, along with the candy, is a card with one more QR code that opens the wizard's congratulations video.

There are four clue videos in total. The play, pause, and restart buttons let a kid rewatch a riddle as many times as they need.

## How it's built

- [Vite](https://vite.dev) for the dev server and build
- Vanilla JavaScript, no framework
- [Bootstrap 5](https://getbootstrap.com) for the layout, input group, and modals
- Deployed on [Vercel](https://vercel.com), which redeploys on every push to `main`

```
index.html          The single page: logo, video player, controls, answer field
src/main.js         Clue data and all of the hunt logic
src/style.css       Styling (stone wall background, purple palette, custom buttons)
public/videos/      One MP4 per clue (clue01.mp4 ... clue04.mp4)
public/images/      Logo, buttons, video frame, and a poster image per clue
public/fonts/       Web font files
```

Everything interesting lives in the `clueData` object in `src/main.js`. Each clue has a video, a poster image, a list of accepted answers, and a couple of flags:

```js
'01': {
  answers: ['moon', 'the moon', 'themoon', 'a moon', 'amoon'],
  video: { src: '/videos/clue01.mp4', poster: '/images/clue01-poster.jpg' },
  hasInput: true,
},
```

- `answers` are matched without regard to capitalization or extra spaces, so list every variation a kid might reasonably type.
- `hasInput: false` hides the answer field for clues that are solved in the real world.
- `hasLikeButton: true` shows a thumbs-up button, used on the final video.

The current clue is tracked in the URL as `?clue=02`, `?clue=03`, and so on. That makes it easy to print a QR code that jumps straight to a particular clue, which is how the card inside the book safe works.

This is a toy, so the answers sit in plain sight in the client code. Anyone who views source can skip to the candy. My daughter has not figured that out yet.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/justincone/barnabus.git
cd barnabus
npm install
npm run dev
```

Vite prints a local URL. To test on a phone, run `npm run dev -- --host` and open the network URL it prints from a phone on the same Wi-Fi.

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Make your own hunt

1. Record or generate a video for each clue and drop the files in `public/videos/`.
2. Add a poster image for each one in `public/images/`.
3. Edit `clueData` in `src/main.js` with your videos and accepted answers. Clues run in numeric order (`01`, `02`, `03`...).
4. Deploy it somewhere (Vercel's free tier is plenty) and make a QR code that points to your URL.
5. Hide the prize.

## Notes

- The interface font is LT Soul by LyonsType. It is licensed separately and is not covered by any license on this repo. If you fork this, swap in a font of your own.
- The game is called Treasure Quest. `barnabus` is only the name of the repo.
