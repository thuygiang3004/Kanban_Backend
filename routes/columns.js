const express = require("express");
const Column = require("../models/Column");
const internalErrorResponse = require("../utils/internalErrorResponse");
const Board = require("../models/Board");

const columnRouter = express.Router();

// Create a new column
columnRouter.post("/", async (req, res, next) => {
  try {
    const { title, boardId, columnId } = req.body;
    await Column.find().exec();
    const newColumn = new Column({
      board: boardId,
      title,
      cardIds: [],
      columnId,
    });
    const result = await newColumn.save();
    const board = await Board.findById(boardId).exec();
    if (!board) {
      res.status(404).json({ message: "No Board exists of provided id" });
    }
    const newColumnOrder = Array.from(board.columnOrder);
    debugger;
    newColumnOrder.push(result.columnId);
    board.set({ columnOrder: newColumnOrder });
    const result2 = await board.save();
    return res.status(201).json({
      message: "New Column Added and also updated columnOrder in board",
      column: result,
      board: result2,
    });
  } catch (e) {
    return internalErrorResponse(error, res);
  }
});

// Change column title
columnRouter.post("/edit", (req, res) => {
  console.log(req.body);
  const { columnId } = req.body;
  // if (req.query.title) {

  Column.findOne({ columnId: columnId }).exec((err, column) => {
    column.title = req.body.title;
    column
      .save()
      .then((result) =>
        res.status(201).json({ message: "card updated", data: column })
      )
      .catch((err) => res.status(500).json(err));
  });
  // Column.findOneAndUpdate(columnId, { title: req.body.title }, { new: false })
  //   .exec()
  //   .then((column) => {
  //     if (!column) {
  //       return res
  //         .status(404)
  //         .json({ message: "unable to find the column of provided id" });
  //     }
  //     column.save();
  //     console.log(column);
  //     return res
  //       .status(200)
  //       .json({ message: "column title updated ", data: column.title });
  //   })
  //   .catch((error) => internalErrorResponse(error, res));
  // } else {
  //   return res.status(404).json({ message: "Title not found in the query" });
  // }
});

// Get all the columns of the board
columnRouter.get("/all/:boardId", async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const board = await Board.findOne({ _id: boardId })
      .select("columnOrder")
      .exec();
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board with given id was not found" });
    }
    const columns = await Column.find({ board: boardId })
      .select("cardIds title columnId")
      .exec();
    return res
      .status(200)
      .json({ message: "success", columns: columns, board: board });
  } catch (e) {
    return internalErrorResponse(e, res);
  }
});

module.exports = columnRouter;
