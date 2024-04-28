/**

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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

**/

const getAllChildren = (htmlElement) => { // get all children of a node
    if (htmlElement.children.length === 0) return [htmlElement];
  
    let allChildElements = [];
  
    for (let i = 0; i < htmlElement.children.length; i++) {
      let children = getAllChildren(htmlElement.children[i]);
      if (children) allChildElements.push(...children);
    }
    allChildElements.push(htmlElement);
  
    return allChildElements;
  };

  function getAllRawText(node) {
    let rawText = '';

    // Function to traverse the DOM tree recursively
    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) { // ignore non-code blocks
            var container = node.parentNode;
            if(container.nodeName.toLowerCase() === 'code' || container.nodeName.toLowerCase() === 'span' || container.nodeName.toLowerCase() === 'div'){
                // console.log("Node is " + node.parentNode.nodeName.toLowerCase());
                var p1 = container.parentNode; // for stuff inside spans
                var p2 = p1.parentNode.parentNode; // for stuff outside spans
                if(p1.nodeName.toLowerCase() === 'code' || p2.nodeName.toLowerCase() === 'pre'){
                    // console.log("Code is valid!");
                    rawText += node.textContent.trim() + (container.classList.contains('hljs-comment') ? '\n' : " ");
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let childNode of node.childNodes) {
                traverse(childNode);
            }
        }
    }

    traverse(node);
    return rawText.trim();
}

// Handle new GPT outputs (DOM changes)
function handleDOMChanges(mutationsList) {
    mutationsList.forEach(function(mutation) {
        // Check if nodes were added to the DOM
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                // console.log("Checking a node with classlist " + node.classList);
                try{
                    // Check if the added node is a ChatGPT response element
                    if (node.classList.contains('prose')) {
                        console.log("Grabbed a new response");
                        console.log("Waiting for GPT..."); // wait for chatgpt to finish printing. this is a lazy fix, i'm sure there's probably an actual event for it.
                        setTimeout(function sleep(){
                            // console.log("Grabbing text.");
                            var rawtext = getAllRawText(node);
                            var tokens = rawtext.split(" ");
                            if (tokens[0] === "javascript"){
                                rawtext = rawtext.substring(9);
                                console.log(rawtext);
                            }
                            results = document.createElement("div");
                            results.className = "flex flex-col text-sm gradecontainer";
                            results.innerHTML = "TEST"
                            // node.parentNode.insertBefore(results, node.nextSibling);
                            node.appendChild(results);
                        }, 10000);
                    }
                } catch (TypeError){}
            });
        }
    });
}

// Create a MutationObserver to monitor DOM changes
var observer = new MutationObserver(handleDOMChanges);

// Start observing changes in the body of the document
observer.observe(document.body, { childList: true, subtree: true });
