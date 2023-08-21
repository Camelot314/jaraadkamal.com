


document.addEventListener('DOMContentLoaded', initilize);


var transitionsSet = false;
let NavInfo = {
    wasVisible: false,
    currentlySelected: 0,
    heights: [0, 0, 0],
}
var resizeTimer;
var autoHeight = false;
var prevWidth = window.innerWidth;

window.onload = function() {
    shrinkFeatured();
    setUpStars();
}

function setUpStars() {
    var allStars = document.getElementsByClassName("star-holder");
    const length = allStars.length;
    for (var i = 0; i < length; i++) {
        const numStars = getStarCount(allStars[i].classList);
        if (numStars == null) {
            return;
        }
        const numEmpty = 5 - numStars;
        for (var j = 0; j < 5; j ++) {
            const star = new Image();
            if (j < numEmpty) {
                star.src = "assets/star-empty.png";
                star.className = "empty";
                allStars[i].appendChild(star);
            } else {
                star.src = "assets/star.png";
                star.className = "filled";
                allStars[i].appendChild(star);
            }
        }
    }
}

function getStarCount(list) {
    var length = list.length;
    for (var i = 0; i < length; i++) {
        switch (list[i]) {
            case '5-star':
                return 5;
            case '4-star':
                return 4;
            case '3-star':
                return 3;
            case '2-star':
                return 2;
            case '1-star':
                return 1;
            case '0-star':
                return 0;
            default:
                continue;
        }
    }
    return null;
}

function shrinkFeatured () {
    for (let i = 0; i < 3; i++) {
        var div = getFeaturedItem(i);
        NavInfo.heights[i] = div.clientHeight;
        div.style.height = 0;
    }

    NavInfo.wasVisible = false;
}

function setFeaturedHeight() {
    for (let i = 0; i < 3; i ++) {
        if (i == NavInfo.currentlySelected) {
            var div = getFeaturedItem(i);
            div.style.height = `${div.clientHeight}px`;
            autoHeight = false;
        } else {
            var div = getFeaturedItem(i);
            var ogHeight = div.style.height;
            div.style.height = 'auto';
            NavInfo.heights[i] = getComputedStyle(div).height;
            div.style.height = ogHeight;
        }
    }
}

window.addEventListener('resize', function () {
    const currentWidth = window.innerWidth;
    if (Math.abs(currentWidth - prevWidth) < 10) {
        return;
    } 
    prevWidth = currentWidth
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setFeaturedHeight, 200);
    if (autoHeight == false && NavInfo.wasVisible) {
        const i = NavInfo.currentlySelected;
        var div = getFeaturedItem(i);
        div.style.height = 'auto';
        NavInfo.heights[i] = div.clientHeight;
        autoHeight = true;
    }
});

function setTransitions() {
    for (let i = 0; i < 3; i ++) {
        var div = getFeaturedItem(i);
        div.style.transition = "height 0.5s";
    }
}

function getNavItem(index) {
    return getItem(index, "-nav")
}

function getFeaturedItem(index) {
    return getItem(index, "");
}

function getItem(index, type) {
    switch(index) {
        case 0:
            return document.getElementById("about" + type);
        case 1:
            return document.getElementById("resume" + type);
        default:
            return document.getElementById("projects" + type);
    }
}


function toggleFeatured(index) {
    var slidingDiv = getFeaturedItem(index);
    var nav = null;

    // setting transitions
    if (!transitionsSet) {
        setTransitions();
        transitionsSet = true;
    }

    // was invisible.
    if (!NavInfo.wasVisible || NavInfo.currentlySelected != index) {
        // doing the nav 
        nav = getNavItem(index);
        nav.style.backgroundColor = "#497AA6";

        if (NavInfo.currentlySelected != index) {
            // removing the old one
            const old = NavInfo.currentlySelected;
            var oldNav = getNavItem(old);
            oldNav.style.backgroundColor = "#000";
            var oldFeatured = getFeaturedItem(old);
            oldFeatured.style.height = 0;
        }
        slidingDiv.style.height = `${NavInfo.heights[index]}px`
        slidingDiv.style.height = NavInfo.heights[index];
        
        NavInfo.currentlySelected = index;
        NavInfo.wasVisible = true;
    } else if (NavInfo.wasVisible && index == NavInfo.currentlySelected) {
        // closing
        nav = getNavItem(NavInfo.currentlySelected);
        nav.style.backgroundColor = "#000";
        slidingDiv.style.height = '0px';
        
        NavInfo.wasVisible = false;
    }
}

function highlightSkill(section) {
    section.style.fontWeight = "bold";
    var starHolder = section.children[1];
    for (var i = 0; i < 5; i ++) {
        const child = starHolder.children[i];
        if (child.className == "empty") {
            child.src = "assets/star-empty-blue.png";
        } else if (child.className == "filled") {
            child.src = "assets/star-blue.png";
        }
    }
}

function unhighlightSkill(section) {
    section.style.fontWeight = "normal";
    var starHolder = section.children[1];
    for (var child=starHolder.firstChild; child !== null; child=child.nextSibling) {
        if (child.className == "empty") {
            child.src = "assets/star-empty.png";
        } else if (child.className == "filled") {
            child.src = "assets/star.png";
        }
    }
}

// PROJECTS
const carouselInner = document.querySelector('.carousel-inner');
const prevButton = document.querySelector('.carousel-control-prev');
const nextButton = document.querySelector('.carousel-control-next');
console.log(document.querySelector('carousel'));
console.log(carouselInner);
console.log(prevButton);
console.log(nextButton);
let currentIndex = 0;
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;


// function prevButtonAciton () {
//     currentIndex = (currentIndex - 1) + 3 % 3;
//     updateCarousel();
// }

// function nextButtonAction() {
//     currentIndex = (currentIndex + 1) % 3; 
//     updateCarousel();
// }

// function mouseDownAction(e) {
//     isDragging = true;
//     startPosition = e.clientX;
//     currentTranslate = getCurrentTranslate();
// }

// function touchStartListener(e) {
//     isDragging = true;
//     startPosition = e.touches[0].clientX;
//     currentTranslate = getCurrentTranslate();
// }

// function touchendListener() {
//     if (!isDragging) return;

//     isDragging = false;
//     const threshold = carouselInner.offsetWidth / 4;

//     if (Math.abs(startPosition - getCurrentTranslate()) > threshold) {
//         if (startPosition < getCurrentTranslate()) {
//             currentIndex = Math.max(currentIndex - 1, 0);
//         } else {
//             currentIndex = Math.min(currentIndex + 1, 2);
//         }
//     }

//     updateCarousel();
// }



prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + 3) % 3;
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % 3;
    updateCarousel();
});

carouselInner.addEventListener('mousedown', (e) => {
    isDragging = true;
    startPosition = e.clientX;
    currentTranslate = getCurrentTranslate();
});

carouselInner.addEventListener('touchstart', (e) => {
    isDragging = true;
    startPosition = e.touches[0].clientX;
    currentTranslate = getCurrentTranslate();
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const currentPosition = e.clientX;
    const deltaX = currentPosition - startPosition;
    const newTranslate = currentTranslate + deltaX;

    setTranslate(newTranslate);
});

window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const currentPosition = e.touches[0].clientX;
    const deltaX = currentPosition - startPosition;
    const newTranslate = currentTranslate + deltaX;

    setTranslate(newTranslate);
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;

    isDragging = false;
    const threshold = carouselInner.offsetWidth / 4;

    if (Math.abs(startPosition - getCurrentTranslate()) > threshold) {
        if (startPosition < getCurrentTranslate()) {
            currentIndex = Math.max(currentIndex - 1, 0);
        } else {
            currentIndex = Math.min(currentIndex + 1, 2);
        }
    }

    updateCarousel();
});

carouselInner.addEventListener('touchend', () => {
    if (!isDragging) return;

    isDragging = false;
    const threshold = carouselInner.offsetWidth / 4;

    if (Math.abs(startPosition - getCurrentTranslate()) > threshold) {
        if (startPosition < getCurrentTranslate()) {
            currentIndex = Math.max(currentIndex - 1, 0);
        } else {
            currentIndex = Math.min(currentIndex + 1, 2);
        }
    }

    updateCarousel();
});

function updateCarousel() {
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function getCurrentTranslate() {
    const transformValue = window.getComputedStyle(carouselInner).getPropertyValue('transform');
    const matrix = new DOMMatrixReadOnly(transformValue);
    return matrix.m41;
}

function setTranslate(translate) {
    carouselInner.style.transform = `translateX(${translate}px)`;
}
