class DOMHelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    let finishButton = element.querySelector("button:last-of-type");

    finishButton.textContent =
      finishButton.textContent === "active" ? "Finish" : "Activate";
    destinationElement.append(element);
  }
}

class ProjectItem {
  projectItemElement;
  projectElementId;
  constructor(projectItemElement) {
    this.projectItemElement = projectItemElement;
    this.projectElementId = projectItemElement.id;
  }

  connectSwitchButton(moveProjectFunction, type) {
    let moveProjectButton = this.projectItemElement.querySelector(
      "button:last-of-type"
    );
    moveProjectButton = DOMHelper.clearEventListeners(moveProjectButton);
    moveProjectButton.textContent = type === "active" ? "Finish" : "Activate";
    moveProjectButton.addEventListener(
      "click",
      moveProjectFunction.bind(null, this.projectElementId)
    );
  }
}

class ProjectList {
  projects = [];
  addProjectHandlerFunction;
  constructor(type) {
    this.type = type;
    this.projectItemElementsList = document.querySelectorAll(
      `#${type}-projects li`
    );
  }

  populateProjectItemsAndConnectSwitchButton() {
    let counter = 0;
    for (const prjItem of this.projectItemElementsList) {
      const projectItem = new ProjectItem(prjItem);
      this.projects.push(projectItem);
      console.log(`project item counter ${counter}`, "\n", this.projects);
      projectItem.connectSwitchButton(this.switchProject.bind(this), this.type);
      console.log(`Project Item's last button (finish/activate) is connected to switchProject function of "${this.type}" list`);
      counter ++;
    }
  }

  setAddProjectHandlerFunction(addProjectHandlerFunction) {
    this.addProjectHandlerFunction = addProjectHandlerFunction;
  }

  addProject(projectItem) {
    this.projects.push(projectItem);
    console.log(`Added project to a ${this.type}'s projects array list`, projectItem.projectElementId);
    DOMHelper.moveElement(
      projectItem.projectElementId,
      `#${this.type}-projects ul`
    );
    console.log(`moved and rendered project item ${projectItem.projectElementId} to ${this.type}'s list element` );
    projectItem.connectSwitchButton(this.switchProject.bind(this), this.type);
    projectItem.connectSwitchButton.bind(
      projectItem,
      this.addProjectHandlerFunction,
      this.type
    );
    console.log(`Project Item's last button (finish/activate) is again connected to switchProject function of "${this.type}" list after moving element to a new list`);
  }

  switchProject(projectItemId) {
    const projectItemIndex = this.projects.findIndex(
      (p) => p.projectElementId === projectItemId
    );
    const projectItemArray = this.projects.splice(projectItemIndex, 1);

    this.addProjectHandlerFunction(projectItemArray[0]);
  }
}

class App {
  static init() {
    console.log("initializing project..");
    const activeProjectList = new ProjectList("active");
    console.log("initial active projects' list is created", "\n", activeProjectList);
    const finishedProjectList = new ProjectList("finished");
    console.log("initial finished projects' list is created", "\n", finishedProjectList);
    console.log(
      "creating individual project items out of projects elements list.."
    );
    activeProjectList.populateProjectItemsAndConnectSwitchButton();
    finishedProjectList.populateProjectItemsAndConnectSwitchButton();
    App.setHandlerFunction(activeProjectList, finishedProjectList);
    App.setHandlerFunction(finishedProjectList, activeProjectList);
  }

  static setHandlerFunction(sourceProjectList, destinationProjectList) {
    sourceProjectList.setAddProjectHandlerFunction(
      sourceProjectList.addProject.bind(destinationProjectList)
    );
  }
}
App.init();
