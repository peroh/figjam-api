import express from "express";
import bodyParser from "body-parser";

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// var files = {};

// function updateFilenames() {

// }

// get all files
app.get("/api/v1/:idProject/files", (req, res) => {
  const idProject = parseInt(req.params.idProject, 1297611);

  // get files in project

  // get file information and check if current stage exists

  // check for any overwritten versions

  // get correct version

  // get frames for file

  console.log(req.body.stage);
  console.log(typeof req.body.version);
  if (req.body.stage === "30") {
    // get files for version 30
    res.status(200).send({
      success: "true",
      message: "files retrieved successfully",
      todos: ["file1", "file2"]
    });
  } else {
    res.status(200).send({
      success: "false",
      message: "files found for that version"
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
