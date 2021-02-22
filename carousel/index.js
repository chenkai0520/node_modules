
class Carousel {
    /**
     * 
     * @param {string} container 容器id
     * @param {object} param1 rollingTime 切换需要的过度时间默认1000ms，interval切换时间5000ms，isAuto是否开启自动切换,data生成轮播图的数据
     */
    constructor(container, {
        rollingTime = 1000,
        interval = 5000,
        isAuto = true,
        data,
    } = {}) {

        this.container = document.getElementById(container);
        if (!this.container) {
            throw `找不到容器:${container}`;
        }

        if (!Array.isArray(data) || data.find((val) => {
                return !val.img;
            })) {
            throw `数据不合法`;
        }

        this.data = data;
        this.rollingTime = rollingTime;
        this.interval = Math.max(rollingTime, interval);
        this.curentIndex = 0;
        this.isAuto = isAuto;
        this.timeInterval = null;

        this.init();

        if (this.isAuto) {
            this.mountInterval();
        }
    }
    init() {
        let swiperListContainer = document.createElement('div');
        swiperListContainer.className = 'swiper-list-container';
        let swiperOptionContainer = document.createElement('div');
        swiperOptionContainer.className = 'swiper-option-container';

        this.data.forEach((val, index) => {
            let swiperItem = document.createElement('div');

            swiperItem.dataset.index = index;
            swiperItem.style.backgroundImage = `url(${val.img})`;
            swiperItem.style.transition = `${this.rollingTime}ms`;

            let swiperOption = document.createElement('span');

            if (index == this.curentIndex) {
                swiperItem.className = 'swiper-item swiper-item-active';
                swiperOption.className = 'swiper-option swiper-option-active';
            } else {
                swiperItem.className = 'swiper-item';
                swiperOption.className = 'swiper-option';
            }
            swiperOption.dataset.index = index;


            swiperListContainer.appendChild(swiperItem);
            swiperOptionContainer.appendChild(swiperOption);
        });

        let swiperContainer = document.createElement('div');
        swiperContainer.className = 'swiper-container';
        swiperContainer.appendChild(swiperListContainer);
        swiperContainer.appendChild(swiperOptionContainer);

        this.container.appendChild(swiperContainer);

        swiperOptionContainer.onclick = (event) => {
            if ('index' in event.target.dataset) {
                this.switchByIndex(event.target.dataset.index);
            };
        };
    }
    switchByIndex(index) {
        if (this.curentIndex == index) return;
        let curentNode = this.container.querySelector(`.swiper-item-active`);
        let selectNode = this.container.querySelector(`[data-index='${index}']`);
        curentNode.classList.remove('swiper-item-active');
        selectNode.classList.add('swiper-item-active');

        this.container.querySelector('.swiper-option-container .swiper-option-active').classList.remove(
            'swiper-option-active');
        this.container.querySelector(`.swiper-option-container [data-index='${index}']`).classList.add(
            'swiper-option-active');

        this.curentIndex = index;
    }
    mountInterval() {
        this.timeInterval = setInterval(() => {
            if (this.curentIndex + 1 >= this.data.length) {
                this.switchByIndex(0);
            } else {
                this.switchByIndex(this.curentIndex * 1 + 1);
            }
        }, this.interval);
    }
    destroyInterval() {
        clearInterval(this.timeInterval);
    }
}

(typeof module === "object" && typeof module.exports === "object") ? module.exports = Carousel : globalThis['Carousel'] = Carousel;