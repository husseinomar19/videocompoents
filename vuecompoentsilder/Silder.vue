<template>
  <div class="main-container">
    <div class="container">
      <div class="video-slider">
        <div class="slider-container">
          <div
            v-for="(video, index) in videos"
            :key="video.id"
            :class="getSlideClass(index)"
            @click="!isActive(index) && goToSlide(index)"
          >
            <video :src="getCurrentVideo(index)" class="slider-video" ref="videosRef" ></video>
            <svg
            class="play-button"
             @click.stop="playVideo(index)"
            v-show="!videoStates[index]?.playing"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="58" height="58" viewBox="0 0 58 58">
            <defs><clipPath id="clip-path"><rect id="Rectangle_148" data-name="Rectangle 148" width="58" height="58" transform="translate(104.786 185.989)" fill="none"/></clipPath></defs><g id="Group_308" data-name="Group 308" transform="translate(-104.786 -185.989)" opacity="0.7"><g id="Group_307" data-name="Group 307"><g id="Group_306" data-name="Group 306" clip-path="url(#clip-path)"><path id="Path_316" data-name="Path 316" d="M133.786,185.989a29,29,0,1,0,29,29,29,29,0,0,0-29-29m10.061,31.137-14.553,8.346c-1.957,1.122-3.544.2-3.544-2.055v-16.65c0-2.256,1.587-3.176,3.544-2.053l14.553,8.345c1.959,1.124,1.959,2.944,0,4.067" fill="#fff"/></g></g></g></svg>
          </div>
        </div>

        <div class="arrow arrow-left" @click="prevSlide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div class="arrow arrow-right" @click="nextSlide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <div class="hooks-concontainer">
      <div class="hooks">
        <div
          v-for="(hook, index) in currentHooks"
          :key="hook.id"
          class="hook"
          :class="{ background: currentAngleIndexes[currentIndex] === index }"
          @click="changeHook(index)"
        >
          <p>Hook {{ index + 1 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

export default {
  name: 'VideoSlider',
  setup() {
    const videos = ref([
      {
        id: 1,
        url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf949a2df41.mp4",
        hooks: [
          { id: '1', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf9482b5e7f.mp4' },
          { id: '2', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf948ed2872.mp4' },
          { id: '3', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66cf949a2df41.mp4' },
        ],
      },
      {
        id: 2,
        url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58eebb8769.mp4",
        hooks: [
          { id: '1', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58ef4ccada.mp4' },
          { id: '2', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58efe6a7e8.mp4' },
          { id: '3', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-66d58eebb8769.mp4' },
        ],
      },
      {
        id: 3,
        url: "https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d3418445e.mp4",
        hooks: [
          { id: '1', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d34d2fa30.mp4' },
          { id: '2', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d35f4cad1.mp4' },
          { id: '3', url: 'https://hyredStorage.s3.eu-central-003.backblazeb2.com/original_files/videos/allowed/admin-6752d3418445e.mp4' },
        ],
      },
    ]);

    const currentIndex = ref(1);
    const currentAngleIndexes = ref(videos.value.map(() => 0));
    const videoStates = ref(videos.value.map(() => ({ playing: false })));
    const videosRef = ref([]);

    const currentHooks = computed(() => videos.value[currentIndex.value].hooks);

    const getCurrentVideo = (index) => {
      return videos.value[index].hooks[currentAngleIndexes.value[index]].url;
    };

    const getSlideClass = (index) => {
      const base = 'slider-items';
      if (index === currentIndex.value) return `${base} active`;
      if (index === (currentIndex.value + 1) % videos.value.length) return `${base} right-neighbor`;
      if (index === (currentIndex.value - 1 + videos.value.length) % videos.value.length) return `${base} left-neighbor`;
      return base;
    };

    const isActive = (index) => currentIndex.value === index;

    const goToSlide = (index) => {
      currentIndex.value = (index + videos.value.length) % videos.value.length;
      pauseAllVideos();
    };

    const nextSlide = () => goToSlide(currentIndex.value + 1);
    const prevSlide = () => goToSlide(currentIndex.value - 1);

    const changeHook = (hookIndex) => {
      currentAngleIndexes.value[currentIndex.value] = hookIndex;
      const videoEl = videosRef.value[currentIndex.value];
      if (videoEl && !videoEl.paused) {
        videoEl.src = getCurrentVideo(currentIndex.value);
        videoEl.play();
      }
    };

    const playVideo = (index) => {
      const videoEl = videosRef.value[index];
      if (!videoEl) return;
      videoEl.play().then(() => {
        videoEl.controls = true;
        videoStates.value[index].playing = true;
      });
    };

    const pauseAllVideos = () => {
      videosRef.value.forEach((video, i) => {
        if (video) {
          video.pause();
          video.controls = false;
          videoStates.value[i].playing = false;
        }
      });
    };

    onMounted(() => {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      });
    });

    return {
      videos,
      currentIndex,
      currentAngleIndexes,
      getCurrentVideo,
      getSlideClass,
      currentHooks,
      changeHook,
      nextSlide,
      prevSlide,
      playVideo,
      videoStates,
      videosRef,
      isActive,
      goToSlide,
    };
  },
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    overflow-x: hidden;
}
.main-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 700px;
    max-width: 600px;

}

.container {
    width: 100%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1200px;
}

.video-slider {
    width: 550px;
    position: relative;
}

.slider-container {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.33, 1, 0.68, 1);
}
.play-button{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
    cursor: pointer;
}

.slider-items {
    position: absolute;
    /* width: 350px;
    height: 550px; */
    max-width: 350px;
    max-height: 550px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    transition: all 0.8s cubic-bezier(0.33, 1, 0.68, 1);
    visibility: hidden;
    opacity: 0;
}

.slider-items video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.slider-items.active {
    visibility: visible;
    opacity: 1;
    transform: translate(-50%, -50%) rotateY(0deg) scale(1);
    z-index: 3;
}

.slider-items.left-neighbor {
    visibility: visible;
    opacity: 0.2;
    transform: translate(-100%, -50%) rotateY(30deg) scale(0.85);
    rotate: -2deg;
    height: 480px;
    z-index: 0;
}
@media screen and (max-width: 768px) {
    .slider-items.left-neighbor {
        visibility: visible;
        opacity: 0.2;
        transform: translate(-100%, -50%) rotateY(30deg) scale(0.85);
        rotate: -2deg;
        height: 385px;
        z-index: 0;
    }
    .slider-items.right-neighbor {
        visibility: visible;
        opacity: 0.2;
        transform: translate(0%, -50%) rotateY(-30deg) scale(0.85);
        height: 385px !important;
        rotate: 2deg;
        z-index: 0;
    }
    .container {
        height: 500px;
    }

}

.slider-items.right-neighbor {
    visibility: visible;
    opacity: 0.2;
    transform: translate(0%, -50%) rotateY(-30deg) scale(0.85);
    height: 480px;
    rotate: 2deg;
    z-index: 0;
}

.arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.arrow:hover {
    background: rgba(255, 255, 255, 0.2);
}

.arrow svg {
    width: 24px;
    height: 24px;
    stroke: black;
}

.arrow-left {
    left: 40px;
}

.arrow-right {
    right: 40px;
}
.hooks-concontainer{
    overflow: auto;   /* Zorg ervoor dat scrollen mogelijk is als de inhoud breder is dan de container */
    white-space: nowrap;
    max-width: 400px; 
    overflow-x: auto;   /* Zorg ervoor dat scrollen mogelijk is als de inhoud breder is dan de container */
    white-space: nowrap;
}
.hooks {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    width: fit-content;
    border-radius: 50px;
    background-color: rgb(238, 238, 238);
    padding:4px;
   
}

.hook {
    display: flex;
    justify-content: center;
    align-items: center;
    padding:10px 20px;
    height: 100%;
    border-radius: 50px;
    cursor: pointer;
    transition: 0.5s ease;

}
.hook.background{
    background-color: white;
}

.hook p {
    font-size: 14px;
}
</style>
