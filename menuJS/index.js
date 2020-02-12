if (sessionStorage.getItem('master_volume') === null
|| sessionStorage.getItem('music_volume') === null
|| sessionStorage.getItem('gameplay_volume') === null
|| sessionStorage.getItem('fps') === null) {
    sessionStorage.clear();
    sessionStorage.setItem('master_volume', '100');
    sessionStorage.setItem('music_volume', '100');
    sessionStorage.setItem('gameplay_volume', '100');
    sessionStorage.setItem('fps', '60');
    console.log("Initiated session storage.");
}

console.log(`MASTER VOLUME: ${sessionStorage.getItem('master_volume')}\nMUSIC VOLUME: ${sessionStorage.getItem('music_volume')}\nGAMEPLAY VOLUME: ${sessionStorage.getItem('gameplay_volume')}\nFPS: ${sessionStorage.getItem('fps')}`);