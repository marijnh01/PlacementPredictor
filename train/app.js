import { DecisionTree } from "../libraries/decisiontree.js"
import { VegaTree } from "../libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/Placement_Data_Full_Class.csv"
const trainingLabel = "status"
const ignored = ["sl_no","gender","ssc_b","ssc_p","hsc_p",
    // "degree_p",
    // "workex","etest_p",
    "hsc_b","hsc_s","degree_t",
    "specialisation","mba_p","status","salary"

]


const placedplaced = document.getElementById("placedplaced");
const placednotplaced = document.getElementById("placednotplaced");
const notplacednotplaced = document.getElementById("notplacednotplaced");
const notplacedplaced = document.getElementById("notplacedplaced");


let predictedPlacedAndPlaced = 0;
let predictedPlacedButNotPlaced = 0;
let predictedNotPlacedAndNotPlaced = 0;
let predictedNotPlacedButPlaced = 0;

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5));
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    let placement = testData[0]
    let placementPrediction = decisionTree.predict(placement)
    console.log(`You are : ${placementPrediction}`)

    // todo : bereken de accuracy met behulp van alle test data
    function accuracy(data, tree, label) {
        let correct = 0;
        for (const row of data) {
            if (row.status === tree.predict(row)) {
                correct++
            }
        }
        let element = document.getElementById("display")
        element.innerText = `Accuracy ${label}: ${correct / data.length}`
        console.log(`Accuracy ${label}: ${correct / data.length}`)
    }

    //train accuracy
    accuracy(trainData, decisionTree, "train")

    //test accuracy
    accuracy(testData, decisionTree, "test")
    for (const row of data) {
        if (row.status === "Placed" && decisionTree.predict(row) === "Not Placed") {

            predictedPlacedButNotPlaced++
        } else if (row.status === "Not Placed" && decisionTree.predict(row) === "Placed") {

            predictedNotPlacedButPlaced++
        } else if (row.status === "Not Placed" && decisionTree.predict(row) === "Not Placed") {

            predictedNotPlacedAndNotPlaced++
        } else if (row.status === "Placed" && decisionTree.predict(row) === "Placed") {

            predictedPlacedAndPlaced++
        }
    }

    placedplaced.innerHTML = predictedPlacedAndPlaced;
    placednotplaced.innerHTML = predictedPlacedButNotPlaced;
    notplacednotplaced.innerHTML = predictedNotPlacedAndNotPlaced;
    notplacedplaced.innerHTML = predictedNotPlacedButPlaced;


    let jsonString = decisionTree.stringify()
    console.log(jsonString)


}


loadData()