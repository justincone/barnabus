import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

document.querySelector('#app').innerHTML = `
  <div>
    <video  id="clueVideo" playsinline style="width: 100%;">
      <source src="videos/clue01.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div class="controls d-flex justify-content-center my-3">
      <button id="play" class="btn btn-success mx-2">Play</button>
      <button id="pause" class="btn btn-danger mx-2">Pause</button>
    </div>
    <div class="clue m-3">
      <h1>Your first clue</h1>
      <p>
        I have no light to call my own,<br>
        Yet in the darkness, I am shown.<br>
        I light the night but have no flame,<br>
        And tides rise when they hear my name. <br><br>
        What am I?
      </p>
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
document.getElementById('play').addEventListener('click', () => {
  video.play();
});
document.getElementById('pause').addEventListener('click', () => {
  video.pause();
});