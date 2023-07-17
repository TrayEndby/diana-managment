export default () => {
  let cWidth = 340;
  let cHeight = 380;

  if (window.matchMedia('(min-width: 375px) and (min-height: 810px)').matches) {
    cWidth = 300;
    cHeight = 380;
  }

  if (window.matchMedia('(min-width: 576px) and (min-height: 500px)').matches) {
    cWidth = 360;
    cHeight = 400;
  }

  if (window.matchMedia("(min-width: 992px) and (min-height: 550px)").matches) {
    cWidth = window.innerWidth * 0.25;
    cHeight = window.innerHeight * 0.45;
  }

  const configOfCard = {
    widthOfCard: cWidth,
    heightOfCard: cHeight, // or 495px
    lengthOfBorder: 0,
  };

  const element = document.createElement('div');
  element.style.position = 'absolute';
  element.style.top = '-10000px';
  element.innerHTML = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width=${configOfCard.widthOfCard}
      height=${configOfCard.heightOfCard}
      viewBox="0 0 ${configOfCard.widthOfCard} ${configOfCard.heightOfCard}"
      >
          <rect
          fill="none"
          stroke="green"
          strokeWidth="6px"
          x="3"
          y="3"
          width=${configOfCard.widthOfCard - 6}
          height=${configOfCard.heightOfCard - 6}
          rx="105px"
          ry="105px" />
      </svg>
  `;
  document.body.appendChild(element);
  configOfCard.lengthOfBorder = element.children[0].children[0].getTotalLength();
  document.body.removeChild(Array.from(document.body.childNodes).pop());
  return configOfCard;
};

class GestureListener {
  constructor(element = document) {
    this.element = element;
    this.listeners = [];
    this.isStartedGesture = false;
    this.startPoint = { x: 0, y: 0 };
    this.endPoint = { x: 0, y: 0 };
  }

  init = () => {
    this.element.addEventListener('wheel', this.scrollHandler);
    this.element.addEventListener('keyup', this.handleKeyUp);
    this.element.addEventListener('mouseup', this.handleStop);
    this.element.addEventListener('mousedown', this.handleStart);
    this.element.addEventListener('touchstart', this.handleStart);
    this.element.addEventListener('touchend', this.handleStop);
  };

  handleStart = (e) => {
    let x = 0;
    let y = 0;
    if (e.type === 'mousedown') {
      x = e.pageX;
      y = e.pageY;
    } else if (e.type === 'touchstart') {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    } else {
      return;
    }

    this.startPoint = { x, y };
    this.isStartedGesture = true;
  };

  handleStop = (e) => {
    let x = 0;
    let y = 0;
    if (e.type === 'mouseup') {
      x = e.pageX;
      y = e.pageY;
    } else if (e.type === 'touchend') {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    } else {
      return;
    }

    this.endPoint = { x, y };
    this.isStartedGesture = false;
    this.emitGesture();
  };

  handleKeyUp = (e) => {
    if (e.key === 'ArrowDown' || e.keyCode === 41) {
      this.emit('Down');
    } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
      this.emit('Up');
    } else {
      return;
    }
  };

  isScrollable = (element) => {
    if (!element) {
      return false;
    }

    if (element.hasAttribute('data-prevent-scroll-propogation')) {
      return true;
    }

    return this.isScrollable(element.parentElement);
  };

  scrollHandler = (e) => {
    if (this.isScrollable(e.target) || this.timeout) {
      return;
    }
    const delta = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
    if (delta > 0) {
      this.emit('Up');
    } else if (delta < 0) {
      this.emit('Down');
    } else {
      return;
    }

    this.timeout = setTimeout(() => {
      this.timeout = null;
    }, 1000);
  };

  emitGesture = () => {
    const diffY = this.startPoint.y - this.endPoint.y;
    const direction = diffY < 0 ? 'Up' : 'Down';

    if (Math.abs(diffY) < 50) {
      return;
    }

    this.emit(direction);
  };

  emit = (direction) => this.listeners.forEach((func) => func(direction));

  on = (func) => {
    this.listeners.push(func);
  };

  stop = () => {
    this.listeners = [];
    this.startPoint = { x: 0, y: 0 };
    this.endPoint = { x: 0, y: 0 };

    this.element.removeEventListener('wheel', this.scrollHandler);
    this.element.removeEventListener('keyup', this.handleKeyUp);

    this.element.removeEventListener('mousedown', this.handleStart);
    this.element.removeEventListener('mouseup', this.handleStop);

    this.element.removeEventListener('touchstart', this.handleStart);
    this.element.removeEventListener('touchend', this.handleStop);
  };
}

export const gestureListener = new GestureListener();

export const getGoalColorByType = (type) => {
  switch (type) {
    case 2:
      return 'blue';
    case 3:
      return 'orange';
    default:
      return ''
  }
};