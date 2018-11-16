import express from "express";
import bodyParser from "body-parser";

const request = require("request");
const rp = require("request-promise");
require("dotenv").config();

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get the file information for particular project from figma API
function makeRequest(url, token, callback) {
  request(
    {
      url: url,
      json: true,
      headers: {
        "X-Figma-Token": token
      }
    },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      callback(body);
    }
  );
  // TODO: parse file info and save to files variable maybe?
}

app.get("/api/v1/cover/:stage", (req, res) => {
  const stage = parseInt(req.params.stage, 10);
  var url =
    "https://api.figma.com/v1/projects/" + process.env.ID_PROJECT + "/files";
  var token = process.env.TOKEN;

  var options = {
    uri: url,
    headers: {
      "X-Figma-Token": token
    },
    json: true
  };

  rp(options).then(function(response) {
    // console.log(response.files);
    var file = response.files.find(function(element) {
      return element.name === "2018-03-PDP-buyX-" + stage + "%";
    });
    // console.log(file.thumbnail_url);
    var thumbnail_url =
      "https://s3-alpha.figma.com/thumbnails/" +
      /[^/]*$/.exec(file.thumbnail_url)[0];

    res.status(200).send({
      success: "true",
      thumbnail_url: thumbnail_url
    });
  });
});

// Get file information for file in project
// Idea is to pick a file based on a "stage" param
// e.g. ?stage=30 would get the file related to a 30% review
// Note: This will probably be replaced by a more specific call e.g. frames
app.get("/api/v1/:idProject/files", (req, res) => {
  const idProject = parseInt(req.params.idProject, 10);
  var url =
    "https://api.figma.com/v1/projects/" + process.env.ID_PROJECT + "/files";
  var token = process.env.TOKEN;
  // 1. get files in project
  // TEST: print the file details for project
  makeRequest(url, token, function(response) {
    // 2. check if file relating to stage exists
    // 3. check for any overwritten versions
    // 4. get correct version (if there is an overwritten version)
    // 5. get frames for file

    // TEST: get files for version 30
    res.status(200).send({
      success: "true",
      message: "files retrieved successfully",
      // TODO need to replace with actual file information
      files: ["file1", "file2"]
    });
  });
});

app.get("/api/v1/title", (req, res) => {
  var url =
    "https://api.figma.com/v1/teams/" + process.env.ID_TEAM + "/projects";
  var token = process.env.TOKEN;
  makeRequest(url, token, function(response) {
    var title;
    var projects = response.projects;
    for (const proj of projects) {
      if (proj.id == process.env.ID_PROJECT) {
        title = proj.name;
      }
    }
    res.status(200).send({
      success: "true",
      message: "got project name successfully",
      title: title
    });
  });
});

app.get("/api/v1/team", (req, res) => {
  var url = "https://api.figma.com/v1/me";

  var team = ["matt", "chan"];
  var tokens = [process.env.TOKENMATT, process.env.TOKENCHAN];
  var requests = 0;
  var teamDetails = [];

  for (i in tokens) {
    makeRequest(url, tokens[i], function(response) {
      teamDetails.push(response);
      requests++;
      if (requests == team.length) {
        res.status(200).send({
          success: "true",
          message: "got team details successfully",
          team: teamDetails
        });
      }

      var title;
      var projects = response.projects;
      for (const proj of projects) {
        if (proj.id == process.env.ID_PROJECT) {
          title = proj.name;
        }
      }
    });
  }
});

// Get port from process e.g. heroku or defaults to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
