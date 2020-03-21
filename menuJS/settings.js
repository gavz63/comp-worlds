if (sessionStorage.getItem('master_volume') === null
|| sessionStorage.getItem('music_volume') === null
|| sessionStorage.getItem('gameplay_volume') === null
|| sessionStorage.getItem('fps') === null) {
    sessionStorage.clear();
    sessionStorage.setItem('master_volume', '100');
    sessionStorage.setItem('music_volume', '100');
    sessionStorage.setItem('gameplay_volume', '100');
    sessionStorage.setItem('fps', '60');
}

window.onload = () => {
    const fps30 = document.getElementById("fps30");
    fps30.onclick = () => {
        setFPS30();
    };

    const fps60 = document.getElementById("fps60");
    fps60.onclick = () => {
        setFPS60();
    };

    const sfxDown = document.getElementById("sfxDown");
    sfxDown.onclick = () => {
        changeSFXVolume(eval(sessionStorage.getItem('gameplay_volume')) - 10);
    };
    const sfxUp = document.getElementById("sfxUp");
    sfxUp.onclick = () => {
        changeSFXVolume(eval(sessionStorage.getItem('gameplay_volume')) + 10);
    };
    const sfxVolume = document.getElementById("sfxDown");
    const musicDown = document.getElementById("musicDown");
    musicDown.onclick = () => {
        changeMusicVolume(eval(sessionStorage.getItem('music_volume')) - 10);
    };
    const musicUp = document.getElementById("musicUp");
    musicUp.onclick = () => {
        changeMusicVolume(eval(sessionStorage.getItem('music_volume')) + 10);
    };
    const musicVolume = document.getElementById("musicVolume");

    if (sessionStorage.getItem('fps') === '60') {
        setFPS60();
    } else {
        setFPS30();
    }

    changeSFXVolume(eval(sessionStorage.getItem('gameplay_volume')));
    changeMusicVolume(eval(sessionStorage.getItem('music_volume')));
};

function setFPS30() {
    fps60.style.display = "inline";
    fps30.style.display = "none";
    sessionStorage.setItem('fps', '30');
}

function setFPS60() {
    fps30.style.display = "inline";
    fps60.style.display = "none";
    sessionStorage.setItem('fps', '60');
}

function changeSFXVolume(vol) {
    if (vol >= 0 && vol <= 100 && vol % 10 === 0) {
        sessionStorage.setItem('gameplay_volume', "" + vol);
        if (vol === 0) sfxVolume.style.backgroundImage = "url('./menuImages/v0.png')";
        else if (vol === 10) sfxVolume.style.backgroundImage = "url('./menuImages/v1.png')";
        else if (vol === 20) sfxVolume.style.backgroundImage = "url('./menuImages/v2.png')";
        else if (vol === 30) sfxVolume.style.backgroundImage = "url('./menuImages/v3.png')";
        else if (vol === 40) sfxVolume.style.backgroundImage = "url('./menuImages/v4.png')";
        else if (vol === 50) sfxVolume.style.backgroundImage = "url('./menuImages/v5.png')";
        else if (vol === 60) sfxVolume.style.backgroundImage = "url('./menuImages/v6.png')";
        else if (vol === 70) sfxVolume.style.backgroundImage = "url('./menuImages/v7.png')";
        else if (vol === 80) sfxVolume.style.backgroundImage = "url('./menuImages/v8.png')";
        else if (vol === 90) sfxVolume.style.backgroundImage = "url('./menuImages/v9.png')";
        else if (vol === 100) sfxVolume.style.backgroundImage = "url('./menuImages/v10.png')";
    }
}

function changeMusicVolume(vol) {
    if (vol >= 0 && vol <= 100 && vol % 10 === 0) {
        sessionStorage.setItem('music_volume', "" + vol);
        if (vol === 0) musicVolume.style.backgroundImage = "url('./menuImages/v0.png')";
        else if (vol === 10) musicVolume.style.backgroundImage = "url('./menuImages/v1.png')";
        else if (vol === 20) musicVolume.style.backgroundImage = "url('./menuImages/v2.png')";
        else if (vol === 30) musicVolume.style.backgroundImage = "url('./menuImages/v3.png')";
        else if (vol === 40) musicVolume.style.backgroundImage = "url('./menuImages/v4.png')";
        else if (vol === 50) musicVolume.style.backgroundImage = "url('./menuImages/v5.png')";
        else if (vol === 60) musicVolume.style.backgroundImage = "url('./menuImages/v6.png')";
        else if (vol === 70) musicVolume.style.backgroundImage = "url('./menuImages/v7.png')";
        else if (vol === 80) musicVolume.style.backgroundImage = "url('./menuImages/v8.png')";
        else if (vol === 90) musicVolume.style.backgroundImage = "url('./menuImages/v9.png')";
        else if (vol === 100) musicVolume.style.backgroundImage = "url('./menuImages/v10.png')";
    }
}