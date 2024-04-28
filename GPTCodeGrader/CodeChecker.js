//Require File saver
const fs = require('fs')
//Requre child process for running npm
const {execSync } = require('child_process')

//function to create a grader object that can be used by the extension
let CodeGrader = function (codeContent, codeType) {
    //create object
    let codeGrader = {};

    //file name for temp file
    codeGrader.fileName = "download.txt"

    //Create memory blob with
    codeGrader.content = new Blob([codeContent], { type: "text/plain;charset=utf-8", })

    //Code Language
    codeGrader.type = codeType

    //create and save file
    codeGrader.saveFile = function () {
        saveAs(codeGrader.content, codeGrader.fileName)
    };

    //add to this as we find additional linters for different languages
    codeGrader.grade = function () {
        switch (codeGrader.type) {
            case "JavaScript":
                //run eslint for js code
                execSync('nps eslint download.txt')
            // if no matching code type was found log as unsupported code language
            default:
                console.log("Usupported code type detected")
        }

    };

    return codeGrader;
}

//create a new grader 
let grader = CodeGrader("", "JavaScript")

//save the file
grader.saveFile

//run the linter
grader.grade