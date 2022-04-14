(() => {
  const LEVELS = { EASY: 3, HARD: 4 };

  const DATA_X = 'data-position-x';
  const DATA_Y = 'data-position-y';

  const hasElementAtPosition = (x, y) => {
    const nodes = document.querySelectorAll(`[${DATA_X}="${x}"][${DATA_Y}="${y}"]`);
    return nodes.length > 0;
  };

  const getPositionFromElement = (element) => {
    const x = Number(element.getAttribute(DATA_X));
    const y = Number(element.getAttribute(DATA_Y));
    return { x, y };
  };

  const updateElementsPosition = (element, level) => {
    const { x, y } = getPositionFromElement(element);

    if (y !== 0 && !hasElementAtPosition(x, y - 1)) {
      // if not first row and there is no element above => move top
      element.setAttribute(DATA_Y, String(y - 1));
    } else if (y < level - 1 && !hasElementAtPosition(x, y + 1)) {
      // if not last row and there is no element below => move down
      element.setAttribute(DATA_Y, String(y + 1));
    } else if (x !== 0 && !hasElementAtPosition(x - 1, y)) {
      // if not first column and there is no element on left => move left
      element.setAttribute(DATA_X, String(x - 1));
    } else if (x < level - 1 && !hasElementAtPosition(x + 1, y)) {
      // if not last column and there is no element on right => move right
      element.setAttribute(DATA_X, String(x + 1));
    }
  };

  const shuffleArray = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  };

  const getRandomArray = (maxElements) => {
    const array = [];
    for (let i = 0; i <= maxElements; i += 1) { array.push(i); }

    shuffleArray(array);

    return array;
  };

  const generateInitialArray = (level) => {
    const tiles = [];
    const maxElements = 2 ** level;
    const numbersArray = getRandomArray(maxElements);

    let index = 0;
    for (let i = 0; i < level; i += 1) {
      for (let j = 0; j < level; j += 1) {
        // stop if we have enough elements and skip zero since it is marking a blank space
        if (index <= maxElements && numbersArray[index] !== 0) {
          tiles.push({ x: j, y: i, number: String(numbersArray[index]) });
        }

        index += 1;
      }
    }

    return tiles;
  };

  const moveElement = (element) => {
    const { x, y } = getPositionFromElement(element);
    const size = element.offsetHeight;

    element.style.transform = `translateX(${x * size}px) translateY(${y * size}px)`;
  };

  const updateUI = (tiles) => {
    const elements = document.getElementsByTagName('li');
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].innerHTML = tiles[i].number;
      elements[i].setAttribute(DATA_X, tiles[i].x);
      elements[i].setAttribute(DATA_Y, tiles[i].y);

      moveElement(elements[i]);
    }
  };

  const handleListClick = (level) => (event) => {
    if (event.target.tagName !== 'LI') return;

    updateElementsPosition(event.target, level);
    moveElement(event.target);
  };

  const startNewGame = (level) => {
    const tiles = generateInitialArray(level);
    updateUI(tiles);

    const listElements = document.getElementsByTagName('ul');
    if (!listElements || !listElements.length) return;

    listElements[0].classList.add(`level-${level}`);
    listElements[0].addEventListener('click', handleListClick(level));
  };

  startNewGame(LEVELS.EASY);

  window.shuffle = () => startNewGame(LEVELS.EASY);
})();
