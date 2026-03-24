// Video file paths
const videoSources = {
    perspective: 'video/Perspective.mp4',
    front: 'video/Front.mp4',
    side: 'video/Side.mp4',
    top: 'video/Top.mp4' 
};

// Music tracks
const musicTracks = [
    { title: "Gentle Rain", src: "music/rain.mp3" },
    { title: "Calm Waves", src: "music/waves.mp3" },
    { title: "Keyboard Whisper", src: "music/keyboard.mp3" },
    { title: "White Noise", src: "music/white-noise.mp3" }
];

const videoElement = document.getElementById('environment-video');
const angleButtons = document.querySelectorAll('.angle-btn');
const dragOverlay = document.getElementById('drag-overlay');
let currentAngle = 'perspective';
let isDragging = false;
let startX;
let touchStartX;
let dragThreshold = 30;
let didDrag = false;

function loadVideo(angle) {
    if (videoSources[angle]) {
        videoElement.src = videoSources[angle];
        videoElement.load();
        videoElement.play().catch(e => console.log('Autoplay prevented:', e));
        
        angleButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.angle === angle) {
                btn.classList.add('active');
            }
        });
        
        currentAngle = angle;
    }
}

loadVideo('perspective');

// Button click handlers (these work because buttons are above the overlay)
angleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        loadVideo(btn.dataset.angle);
    });
});

// Mouse events for desktop
dragOverlay.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    dragOverlay.style.cursor = 'grabbing';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    
    if (Math.abs(deltaX) > dragThreshold) {
        const angleOrder = ['perspective', 'front', 'side', 'top'];
        const currentIndex = angleOrder.indexOf(currentAngle);
        
        if (deltaX > 0) {
            const nextIndex = (currentIndex + 1) % angleOrder.length;
            loadVideo(angleOrder[nextIndex]);
        } else {
            const prevIndex = (currentIndex - 1 + angleOrder.length) % angleOrder.length;
            loadVideo(angleOrder[prevIndex]);
        }
        
        startX = e.clientX;
        didDrag = true;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    dragOverlay.style.cursor = 'grab';
    didDrag = false;
});

dragOverlay.addEventListener('mouseleave', () => {
    isDragging = false;
    dragOverlay.style.cursor = 'grab';
    didDrag = false;
});

// Touch events for mobile - SIMPLIFIED
dragOverlay.addEventListener('touchstart', (e) => {
    isDragging = true;
    touchStartX = e.touches[0].clientX;
    didDrag = false;
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - touchStartX;
    
    if (Math.abs(deltaX) > dragThreshold) {
        const angleOrder = ['perspective', 'front', 'side', 'top'];
        const currentIndex = angleOrder.indexOf(currentAngle);
        
        if (deltaX > 0) {
            const nextIndex = (currentIndex + 1) % angleOrder.length;
            loadVideo(angleOrder[nextIndex]);
        } else {
            const prevIndex = (currentIndex - 1 + angleOrder.length) % angleOrder.length;
            loadVideo(angleOrder[prevIndex]);
        }
        
        touchStartX = e.touches[0].clientX;
        didDrag = true;
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
    dragOverlay.style.cursor = 'grab';
    setTimeout(() => {
        didDrag = false;
    }, 100);
});

dragOverlay.addEventListener('touchcancel', () => {
    isDragging = false;
    dragOverlay.style.cursor = 'grab';
    didDrag = false;
});

// Audio player
const audioPlayer = new Audio();
let currentTrackIndex = 0;
let isPlaying = true;

const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev-track');
const nextBtn = document.getElementById('next-track');
const trackTitle = document.getElementById('current-track-title');
const trackPosition = document.getElementById('track-position');

function loadTrack(index) {
    const track = musicTracks[index];
    if (track) {
        audioPlayer.src = track.src;
        trackTitle.textContent = track.title;
        
        const totalTracks = musicTracks.length;
        trackPosition.textContent = `${index + 1}/${totalTracks}`;

        if (isPlaying) {
            audioPlayer.play().catch(e => {
                console.log('Audio autoplay prevented:', e);
                isPlaying = false;
                playPauseBtn.textContent = '▶';
            });
        }
    }
}

if (musicTracks.length > 0) {
    loadTrack(0);
}

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶';
    } else {
        audioPlayer.play().catch(e => console.log('Play failed:', e));
        playPauseBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
});

nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play().catch(e => console.log('Play failed:', e));
    }
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play().catch(e => console.log('Play failed:', e));
    }
});

audioPlayer.addEventListener('ended', () => {
    if (isPlaying) {
        audioPlayer.currentTime = 0;
        audioPlayer.play().catch(e => console.log('Play failed:', e));
    }
});

audioPlayer.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    trackTitle.textContent = 'Track unavailable';
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        videoElement.pause();
    } else {
        videoElement.play().catch(e => console.log('Play resumed:', e));
    }
});