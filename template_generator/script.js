let generated = false;
function addDescriptionForm(parentId, newElementClass, text = null) {
  var container = document.getElementById(parentId);
  var newDescriptionInput = document.createElement("textarea");
  newDescriptionInput.type = "text";
  newDescriptionInput.classList.add(newElementClass);
  newDescriptionInput.rows = "4";
  newDescriptionInput.cols = "50";
  if (text) {
    newDescriptionInput.value = text;
  }
  container.appendChild(newDescriptionInput);
}

function addSkill(title) {
  const skillsContainer = document.querySelector(
    `#skillCategoriesContainer div[data-category="${title}"] .skillsContainer`
  );
  const newSkillDiv = document.createElement("div");
  newSkillDiv.innerHTML = `
    <label for="skillTitle">Skill Title:</label><br>
    <input type="text" class="skillTitle"><br>
    <label for="skill">Skill:</label><br>
    <input type="text" class="skill"><br>
    <label for="starValue">Star Value:</label><br>
    <input type="number" class="starValue" min="0" max="5" step="1"><br><br>
  `;
  skillsContainer.appendChild(newSkillDiv);
}

function addSkillCategory(categoryName = null) {
  let categoryTitle;
  if (categoryName === null) {
    categoryTitle = prompt("Enter the category title:");
  } else {
    categoryTitle = categoryName;
  }
  let container;
  if (categoryTitle) {
    const skillCategoriesContainer = document.getElementById(
      "skillCategoriesContainer"
    );
    categoryDiv = document.createElement("div");
    categoryDiv.dataset.category = categoryTitle;
    categoryDiv.innerHTML = `
      <h3>${categoryTitle}</h3>
      <div class="skillsContainer"></div>
      <button type="button" onclick="addSkill('${categoryTitle}')">Add Skill</button>
    `;
    skillCategoriesContainer.appendChild(categoryDiv);
    container = categoryDiv.children[1];
  }
  return container;
}

function addCareer() {
  addCareerWithValues("", "", "", []);
}

function addEducation() {
  addEducationWithValues("", "", "", []);
}

function addDescription(container, className) {
  var descriptionContainer = container.querySelector(".descriptionContainer");
  var newDescriptionInput = document.createElement("textArea");
  newDescriptionInput.type = "text";
  newDescriptionInput.classList.add(className);
  newDescriptionInput.rows = "4";
  newDescriptionInput.cols = "50";
  descriptionContainer.appendChild(newDescriptionInput);
}

function addProject() {
  addProjectWithValues("", [], [], {});
}

function addLink(container) {
  var linksContainer = container.querySelector(".linksContainer");
  var newLinkDiv = document.createElement("div");
  newLinkDiv.innerHTML = `
      <label for="linkSrc">Source:</label><br>
      <input type="text" class="linkSrc"><br>
      <label for="linkText">Text:</label><br>
      <input type="text" class="linkText"><br>
      <label for="download">Download:</label>
      <input type="checkbox" class="download"><br>
      <label for="filename">Filename:</label><br>
      <input type="text" class="filename"><br><br>
  `;
  linksContainer.appendChild(newLinkDiv);
}

function grabTimelineInfo(elements, prefix) {
  var data = [];
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var name = element.parentNode.querySelector(`.${prefix}Name`).value;
    var location = element.parentNode.querySelector(`.${prefix}Location`).value;
    var descriptionInputs = element.parentNode.querySelectorAll(
      `.${prefix}DescriptionLine`
    );
    var descriptionLines = [];
    descriptionInputs.forEach(function (input) {
      if (input.value.trim() !== "") {
        descriptionLines.push(input.value);
      }
    });
    data.push({
      time: element.value,
      name: name,
      location: location,
      description: descriptionLines,
    });
  }
  return data;
}

function generateJSON() {
  generated = true;
  var aboutDescriptionLines = document.querySelectorAll(
    ".aboutDescriptionLine"
  );
  var aboutDescription = [];
  aboutDescriptionLines.forEach(function (line) {
    if (line.value.trim() !== "") {
      aboutDescription.push(line.value);
    }
  });

  const skillCategoriesContainer = document.getElementById(
    "skillCategoriesContainer"
  );
  const categoryDivs =
    skillCategoriesContainer.querySelectorAll("div[data-category]");

  const categories = [];

  categoryDivs.forEach((categoryDiv) => {
    const title = categoryDiv.dataset.category;
    const skills = categoryDiv.querySelectorAll(".skillsContainer .skillTitle");
    const skillValues = categoryDiv.querySelectorAll(".skillsContainer .skill");
    const starValues = categoryDiv.querySelectorAll(
      ".skillsContainer .starValue"
    );
    const categorySkills = [];
    for (let i = 0; i < skills.length; i++) {
      const subtitle = skillValues[i].value
        ? { subtitle: skillValues[i].value }
        : {};
      const starValue = starValues[i].value
        ? { starValue: parseInt(starValues[i].value) }
        : {};

      categorySkills.push({
        title: skills[i].value,
        ...subtitle,
        ...starValue,
      });
    }

    categories.push({
      title: title,
      values: categorySkills,
    });
  });

  var careers = document.getElementsByClassName("careerTime");
  var careersData = grabTimelineInfo(careers, "career");

  var educations = document.getElementsByClassName("eduTime");
  var educationsData = grabTimelineInfo(educations, "edu");

  var projects = document.getElementsByClassName("projName");
  var projectsData = [];
  for (var i = 0; i < projects.length; i++) {
    var linksContainer =
      projects[i].parentNode.querySelector(".linksContainer");
    var links = linksContainer.querySelectorAll("div");
    var linksData = [];
    links.forEach(function (linkDiv) {
      var linkSrc = linkDiv.querySelector(".linkSrc").value;
      var linkText = linkDiv.querySelector(".linkText").value;
      var download = linkDiv.querySelector(".download").checked;
      var filename = linkDiv.querySelector(".filename").value;
      var linkObj = {
        src: linkSrc,
        text: linkText,
      };
      if (download) {
        linkObj["download"] = true;
        linkObj["filename"] = filename;
      }
      linksData.push(linkObj);
    });

    var descriptionTextareas = projects[i].parentNode.querySelectorAll(
      ".projectDescriptionLine"
    );
    var descriptionLines = Array.from(descriptionTextareas).map(
      (textarea) => textarea.value
    );

    var iconSrc = projects[i].parentNode.querySelector(".iconSrc").value;
    var iconAlt = projects[i].parentNode.querySelector(".iconAlt").value;
    var iconTarget = projects[i].parentNode.querySelector(".iconTarget").value;

    projectsData.push({
      name: projects[i].value,
      links: linksData,
      description: descriptionLines,
      icon: {
        src: iconSrc,
        alt: iconAlt,
        target: iconTarget,
      },
    });
  }

  var data = {
    about: {
      summary: aboutDescription,
    },
    resume: {
      skills: {
        values: categories,
      },
      careers: {
        values: careersData,
      },
      education: {
        values: educationsData,
      },
    },
    projects: {
      values: projectsData,
    },
  };

  var jsonString = JSON.stringify(data, null, 2);
  document.getElementById("jsonOutput").innerText = jsonString;
}

function clearAll() {
  generated = false;
  var aboutDescriptionContainer = document.getElementById(
    "aboutDescriptionContainer"
  );
  aboutDescriptionContainer.innerHTML = "";
  var skillContainer = document.getElementById("skillCategoriesContainer");
  skillContainer.innerHTML = "";
  var projectContainer = document.getElementById("projectsContainer");
  projectContainer.innerHTML = "";
  var careersContainer = document.getElementById("careersContainer");
  careersContainer.innerHTML = "";
  var educationContainer = document.getElementById("educationContainer");
  educationContainer.innerHTML = "";
  var aboutContainer = document.getElementById("aboutDescriptionContainer");
  aboutContainer.innerHTML = "";
  document.getElementById("jsonOutput").innerText = "";
}
function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const jsonContent = e.target.result;
    try {
      const jsonData = JSON.parse(jsonContent);
      populateFieldsFromJSON(jsonData);
    } catch (error) {
      console.error("Error parsing JSON file:", error);
    }
  };

  reader.readAsText(file);
}

function populateFieldsFromJSON(jsonData) {
  clearAll();
  // Populate About section
  if (jsonData.about && jsonData.about.summary) {
    if (Array.isArray(jsonData.about.summary)) {
      jsonData.about.summary.forEach((element, _) => {
        addDescriptionForm(
          "aboutDescriptionContainer",
          "aboutDescriptionLine",
          element
        );
      });
    } else {
      addDescription(
        "aboutDescriptionContainer",
        "aboutDescriptionLine",
        jsonData.about.summary
      );
    }
  }

  // Populate Skills section
  if (
    jsonData.resume &&
    jsonData.resume.skills &&
    jsonData.resume.skills.values
  ) {
    const skillsData = jsonData.resume.skills.values;
    skillsData.forEach((category) => {
      const skillCategory = addSkillCategory(category.title);
      category.values.forEach((skill) => {
        const subtitle = skill.subtitle === undefined ? "" : skill.subtitle;
        addSkillWithValues(
          skillCategory,
          skill.title,
          subtitle,
          skill.starValue
        );
      });
    });
  }

  // Populate Careers section
  if (
    jsonData.resume &&
    jsonData.resume.careers &&
    jsonData.resume.careers.values
  ) {
    const careersData = jsonData.resume.careers.values;
    careersData.forEach((career) => {
      addCareerWithValues(
        career.time,
        career.name,
        career.location,
        career.description
      );
    });
  }

  // Populate Education section
  if (
    jsonData.resume &&
    jsonData.resume.education &&
    jsonData.resume.education.values
  ) {
    const educationsData = jsonData.resume.education.values;
    educationsData.forEach((education) => {
      addEducationWithValues(
        education.time,
        education.name,
        education.location,
        education.description
      );
    });
  }

  // Populate Projects section
  if (jsonData.projects && jsonData.projects.values) {
    const projectsData = jsonData.projects.values;
    projectsData.forEach((project) => {
      addProjectWithValues(
        project.name,
        project.links,
        project.description,
        project.icon
      );
    });
  }
}

function addSkillWithValues(element, title, subtitle, starValue) {
  var newSkillDiv = document.createElement("div");
  newSkillDiv.innerHTML = `
      <h3>Skill</h3>
      <label for="skillTitle">Skill Title:</label><br>
      <input type="text" class="skillTitle" value="${title}"><br>
      <label for="skill">Subtitle:</label><br>
      <input type="text" class="skill" value="${subtitle}"><br>
      <label for="starValue">Star Value:</label><br>
      <input 
        type="number" 
        class="starValue" 
        min="0" max="5" 
        step="1" value="${starValue}"><br><br>
  `;

  element.insertBefore(newSkillDiv, element.firstChild);
}

function addCareerWithValues(time, name, location, description) {
  var careersContainer = document.getElementById("careersContainer");
  var newCareerDiv = document.createElement("div");
  newCareerDiv.innerHTML = `
      <div>
          <h3>Career</h3>
          <label for="careerTime">Time:</label><br>
          <input type="text" class="careerTime" value="${time}"><br>
          <label for="careerName">Name:</label><br>
          <input type="text" class="careerName" value="${name}"><br>
          <label for="careerLocation">Location:</label><br>
          <input type="text" class="careerLocation" value="${location}"><br>
          <h4>Description</h4>
          <button type="button" onclick="addDescription(this.parentNode, 'careerDescriptionLine')">
          Add Bullet
          </button>
          <div class="descriptionContainer">
              ${getDescriptionHtml("careerDescriptionLine", description)}
          </div>
      </div>
  `;
  careersContainer.appendChild(newCareerDiv);
}

function getDescriptionHtml(className, description) {
  return description
    .map(
      (line) =>
        `<textarea class="${className}" rows="4" cols="50">${line}</textarea>`
    )
    .join("");
}

function addEducationWithValues(time, name, location, description) {
  var educationContainer = document.getElementById("educationContainer");
  var newEducationDiv = document.createElement("div");
  newEducationDiv.innerHTML = `
      <div>
          <h3>Education</h3>
          <label for="eduTime">Time:</label><br>
          <input type="text" class="eduTime" value="${time}"><br>
          <label for="eduName">Name:</label><br>
          <input type="text" class="eduName" value="${name}"><br>
          <label for="eduLocation">Location:</label><br>
          <input type="text" class="eduLocation" value="${location}"><br>
          <h4>Description</h4>
          <button type="button" onclick="addDescription(this.parentNode, 'eduDescriptionLine')">
          Add Bullet
          </button>
          <div class="descriptionContainer">
          ${getDescriptionHtml("eduDescriptionLine", description)}
          </div>
      </div>
  `;
  educationContainer.appendChild(newEducationDiv);
}

function generateProjectLinksString(links) {
  return links
    .map(
      (link) => `
  <div>
      <label for="linkSrc">Source:</label><br>
      <input type="text" class="linkSrc" value="${link.src}"><br>
      <label for="linkText">Text:</label><br>
      <input type="text" class="linkText" value="${link.text}"><br>
      <label for="download">Download:</label>
      <input type="checkbox" class="download" ${
        link.download ? "checked" : ""
      }><br>
      <label for="filename">Filename:</label><br>
      <input type="text" class="filename" value="${
        link.filename || ""
      }"><br><br>
  </div>
`
    )
    .join("");
}

function addProjectWithValues(name, links, description, icon) {
  var projectContainer = document.getElementById("projectsContainer");
  var newProjectDiv = document.createElement("div");
  newProjectDiv.innerHTML = `
      <h3>Project</h3>
      <label for="projName">Name:</label><br>
      <input type="text" class="projName" value="${name}"><br>
      <h4>Links</h4>
      <button type="button" onclick="addLink(this.parentNode)">Add Link</button>
      <div class="linksContainer">
          ${generateProjectLinksString(links)}
      </div>
      <label for="iconSrc">Icon Source:</label><br>
      <input type="text" class="iconSrc" value="${icon.src || ""}"><br>
      <label for="iconAlt">Icon Alt:</label><br>
      <input type="text" class="iconAlt" value="${icon.alt || ""}"><br>
      <label for="iconTarget">Icon Target:</label><br>
      <input type="text" class="iconTarget" value="${
        icon.target || ""
      }"><br><br>
      <label for="description">Description:</label><br>
      <button type="button" onclick="addDescription(this.parentNode, 'projectDescriptionLine')">
      Add Bullet
      </button>
      <div class="descriptionContainer">
          ${getDescriptionHtml("projectDescriptionLine", description)}
      </div>
  `;
  projectContainer.appendChild(newProjectDiv);
}

function populateFieldsFromFile() {
  const fileInput = document.getElementById("jsonFileInput");
  if (fileInput) {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const jsonContent = e.target.result;
        try {
          const jsonData = JSON.parse(jsonContent);
          populateFieldsFromJSON(jsonData);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };

      reader.readAsText(file);
    } else {
      console.error("No file selected.");
    }
  } else {
    console.error('Element with ID "jsonFileInput" not found.');
  }
}

function populateSkillCategories(jsonData) {
  const skillCategoriesContainer = document.getElementById(
    "skillCategoriesContainer"
  );
  skillCategoriesContainer.innerHTML = "";

  if (
    jsonData.resume &&
    jsonData.resume.skills &&
    jsonData.resume.skills.categories
  ) {
    const categories = jsonData.resume.skills.categories;
    categories.forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.innerHTML = `
        <h3>${category.title}</h3>
        <div class="skillsContainer"></div>
        <button type="button" onclick="addSkill('${category.title}')">Add Skill</button>
      `;
      skillCategoriesContainer.appendChild(categoryDiv);
    });
  }
}

function downloadJSON() {
  if (!generated) generateJSON();
  const jsonString = document.getElementById("jsonOutput").innerText;
  const filename = "resume.json"; // Set your desired filename here
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
