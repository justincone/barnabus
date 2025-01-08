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
      <button id="togglePlay" class="btn btn-primary mx-2">Play</button>
      <button id="restart" class="btn btn-warning mx-2">Restart</button>
    </div>
    <div class="clue m-3">
      <div class="input-group my-3">
        <input type="text" id="answer" class="form-control" placeholder="Your answer here">
        <button id="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>

  <!-- Modal for Incorrect Guess -->
  <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Incorrect</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Nope, that's not it. Try again.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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

// Add a single toggle button for play/pause
togglePlayButton.addEventListener('click', () => {
  if (video.paused || video.ended) {
    video.play();
    togglePlayButton.textContent = 'Pause';
    togglePlayButton.classList.remove('btn-primary');
    togglePlayButton.classList.add('btn-danger');
  } else {
    video.pause();
    togglePlayButton.textContent = 'Play';
    togglePlayButton.classList.remove('btn-danger');
    togglePlayButton.classList.add('btn-primary');
  }
});

// Add functionality for the restart button
restartButton.addEventListener('click', () => {
  video.currentTime = 0; // Set video time to the beginning
  video.play(); // Automatically start playing
  togglePlayButton.textContent = 'Pause'; // Update play button text
  togglePlayButton.classList.remove('btn-primary');
  togglePlayButton.classList.add('btn-danger');
});