const roastButton = document.getElementById('roast-button');
const roastResult = document.getElementById('roast-result');
const resumeUpload = document.getElementById('resume-upload');
const downloadButton = document.getElementById('download-button');
const loader = document.getElementById('loader');
const backgroundAudio = document.getElementById('background-audio');
const memeAudio = document.getElementById('meme-audio');
const clickToStart = document.getElementById('click-to-start');

function startBackgroundMusic() {
    if (backgroundAudio.paused) {
        backgroundAudio.play().then(() => {
            clickToStart.style.display = 'none';
        }).catch(error => {
            console.warn("Background audio autoplay prevented:", error);
        });
    }
    // Remove the event listeners so they don't run again
    document.removeEventListener('click', startBackgroundMusic);
    document.removeEventListener('keydown', startBackgroundMusic);
}

document.addEventListener('click', startBackgroundMusic);
document.addEventListener('keydown', startBackgroundMusic);


roastButton.addEventListener('click', () => {
    const resume = resumeUpload.files[0];
    downloadButton.style.display = 'none';
    roastResult.innerHTML = '';
    loader.style.display = 'block';


    if (!resume) {
        roastResult.innerHTML = 'Please provide a resume to roast.';
        loader.style.display = 'none';
        return;
    }

    const formData = new FormData();
    formData.append('resume', resume);

    fetch('/roast', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        return response.json();
    })
    .then(data => {
        if (data.imageUrl) {
            const imageUrl = data.imageUrl;
            roastResult.innerHTML = `<img src="${imageUrl}" alt="Roasted Meme" style="max-width: 100%;">`;
            
            backgroundAudio.pause();
            memeAudio.load();
            const playPromise = memeAudio.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                })
                .catch(error => {
                    console.error("Meme audio playback failed:", error);
                });
            }

            downloadButton.style.display = 'block';
            downloadButton.onclick = () => {
                const a = document.createElement('a');
                a.href = imageUrl;
                a.download = 'roasted-meme.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        } else {
            roastResult.innerHTML = 'Could not generate a roast. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        roastResult.innerHTML = 'An error occurred while roasting. Please try again.';
    })
    .finally(() => {
        loader.style.display = 'none';
    });
});

memeAudio.addEventListener('ended', () => {
    backgroundAudio.play();
});