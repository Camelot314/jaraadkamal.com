/********************** GLOBALS ***********************************************/
function initialize () {
    console.log("hellO");
    shrinkFeatured();
    setUpStars();
}

let NavInfo = {
    wasVisible: false,
    currentlySelected: 0,
    heights: [0, 0, 0],
}

let ResizeAnimations = {
    resizeTimer: null,
    autoHeight: false,
    prevWidth: window.innerWidth,
}

let FeaturedAnimations = {
    transitionsSet: false,
}

let ProjSlider = {
    projectSlider: null,
    sliderWrapper: null,
    project1: null,
    project2: null,
    project3: null,
    project4: null,
    nav: null,
    highlited: null,
}

/***************************** LISTENERS **************************************/
window.onload = function() {
    shrinkFeatured();
    setUpStars();
}
window.addEventListener('resize', resizeWindow);
document.addEventListener("DOMContentLoaded", setUpProjectSlider);

/*************************** CORE FUNCTIONS ***********************************/

/**
* Sets up all the stars in the resume skills section
*/
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

/** 
 * Will convert a list of classnames into the number of starts the object
 * should have
 */
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


/**
 * Functions associated with shrinking the sliding content of the website.
 */
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
            ResizeAnimations.autoHeight = false;
        } else {
            var div = getFeaturedItem(i);
            var ogHeight = div.style.height;
            div.style.height = 'auto';
            NavInfo.heights[i] = getComputedStyle(div).height;
            div.style.height = ogHeight;
        }
    }
}

function resizeWindow() {
    const currentWidth = window.innerWidth;
    if (Math.abs(currentWidth - ResizeAnimations.prevWidth) < 10) {
        return;
    } 
    ResizeAnimations.prevWidth = currentWidth
    clearTimeout(ResizeAnimations.resizeTimer);
    ResizeAnimations.resizeTimer = setTimeout(setFeaturedHeight, 200);
    if (ResizeAnimations.autoHeight == false && NavInfo.wasVisible) {
        const i = NavInfo.currentlySelected;
        var div = getFeaturedItem(i);
        div.style.height = 'auto';
        NavInfo.heights[i] = div.clientHeight;
        ResizeAnimations.autoHeight = true;
    }
}

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
    if (!FeaturedAnimations.transitionsSet) {
        setTransitions();
        FeaturedAnimations.transitionsSet = true;
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
function setUpProjectSlider() {
    const projectSlider = document.getElementById('project-slider');
    ProjSlider.projectSlider = projectSlider;

    ProjSlider.sliderWrapper = projectSlider.parentNode;

    ProjSlider.project1 = document.getElementById('project-1');
    ProjSlider.project2 = document.getElementById('project-3');
    ProjSlider.project3 = document.getElementById('project-2');
    ProjSlider.project4 = document.getElementById('project-4');
    var nav = ProjSlider.sliderWrapper.children[1];
    ProjSlider.nav = nav;
    ProjSlider.highlited = 0;  
    adjustNavForce(0, 0);
    ProjSlider.projectSlider.addEventListener('scroll', projectScroll);

}

function projectScroll () {
    const scrollFront = this.scrollLeft;
    const width = getProjectWidth();

    if (width == 0) return;

    highlight = Math.round(scrollFront / width);
    adjustNav(highlight);
    
}

function adjustNavForce(highlight, old) {
    let nav = ProjSlider.nav;

    nav.children[old].classList.remove('slider-nav-hover');
    ProjSlider.highlited = highlight;
    nav.children[highlight].classList.add('slider-nav-hover');
}

function adjustNav(highlight) {
    const old = ProjSlider.highlited;
    if (highlight == old) {
        return;
    }
    adjustNavForce(highlight, old);
}

function getProjectWidth() {
    const style = window.getComputedStyle(ProjSlider.project1);
    return parseFloat(style.width);
}

function projectJump (index) {
    const width = getProjectWidth();
    ProjSlider.projectSlider.scrollLeft = width * index;
    adjustNav(index);
}

function nextProject() {
    const current = ProjSlider.highlited;
    projectJump((current + 1) % 4);
}

function prevProject() {
    const current = ProjSlider.highlited;
    projectJump((current + 3) % 4);
}