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
    hasInput: true, // Indicates whether this clue has an input field
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
    hasLikeButton: true, // Indicates the Like button should appear
  },
};

// Get current clue data
let currentClue = clueData[clueNumber];

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

// Like button
const likeButton = document.getElementById('likeButton');
const likeModal = new Modal(document.getElementById('likeModal'));

// Show/hide Like button based on the clue configuration
if (currentClue.hasLikeButton) {
  likeButton.style.display = 'inline'; // Show Like button
} else {
  likeButton.style.display = 'none'; // Hide Like button
}

// Add click event listener for Like button
likeButton.addEventListener('click', () => {
  likeModal.show(); // Show the feedback modal
  likeButton.style.display = 'none'; // Hide Like button
});

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

// Get the fade overlay and container
const clueContainer = document.getElementById('clueContainer');

// Handle answer submission (only for clues with input fields)
if (currentClue.hasInput) {
  const submitButton = document.getElementById('submit');
  const inputField = document.getElementById('answer');
  const errorModal = document.getElementById('errorModal');

  submitButton.addEventListener('click', () => {

    // Pause the video
    video.pause();
    togglePlayButton.src = '/images/button-play.png';
    togglePlayButton.srcset = `
      /images/button-play.png 1x,
      /images/button-play@2x.png 2x,
      /images/button-play@3x.png 3x
    `;

    const userGuess = inputField.value.trim();
    // console.log(`Current Clue Number: ${clueNumber}`);
    // console.log('Current Clue Data:', currentClue);

    // Check if the user's guess matches any answer in the current clue
    if (currentClue.answers.some(answer => answer.toLowerCase() === userGuess.toLowerCase())) {
      // console.log('Correct Answer! Proceeding to the next clue.');

      // Increment the clue number and update the URL
      const nextClue = parseInt(clueNumber) + 1;
      const nextClueKey = nextClue.toString().padStart(2, '0');
      clueNumber = nextClueKey; // Update clueNumber
      
      const newUrl = `${window.location.origin}${window.location.pathname}?clue=${clueNumber}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);

      if (clueData[nextClueKey]) {
        const nextClueData = clueData[nextClueKey];
        
        // Apply fade-out effect to the current clue
        clueContainer.classList.add('fader-out');

        setTimeout(() => {
          // Update video and poster for the next clue
          videoSource.src = nextClueData.video.src;
          video.poster = nextClueData.video.poster;
          video.load(); // Reload the video with the new source

          // Update the visibility of the input field
          if (nextClueData.hasInput) {
            inputGroup.style.display = 'flex';
          } else {
            inputGroup.style.display = 'none';
          }

          // Update the current clue data
          currentClue = nextClueData;

          // Apply fade-in effect for the next clue
          clueContainer.classList.remove('fader-out');
          clueContainer.classList.add('fader-in');
        }, 500); // Match the duration of the fade-out transition
        inputField.value = '';
        clueContainer.classList.remove('fader-in');
      } else {
        alert('Congratulations! You’ve completed the hunt!');
      }
    } else {
      // console.log('Incorrect Answer. Showing error modal.');
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