import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import './style.css';

document.querySelector('#app').innerHTML = `
  <div>
    <div id="logo" class="m-0 p-0">
      <img src="images/logo.png"
      srcset="
        images/logo@1x.png 1x, 
        images/logo@2x.png 2x, 
        images/logo@3x.png 3x
      ">
    </div>
    <div class="video-container">
      <video id="clueVideo" playsinline poster="images/clue01-poster.jpg">
        <source src="videos/clue01.mp4" type="video/mp4">
      </video>
    </div>
    <div class="controls d-flex justify-content-center my-3">
      <img id="togglePlay" src="images/button-play.png" 
      srcset="
          images/button-play@.png 1x,
          images/button-play@2x.png 2x,
          images/button-play@3x.png 3x
      " 
      class="mx-1" alt="Play button">
      <img id="restart" src="images/button-restart.png" 
      srcset="
          images/button-restart.png 1x,
          images/button-restart@2x.png 2x,
          images/button-restart@3x.png 3x
        "
      class="mx-2" alt="Restart button">
    </div>
    <div class="clue m-3">
      <div class="input-group my-3 px-4">
        <input type="text" id="answer" class="form-control" placeholder="Your answer here">
        <button id="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>

  <!-- Modal for Incorrect Guess -->
  <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Sorry, that's not it. Try again.
        </div>
      </div>
    </div>
  </div>
`;

const correctAnswers = ['moon', 'the moon', 'themoon', 'a moon', 'amoon'];

document.querySelector('#submit').addEventListener('click', () => {
  const userGuess = document.querySelector('#answer').value.trim().toLowerCase();

  if (correctAnswers.includes(userGuess)) {
    // Redirect to the next clue
    window.location.href = 'next-clue.html';
  } else {
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
  }
});

const video = document.getElementById('clueVideo');
const togglePlayButton = document.getElementById('togglePlay');
const restartButton = document.getElementById('restart');

togglePlayButton.addEventListener('click', () => {
  if (video.paused || video.ended) {
    video.play();
    togglePlayButton.src = 'images/button-pause.png'; // Change to pause image
    togglePlayButton.srcset = `
      images/button-pause.png 1x,
      images/button-pause@2x.png 2x,
      images/button-pause@3x.png 3x
    `; // Set retina images for pause button
  } else {
    video.pause();
    togglePlayButton.src = 'images/button-play.png'; // Change to play image
    togglePlayButton.srcset = `
      images/button-play.png 1x,
      images/button-play@2x.png 2x,
      images/button-play@3x.png 3x
    `; // Set retina images for play button
  }
});

restartButton.addEventListener('click', () => {
  video.currentTime = 0; // Set video time to the beginning
  video.play(); // Automatically start playing
  togglePlayButton.src = 'images/button-pause.png'; // Change to pause image
});

// Add functionality for the restart button
restartButton.addEventListener('click', () => {
  video.currentTime = 0; // Set video time to the beginning
  video.play(); // Automatically start playing

  // Update the play button to show the pause state
  togglePlayButton.src = 'images/button-pause.png'; 
  togglePlayButton.srcset = `
    images/button-pause.png 1x,
    images/button-pause@2x.png 2x,
    images/button-pause@3x.png 3x
  `;
});

// Get references to the modal and input field
const errorModal = document.getElementById('errorModal');
const inputField = document.getElementById('answer');

// Listen for the modal's hidden event
errorModal.addEventListener('hidden.bs.modal', () => {
  // Clear the input field
  inputField.value = '';

  // Move focus to the input field or another visible element
  inputField.focus();
});