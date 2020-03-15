window.onload = () => {
    let audio_manager = new AudioManager();
    audio_manager.setMasterVolume(parseFloat(sessionStorage.getItem('master_volume')));
    audio_manager.setMusicVolume(parseFloat(sessionStorage.getItem('music_volume')));
    audio_manager.setSFXVolume(parseFloat(sessionStorage.getItem('gameplay_volume')));
    audio_manager.setMusic('endMusic');
    audio_manager.playMusic();

};

