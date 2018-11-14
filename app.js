import express from "express";
import bodyParser from "body-parser";

const request = require("request");

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get the file information for particular project from figma API
function getProjectFileDetails(idProject, callback) {
  request(
    {
      url: "https://api.figma.com/v1/projects/" + idProject + "/files",
      json: true,
      headers: {
        "X-Figma-Token": process.env.TOKEN
      }
    },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body.files);
      return callback(body.files);
    }
  );
  // TODO: parse file info and save to files variable maybe?
}

// Get file information for file in project
// Idea is to pick a file based on a "stage" param
// e.g. ?stage=30 would get the file related to a 30% review
// Note: This will probably be replaced by a more specific call e.g. frames
app.get("/api/v1/:idProject/files", (req, res) => {
  const idProject = parseInt(req.params.idProject, 10);

  // 1. get files in project
  // TEST: print the file details for project
  getProjectFileDetails(idProject, function(response) {
    var files = response;
    console.log(files);
  });

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

// Get port from process e.g. heroku or defaults to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
