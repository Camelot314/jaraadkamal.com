/********************** GLOBALS ***********************************************/
NUM_FEATURED = 3;
ABOUT_INDEX = 0;
RESUME_INDEX = 1;
PROJECTS_INDEX = 2;
AllowButtons = false;

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

let Projects = {
    numProjects: null
}


let ProjSlider = {
    projectSlider: null,
    sliderWrapper: null,
    project0: null,
    nav: null,
    highlited: null,
}

/***************************** LISTENERS **************************************/
window.onload = function() {
    setMainBannerHeight();
    setUpStars();
    setUpHighlighting();
    setUpProject();
    shrinkFeatured();
    AllowButtons = true;
}
window.addEventListener('resize', resizeWindow);

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
    for (let i = 0; i < NUM_FEATURED; i++) {
        var div = getFeaturedItem(i);
        NavInfo.heights[i] = div.clientHeight;
        div.style.height = 0;
    }

    NavInfo.wasVisible = false;
}

function setFeaturedHeight() {
    for (let i = 0; i < NUM_FEATURED; i ++) {
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
    for (let i = 0; i < NUM_FEATURED; i ++) {
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
        case ABOUT_INDEX:
            return document.getElementById("about" + type);
        case RESUME_INDEX:
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
    if (!AllowButtons) {
        return;
    }
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
    ProjSlider.projectSlider.scrollLeft = 0;
    ProjSlider.sliderWrapper = projectSlider.parentNode;

    var nav = ProjSlider.sliderWrapper.children[1];
    for (var i = 0; i < projectSlider.children.length; i ++) {
        var a = document.createElement('a');
        a.projectNum = i;
        nav.appendChild(a);
        a.addEventListener('click', projectJumpEvent);
        
    }

    ProjSlider.project0 = document.getElementById('project-0');
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

    let highlight = Math.round(scrollFront / width);
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
    const style = window.getComputedStyle(ProjSlider.project0);
    return parseFloat(style.width);
}

function projectJumpEvent (event) {
    const item = event.currentTarget;
    const index = item.projectNum;
    projectJump(index);
}

function projectJump(index) {
    const width = getProjectWidth();
    ProjSlider.projectSlider.scrollLeft = width * index;
    adjustNav(index);
}

function nextProject() {
    const current = ProjSlider.highlited;
    projectJump((current + 1) % Projects.numProjects);
}

function prevProject() {
    const current = ProjSlider.highlited;
    projectJump((current + (Projects.numProjects - 1)) % Projects.numProjects);
}

/**
 * Sets up the project related information. It adds the functionality to the 
 * mosaics that allow you to click and expand. It will also allow the buttons in
 * project nav slider to function.
 */
function setUpProject() {
    var projectsHolder = document.getElementById("project-slider");
    var projects = projectsHolder.children;
    var element = null;

    Projects.numProjects = projects.length;

    // saving initial values in the global ProjFocused object
    for (var i = 0; i < projects.length; i ++) {
        element = projects[i];
        projects[i].projectNum = i;
        projects[i].id = `project-${i}`;

        // for the dots on desktop projects
        if (i % 2 == 0) {
            projects[i].classList.add("project-even");
        } else {
            projects[i].classList.add("project-odd");
        }

        if (i > 1) {
            var style1 = document.head.appendChild(
                document.createElement("style"));
            var style2 = document.head.appendChild(
                document.createElement("style"));
            
            let first = (i % 2 == 0) ? "before" : "after";
            let second = (i % 2 != 0) ? "before" : "after";
            
            style1.innerHTML = `#project-${i}::${first} {left: ${100 * i}%;}`;
            style2.innerHTML = `#project-${i}::${second} {left: ${100 * (i + 1)}%;}`;
        }
        
    }

    // SETTING UP PROJECT SLIDER
    setUpProjectSlider();
}
