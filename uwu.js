// script.js
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  const progress = document.getElementById('progress');
  const songTitle = document.getElementById('song-title');
  const songDuration = document.getElementById('song-duration');
  const shareBtn = document.getElementById('shareBtn');
  const messageBox = document.getElementById('message');

  // Jika ingin mengganti judul lagu saat load metadata
  audio.addEventListener('loadedmetadata', () => {
    const d = audio.duration;
    songDuration.textContent = formatTime(d);
    // set range max
    progress.max = Math.floor(d);
    // Try to infer filename as title
    const src = audio.currentSrc || '';
    const name = src.split('/').pop() || 'Lagu';
    songTitle.textContent = decodeURIComponent(name.replace('.mp3',''));
  });

  // Progress update
  audio.addEventListener('timeupdate', () => {
    progress.value = Math.floor(audio.currentTime);
  });

  // Seek
  progress.addEventListener('input', (e) => {
    audio.currentTime = e.target.value;
  });

  // Buttons
  playBtn.addEventListener('click', async () => {
    try {
      await audio.play();
    } catch (err) {
      // autoplay restrictions might block play — but user click should allow it
      console.warn('Play blocked:', err);
    }
  });

  pauseBtn.addEventListener('click', () => audio.pause());

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇 Muted' : '🔈 Mute';
  });

  // Share / copy message
  shareBtn.addEventListener('click', async () => {
    const text = messageBox.value.trim();
    if (!text) {
      alert('Tulis pesan semangat dulu ya!');
      return;
    }

    // Copy text to clipboard and show small UI feedback
    try {
      await navigator.clipboard.writeText(text);
      shareBtn.textContent = 'Tersalin! ✅';
      setTimeout(() => shareBtn.textContent = 'Kirim & Bagikan', 1500);
    } catch (e) {
      alert('Gagal menyalin ke clipboard. Anda bisa copy manual.');
    }
  });

  // helper
  function formatTime(sec){
    if (!sec || isNaN(sec) || !isFinite(sec)) return '00:00';
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    const m = Math.floor(sec / 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  // Optional: click photo to toggle play/pause
  const photo = document.getElementById('photo');
  photo.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });
});
