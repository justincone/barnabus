import { Modal } from 'bootstrap';

// Parse query parameter to determine the clue number
const urlParams = new URLSearchParams(window.location.search);
const clueNumber = urlParams.get('clue') || '01'; // Default to clue 01

// Define answers, media, and clue configurations
const clueData = {
  '01': {
    answers: ['moon', 'the moon', 'themoon', 'a moon', 'amoon'],
    video: {
      src: '/videos/clue01.mp4',
      poster: '/images/clue01-poster.jpg',
    },
    hasInput: true, // Indicates whether this clue has an input field
  },
  '02': {
    answers: ['sun', 'the sun', 'thesun', 'a sun', 'asun'],
    video: {
      src: '/videos/clue02.mp4',
      poster: '/images/clue02-poster.jpg',
    },
    hasInput: true,
  },
  '03': {
    answers: [], // No answers needed
    video: {
      src: '/videos/clue03.mp4',
      poster: '/images/clue03-poster.jpg',
    },
    hasInput: false,
  },
  '04': {
    answers: [], // No answers needed
    video: {
      src: '/videos/clue04.mp4',
      poster: '/images/clue04-poster.jpg',
    },
    hasInput: false,
  },
};

// Get current clue data
const currentClue = clueData[clueNumber];

// Update video source and poster dynamically
const video = document.getElementById('clueVideo');
const videoSource = video.querySelector('source');
videoSource.src = currentClue.video.src;
video.poster = currentClue.video.poster;
video.load(); // Load the new video source

// Handle visibility of input field and submit button
const inputGroup = document.querySelector('.input-group');
if (currentClue.hasInput) {
  inputGroup.style.display = 'flex';
} else {
  inputGroup.style.display = 'none';
}

// Video control buttons
const togglePlayButton = document.getElementById('togglePlay');
const restartButton = document.getElementById('restart');

// Toggle play/pause
togglePlayButton.addEventListener('click', () => {
  if (video.paused || video.ended) {
    video.play();
    togglePlayButton.src = '/images/button-pause.png';
    togglePlayButton.srcset = `
      /images/button-pause.png 1x,
      /images/button-pause@2x.png 2x,
      /images/button-pause@3x.png 3x
    `;
  } else {
    video.pause();
    togglePlayButton.src = '/images/button-play.png';
    togglePlayButton.srcset = `
      /images/button-play.png 1x,
      /images/button-play@2x.png 2x,
      /images/button-play@3x.png 3x
    `;
  }
});

// Restart video
restartButton.addEventListener('click', () => {
  video.currentTime = 0;
  video.play();
  togglePlayButton.src = '/images/button-pause.png';
  togglePlayButton.srcset = `
    /images/button-pause.png 1x,
    /images/button-pause@2x.png 2x,
    /images/button-pause@3x.png 3x
  `;
});

// Handle answer submission (only for clues with input fields)
if (currentClue.hasInput) {
  const submitButton = document.getElementById('submit');
  const inputField = document.getElementById('answer');
  const errorModal = document.getElementById('errorModal');

  submitButton.addEventListener('click', () => {
    const userGuess = inputField.value.trim().toLowerCase();
    if (currentClue.answers.includes(userGuess)) {
      // Go to the next clue
      const nextClue = parseInt(clueNumber) + 1;
      const nextClueKey = nextClue.toString().padStart(2, '0');
      if (clueData[nextClueKey]) {
        window.location.href = `index.html?clue=${nextClueKey}`;
      } else {
        alert('Congratulations! You’ve completed the hunt!');
      }
    } else {
      const modal = new Modal(errorModal);
      modal.show();
    }
  });

  // Reset focus and input field when the modal is closed
  errorModal.addEventListener('hidden.bs.modal', () => {
    inputField.value = '';
    inputField.focus();
  });
}