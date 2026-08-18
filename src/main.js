import { Modal } from 'bootstrap';

// Parse query parameter to determine the clue number
const urlParams = new URLSearchParams(window.location.search);
let clueNumber = urlParams.get('clue') || '01'; // Default to clue 01

// Define answers, media, and clue configurations
const clueData = {
  '01': {
    answers: ['moon', 'the moon', 'themoon', 'a moon', 'amoon'],
    video: {
      src: '/videos/clue01.mp4',
      poster: '/images/clue01-poster.jpg',
    },
    hasInput: true,
  },
  '02': {
    answers: ['178'],
    video: {
      src: '/videos/clue02.mp4',
      poster: '/images/clue02-poster.jpg',
    },
    hasInput: true,
  },
  '03': {
    answers: [],
    video: {
      src: '/videos/clue03.mp4',
      poster: '/images/clue03-poster.jpg',
    },
    hasInput: false,
  },
  '04': {
    answers: [],
    video: {
      src: '/videos/clue04.mp4',
      poster: '/images/clue04-poster.jpg',
    },
    hasInput: false,
    hasLikeButton: true,
  },
};

// Get current clue data
let currentClue = clueData[clueNumber];

// Video and controls
const video = document.getElementById('clueVideo');
const videoSource = video.querySelector('source');
const togglePlayButton = document.getElementById('togglePlay');
const restartButton = document.getElementById('restart');

const setPlayButtonState = (isPlaying) => {
  const state = isPlaying ? 'pause' : 'play';
  const label = isPlaying ? 'Pause button' : 'Play button';

  togglePlayButton.src = `/images/button-${state}.png`;
  togglePlayButton.srcset = `
    /images/button-${state}.png 1x,
    /images/button-${state}@2x.png 2x,
    /images/button-${state}@3x.png 3x
  `;
  togglePlayButton.alt = label;
};

const playVideo = () => {
  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn('Video playback was prevented or failed:', error);
      setPlayButtonState(false);
    });
  }
};

// Keep the custom button synchronized with the video element's actual state.
video.addEventListener('play', () => setPlayButtonState(true));
video.addEventListener('playing', () => setPlayButtonState(true));
video.addEventListener('pause', () => setPlayButtonState(false));
video.addEventListener('ended', () => setPlayButtonState(false));
video.addEventListener('error', () => setPlayButtonState(false));

// Update video source and poster dynamically
videoSource.src = currentClue.video.src;
video.poster = currentClue.video.poster;
video.load();
setPlayButtonState(false);

// Handle visibility of input field and submit button
const inputGroup = document.querySelector('.input-group');
if (currentClue.hasInput) {
  inputGroup.style.display = 'flex';
} else {
  inputGroup.style.display = 'none';
}

// Like button
const likeButton = document.getElementById('likeButton');
const likeModal = new Modal(document.getElementById('likeModal'));

if (currentClue.hasLikeButton) {
  likeButton.style.display = 'inline';
} else {
  likeButton.style.display = 'none';
}

likeButton.addEventListener('click', () => {
  likeModal.show();
  likeButton.style.display = 'none';
});

// Toggle play/pause
togglePlayButton.addEventListener('click', () => {
  if (video.paused || video.ended) {
    playVideo();
  } else {
    video.pause();
  }
});

// Restart video
restartButton.addEventListener('click', () => {
  video.currentTime = 0;
  playVideo();
});

const clueContainer = document.getElementById('clueContainer');

// Handle answer submission (only for clues with input fields)
if (currentClue.hasInput) {
  const submitButton = document.getElementById('submit');
  const inputField = document.getElementById('answer');
  const errorModal = document.getElementById('errorModal');

  submitButton.addEventListener('click', () => {
    video.pause();

    const userGuess = inputField.value.trim();

    if (currentClue.answers.some(answer => answer.toLowerCase() === userGuess.toLowerCase())) {
      const nextClue = parseInt(clueNumber) + 1;
      const nextClueKey = nextClue.toString().padStart(2, '0');
      clueNumber = nextClueKey;

      const newUrl = `${window.location.origin}${window.location.pathname}?clue=${clueNumber}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);

      if (clueData[nextClueKey]) {
        const nextClueData = clueData[nextClueKey];

        clueContainer.classList.add('fader-out');

        // Swap the media and request playback immediately while still inside
        // the user's Submit gesture. This is important for iOS Safari.
        videoSource.src = nextClueData.video.src;
        video.poster = nextClueData.video.poster;
        video.load();

        // If the first play request happens before the new media is ready,
        // make one additional attempt as soon as Safari says it can play.
        const retryWhenReady = () => {
          if (video.paused) {
            playVideo();
          }
        };
        video.addEventListener('canplay', retryWhenReady, { once: true });
        playVideo();

        setTimeout(() => {
          if (nextClueData.hasInput) {
            inputGroup.style.display = 'flex';
          } else {
            inputGroup.style.display = 'none';
          }

          currentClue = nextClueData;

          clueContainer.classList.remove('fader-out');
          clueContainer.classList.add('fader-in');
        }, 500);

        inputField.value = '';
        clueContainer.classList.remove('fader-in');
      } else {
        alert('Congratulations! You’ve completed the hunt!');
      }
    } else {
      const modal = new Modal(errorModal);
      modal.show();
    }
  });

  errorModal.addEventListener('hidden.bs.modal', () => {
    inputField.value = '';
    inputField.focus();
  });
}
