document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slider-items');
    const prevBtn = document.querySelector('.arrow-left');
    const nextBtn = document.querySelector('.arrow-right');
    let currentIndex = 2;
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
    updateSlider();

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