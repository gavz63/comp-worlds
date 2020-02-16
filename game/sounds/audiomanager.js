class AudioManager {
    constructor() {

    }

    playMusic() {
        this.music.play();
    }

    pauseMusic() {
        this.music.pause();
    }

    setMusic(musicId) {
        this.music = document.getElementById(musicId);
        this.music.muted = false;
    }

    restartMusic() {
        this.music.currentTime = 0;
    }
}

// function playSound(soundId) {
//     document.getElementById(soundId).cloneNode(true).play();
//     //audioFile.play();
// }
//
// function pauseSound(soundId) {
//
// }