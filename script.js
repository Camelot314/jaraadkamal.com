/********************** GLOBALS ***********************************************/
function initialize () {
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
    setMainBannerHeight();
    setUpStars();
    setUpHighlighting();
    shrinkFeatured();
}
window.addEventListener('resize', resizeWindow);
document.addEventListener("DOMContentLoaded", setUpProjectSlider);

/*************************** CORE FUNCTIONS ***********************************/

function setMainBannerHeight() {
    var navbar = document.getElementById("navbar");
    var mainBanner = document.getElementById("main-banner");
    let navbarHeight = navbar.clientHeight;
    let windowHeight = window.innerHeight;
    
    mainBanner.style.height = (windowHeight - navbarHeight + 1) + "px";
}

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
        let starString = "";
        for (var j = 0; j < 5; j ++) {

            if (j < numStars) {
                starString += "★";
            }  else {
                starString += "☆";
            }
            if (j < 5) {
                starString += " ";
            }
        }
        let text = document.createTextNode(starString);
        allStars[i].appendChild(text);
    }
}

function setUpHighlighting() {
    var allSkills = document.getElementsByClassName("skill");
    const length = allSkills.length;
    for (var i = 0; i < length; i++) {
        allSkills[i].onmouseenter = function () {highlightSkill(this)};
        allSkills[i].onmouseleave = function () {unhighlightSkill(this)};
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

function scrollFeatured() {
    let mainBannerHeight = document.getElementById("main-banner").clientHeight;
    var footer = document.getElementById("final-section");

    if (document.body.clientHeight < (2 * mainBannerHeight)) {
        footer.style.height = mainBannerHeight + "px";
    }

    window.scroll({
        top: mainBannerHeight + 1,
        behavior: "smooth"
    });

    setTimeout(function () {
        footer.style.height = "auto";
    }, 300);
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
        scrollFeatured();
        // doing the nav 
        nav = getNavItem(index);
        let navChosenColor = window.getComputedStyle(document.body)
            .getPropertyValue("--accent-color");
        nav.style.backgroundColor = navChosenColor;

        if (NavInfo.currentlySelected != index) {
            // removing the old one
            const old = NavInfo.currentlySelected;
            var oldNav = getNavItem(old);
            oldNav.style.backgroundColor = null;
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
        nav.style.backgroundColor = null;
        slidingDiv.style.height = '0px';
        
        NavInfo.wasVisible = false;
    }
}

function highlightSkill(section) {
    let highlightColor = window.getComputedStyle(document.body)
        .getPropertyValue('--accent-bright');
    section.style.color = highlightColor;
}

function unhighlightSkill(section) {
    section.style.color = null;
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

function colorToRgba(colorString) {
    if (colorString.startsWith("#")) {
        let hex = colorString.substring(1);
        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((char) => char + char)
                .join("");
        } 
        if (hex.length === 8) {
            const a = parseInt(hex.slice(6, 8), 16) / 255;
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return [r, g, b, a];
        } else {
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return [r, g, b, 1]; // Alpha is set to 1 for hex colors
        }
    } else if (colorString.startsWith("rgba")) {
        const rgbaValues = colorString.substring(colorString.indexOf("(") 
            + 1, colorString.lastIndexOf(")")).split(",");
        if (rgbaValues.length === 4) {
            return rgbaValues.map((value, index) => (index === 3 ? 
                parseFloat(value) : parseInt(value)));
        }
    } else if (colorString.startsWith("rgb")) {
        const matches = colorString.match(/\d+/g);
        if (matches.length === 3 || matches.length === 4) {
            const alpha = matches[3] ? parseFloat(matches[3]) : 1;
            return [...matches.slice(0, 3).map(Number), alpha];
        }
    }
    return null;
}

function rgbToHue(r, g, b) {
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    let hue;

    if (max === 0) {
      return 0; // Return 0 for black
    } else if (min === max) {
      return 0; // Return 0 for grayscale
    } else {
      switch (max) {
        case r:
          hue = (g - b) / (max - min);
          break;
        case g:
          hue = 2 + (b - r) / (max - min);
          break;
        case b:
          hue = 4 + (r - g) / (max - min);
          break;
      }
      hue *= 60;
      if (hue < 0) hue += 360;
    }

    return hue;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
