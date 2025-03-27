document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.arrow-left');
    const nextBtn = document.querySelector('.arrow-right');
    
 

    const videos = [
        { id: 1, url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752c7d53dc51.mp4" },
        { id: 2, url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-67599fc6cf877.mp4" },
        { id: 3, url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58eebb8769.mp4" },
        { id: 4, url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752cf62572d6.mp4" }
    ];


    sliderContainer.innerHTML = videos.map(video => `
        <div class="slider-items">
            <video src="${video.url}" controls></video>
        </div>
    `).join('');

    const slides = document.querySelectorAll('.slider-items');
    let currentIndex = 1;
    const totalSlides = slides.length;

    function updateSlider() {
        // Reset all slides
        slides.forEach(slide => {
            slide.className = 'slider-items';
        });

        // Set active slide
        slides[currentIndex].classList.add('active');

        // Set left neighbor
        const leftIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        slides[leftIndex].classList.add('left-neighbor');

        // Set right neighbor
        const rightIndex = (currentIndex + 1) % totalSlides;
        slides[rightIndex].classList.add('right-neighbor');

        // Pause all videos except active
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (index !== currentIndex && video) {
                video.pause();
            }
        });
    }

    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Initialize slider
    
    if(totalSlides == 1){
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        slides[0].classList.add('active');

    }else{
        updateSlider();
    }
    //updateSlider();

    

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });


    slides.forEach((slide, index) => {
        slide.addEventListener('click', function() {
            if (!slide.classList.contains('active')) {
                goToSlide(index);
            }
        });
    });
});