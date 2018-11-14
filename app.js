import express from "express";

// Set up the express app
const app = express();

// get all files
app.get("/api/v1/files", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "files retrieved successfully",
    todos: ["file1", "file2"]
  });
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
