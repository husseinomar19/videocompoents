document.addEventListener('DOMContentLoaded', function () {
    // Get the necessary DOM elements
    const sliderContainer = document.querySelector('.slider-container');
    const hooksContainer = document.querySelector('.hooks');
    const prevBtn = document.querySelector('.arrow-left');
    const nextBtn = document.querySelector('.arrow-right');
    
    // Array containing video objects
    const videos = [
        { 
            id: 1, 
            url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf949a2df41.mp4",
            hooks: [
                {id: '1', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf9482b5e7f.mp4'},
                {id: '2', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf948ed2872.mp4'},
                {id: '3', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf949a2df41.mp4'},
            ]
        },  
        { 
            id: 2, 
            url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58eebb8769.mp4",
            hooks: [
                {id: '1', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58ef4ccada.mp4'},
                {id: '2', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58efe6a7e8.mp4'},
                {id: '3', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58eebb8769.mp4'},
            ]
        },
        { 
            id: 3, 
            url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d3418445e.mp4",
            hooks: [
                {id: '1', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d34d2fa30.mp4'},
                {id: '2', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d35f4cad1.mp4'},
                {id: '3', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d3418445e.mp4'},
            ]
        },
    ];

    // Track the current angle index for each video
    const currentAngleIndexes = videos.map(() => 0); // Start with first angle for each video

    // Dynamically generate slider items
    sliderContainer.innerHTML = videos.map(video => `
        <div class="slider-items">
            <video src="${video.url}" class="slider-video"></video>
            <img class="play-button" src="./play-button.svg" alt="Play">
        </div>
    `).join('');

    // Select all slider items
    const slides = document.querySelectorAll('.slider-items');
    let currentIndex = 1; // Start with the second slide (index 1)
    const totalSlides = slides.length;

    // Function to update the hooks display based on current video
    function updateHooks() {
        const currentVideo = videos[currentIndex];
        hooksContainer.innerHTML = currentVideo.hooks.map((hook, index) => `
            <div class="hook ${index === currentAngleIndexes[currentIndex] ? 'background' : ''}" data-index="${index}">
                <p>Hook ${index + 1}</p>
            </div>
        `).join('');

        // Add event listeners to the new hooks
        const hookElements = document.querySelectorAll('.hook');
        hookElements.forEach((hook, index) => {
            hook.addEventListener('click', function() {
                const currentSlide = slides[currentIndex];
                const currentVideoObj = videos[currentIndex];
                const hookVideoUrl = currentVideoObj.hooks[index].url;
                
                // Update the current angle index for this video
                currentAngleIndexes[currentIndex] = index;
                
                // Replace the current video with the hook video
                const videoElement = currentSlide.querySelector('video');
                videoElement.src = hookVideoUrl;
                
                // If video was playing, continue playing the new one
                if (!videoElement.paused) {
                    videoElement.play().catch(error => {
                        console.error('Video playback failed:', error);
                    });
                }
                
                // Update hooks to highlight the selected one
                updateHooks();
            });
        });
    }

    // Function to update the slider
    function updateSlider() {
        // Remove all existing class names from slides
        slides.forEach(slide => slide.className = 'slider-items');
        
        // Add 'active' class to the current slide
        slides[currentIndex].classList.add('active');
        
        // Determine left and right neighboring slides
        const leftIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        slides[leftIndex].classList.add('left-neighbor');

        const rightIndex = (currentIndex + 1) % totalSlides;
        slides[rightIndex].classList.add('right-neighbor');
        
        // Pause all videos except the active one
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (index !== currentIndex && video) {
                video.pause();
                video.controls = false;
                slide.querySelector('.play-button').style.display = 'block';
            }
        });
        
        // Update hooks for the current video
        updateHooks();
    }

    // Function to go to a specific slide
    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        updateSlider();
    }

    // Function to move to the next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Function to move to the previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // If there's only one slide, hide navigation buttons
    if (totalSlides === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        slides[0].classList.add('active');
    } else {
        updateSlider();
    }

    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Play and Pause functionality
    slides.forEach(slide => {
        const video = slide.querySelector('video');
        const playButton = slide.querySelector('.play-button');
        
        // Play video when play button is clicked
        playButton.addEventListener('click', function () {
            slides.forEach(otherSlide => {
                const otherVideo = otherSlide.querySelector('video');
                const otherPlayButton = otherSlide.querySelector('.play-button');
                if (otherVideo !== video) {
                    otherVideo.pause();
                    otherVideo.controls = false;
                    otherPlayButton.style.display = 'block';
                }
            });

            video.play().then(() => {
                playButton.style.display = 'none';
                video.controls = true;
            }).catch(error => {
                console.error('Video could not be played:', error);
            });
        });

        // Pause video when clicked
        video.addEventListener('click', function () {
            if (!video.paused) {
                video.pause();
                playButton.style.display = 'block';
                video.controls = false;
            }
        });

        // Show play button when video ends
        video.addEventListener('ended', function () {
            playButton.style.display = 'block';
            video.controls = false;
        });
    });

    // Keyboard navigation (arrow keys)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
    
    // Click event to navigate to a slide
    slides.forEach((slide, index) => {
        slide.addEventListener('click', function () {
            if (!slide.classList.contains('active')) {
                goToSlide(index);
            }
        });
    });
});