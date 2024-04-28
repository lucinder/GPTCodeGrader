const exampleVulns = [
    {"name":"CWE-23: Relative Path Traversal", // 1
     "link": "https://cwe.mitre.org/data/definitions/23.html",
     "lineNo":11,
     "desc" : "The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize sequences such as \"..\" that can resolve to a location that is outside of that directory."},
    {"name":"CWE-261: Weak Encoding for Password", // 2
     "link": "https://cwe.mitre.org/data/definitions/261.html",
     "lineNo":25,
     "desc" : "Obscuring a password with a trivial encoding does not protect the password."},
    {"name":"CWE-523: Unprotected Transport of Credentials",
     "link": "https://cwe.mitre.org/data/definitions/523.html",
     "lineNo":30, // 3
     "desc" : "Login pages do not use adequate measures to protect the user name and password while they are in transit from the client to the server."},
    {"name":"CWE-20: Improper Input Validation",
     "link": "https://cwe.mitre.org/data/definitions/20.html",
     "lineNo":9, // 4
     "desc" : "The product receives input or data, but it does not validate or incorrectly validates that the input has the properties that are required to process the data safely and correctly."},
    {"name":"CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')",
     "link": "https://cwe.mitre.org/data/definitions/89.html",
     "lineNo":87, // 5
     "desc" : "The product constructs all or part of an SQL command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended SQL command when it is sent to a downstream component. "},
    {"name":"CWE-94: Improper Control of Generation of Code ('Code Injection')",
     "link": "https://cwe.mitre.org/data/definitions/94.html",
     "lineNo":89, // 6
     "desc" : "The product constructs all or part of a code segment using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the syntax or behavior of the intended code segment. "},
    {"name":"CWE-260: Password in Configuration File",
     "link": "https://cwe.mitre.org/data/definitions/260.html",
     "lineNo":2, // 7
     "desc" : "The product stores a password in a configuration file that might be accessible to actors who do not know the password."},
    {"name":"CWE-502: Deserialization of Untrusted Data",
     "link": "https://cwe.mitre.org/data/definitions/502.html",
     "lineNo":100, // 8
     "desc" : "The product deserializes untrusted data without sufficiently verifying that the resulting data will be valid. "},
    {"name":"CWE-565: Reliance on Cookies without Validation and Integrity Checking",
     "link": "https://cwe.mitre.org/data/definitions/565.html",
     "lineNo":120, // 9
     "desc" : "The product relies on the existence or values of cookies when performing security-critical operations, but it does not properly ensure that the setting is valid for the associated user."},
    {"name":"CWE-830: Inclusion of Web Functionality from an Untrusted Source",
     "link": "https://cwe.mitre.org/data/definitions/830.html",
     "lineNo":132, // 10
     "desc" : "The product includes web functionality (such as a web widget) from another domain, which causes it to operate within the domain of the product, potentially granting total access and control of the product to the untrusted source. "}
  ];
  const gradeBgs = {
    'A' : "#d5f5e3",
    'B' : "#fcf3cf",
    'C' : "#fdebd0",
    'D' : "#fae5d3",
    'F' : "#fadbd8" };
  const gradeTexts = {
    'A' : "#145a32",
    'B' : "#7d6608",
    'C' : "#7e5109",
    'D' : "#784212",
    'F' : "#641e16",
  }
  const gradeBadges = {
    'A' : "#2ecc71",
    'B' : "#f4d03f",
    'C' : "#e67e22",
    'D' : "#dc7633",
    'F' : "#e74c3c",
  }
  const gradeThresholds = {
    7: 'D',
    5: 'C',
    3: 'B',
    1: 'A' };


/**

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//Require File saver
const fs = require('fs')
//Requre child process for running npm
const {execSync } = require('child_process')

**/ 
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
                console.log("This is where we would grade javascript!");
                // execSync('nps eslint download.txt')
            // if no matching code type was found log as unsupported code language
            default:
                console.log("Usupported code type detected")
        }
        return "Example output";
    };

    return codeGrader;
}

function getExampleVulnResults(vulnCount){ // make a list with our example vulns
    vulnList = [];
    for(let i = 0; i < vulnCount; i++){
      vulnList.push(exampleVulns[i]);
    } // push vulncount vulns to output
    return vulnList;
  }

  function displayGrade(element, vulnTotal){ // build grade output
    let score = Number(vulnTotal); // convert to int
    if(score > 10){ score = 10; } // limit to max 10
    vulns = getExampleVulnResults(score); // grab some example vulns
    
    let badge = document.createElement("div");
    badge.className = "flex flex-col";
    element.appendChild(badge);
    badge.style = " \
        min-width: 50px; \
        height: 50px; \
        border-radius: 50%; \
        margin-right: 10px; \
        margin-bottom: 10px; \
        text-align: center; \
        line-height: 50px; \
        font-size: 24px; \
        color: white; \
    ";
    let textbox = document.createElement("div");
    textbox.className = "flex flex-col";
    element.appendChild(textbox);
    textbox.style = " \
        font-size: 16px; \
    ";
    // console.log(score);
    letterGrade = 'F';
    for (var grade in gradeThresholds){ // find our letter grade
      if (score < grade){
        letterGrade = gradeThresholds[grade];
        break;
      }
    }
    // grab colors for this grade
    element.style.background = gradeBgs[letterGrade];
    badge.style.background = gradeBadges[letterGrade];
    element.style.color = gradeTexts[letterGrade];
    // build output
    badge.innerHTML = letterGrade;
    output = "<b style='font-size:20px;'>" + score + " vulnerabilities found!</b><br><br>";
    for (vuln in vulns){
      vuln = vulns[vuln];
      output += "<a href='" + vuln["link"] + "' style='color:blue;'>" + vuln["name"] + "</a>. (line " + vuln["lineNo"] + ")<br><t>" + vuln["desc"] + "<br><br>";
    }
    textbox.innerHTML = output;
    element.hidden = false; // show output
  }

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
                    // console.log("Got some code!");
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
                        // console.log("Grabbed a new response");
                        console.log("GPTVulnScan: Waiting for GPT..."); // wait for chatgpt to finish printing. this is a lazy fix, i'm sure there's probably an actual event for it.
                        setTimeout(function sleep(){
                            // console.log("Grabbing text.");
                            var rawtext = getAllRawText(node);
                            var tokens = rawtext.split(" ");
                            if (tokens[0] === "javascript"){
                                var rawtext = rawtext.substring(9);
                                // console.log(rawtext);
                                /**
                                let grader = CodeGrader(rawtext, "JavaScript") // create a new grader
                                grader.saveFile // save grader obj
                                let graderOut = grader.grade // run through scanner
                                */
                            }
                            var exampleScore = rawtext.length%10; // just use an example score for now
                            results = document.createElement("div");
                            results.className = "flex flex-col text-sm";
                            results.style = " \
                                display: flex; \
                                flex-direction: row; \
                                width: 100%; \
                                min-height:100px; \
                                height:auto; \
                                padding: 10px; \
                                border-radius: 10px; \
                                margin: 0 auto; \
                                font-family: Arial, Helvetica, sans-serif; \
                            ";
                            displayGrade(results,exampleScore);
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
