import {DecisionTree} from "./libraries/decisiontree.js"

const display = document.getElementById("display");
const placeBtn = document.querySelector("#predict");

placeBtn.addEventListener("click", () => loadSavedModel() && console.log("Loading model.."));

function loadSavedModel() {
    fetch("./model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    let workExperience = document.getElementById('workex').value;
    let degree = document.getElementById('degree_p').value;
    let employabilityTest = document.getElementById('etest_p').value;
    console.log(workExperience, degree, employabilityTest)

    let data = { workex: workExperience, degree_p: degree, etest_p: employabilityTest }
    console.log(data)
    let prediction = decisionTree.predict(data)
    console.log("Predicted: " + prediction)


    if (prediction === "Placed") {
        display.innerText = `You have a high chance to get placed`
    }
    else {
        display.innerText = `You have a chance to not get placed`
    }
}