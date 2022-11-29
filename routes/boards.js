const express = require("express");
const Board = require("../models/Board");
const User = require("../models/User");
const mongoose = require("mongoose");
const internalErrorResponse = require("../utils/internalErrorResponse");
const checkAuth = require("../middleware/check-auth");

const boardRouter = express.Router();

// Create new Board
boardRouter.post("/", checkAuth, (req, res, next) => {
  // console.log(req);
  const { title, dueDate } = req.body;
  console.log(req.userData);
  Board.find()
    .exec()
    .then((board) => {
      const newBoard = new Board({
        user: req.userData._id,
        title,
        dueDate,
        columnOrder: [],
        members: [req.userData._id],
      });

      newBoard
        .save()
        .then((result) =>
          res.status(201).json({ message: "created a new board", result })
        )
        .catch((err) => res.status(500).json(err));
    })
    .catch((error) => internalErrorResponse(error, res));
});

//Reorder Column
// boardRouter.patch("/", (req, res) => {
//   const { boardId, newColumnOrder } = req.body;
//   if (boardId && newColumnOrder) {
//     console.log(boardId, newColumnOrder);
//     Board.findOneAndUpdate({ _id: boardId }, { columnOrder: newColumnOrder })
//       .exec()
//       .then((board) => {
//         const updatedColumnOrder = board.columnOrder;
//         console.log(updatedColumnOrder);

//         res
//           .status(200)
//           .json({ message: "Reorder success", updatedColumnOrder });
//       })
//       .catch((error) => internalErrorResponse(error, res));
//   } else {
//     return res.status(400).json({ message: "required parameters are missing" });
//   }
// });

// Get Board info with boardId
boardRouter.get("/board/:boardId", (req, res, next) => {
  Board.findOne({ _id: req.params.boardId })
    .exec()
    .then((board) => {
      if (!board) {
        return res
          .status(404)
          .json({ message: "Board with given id was not found" });
      }
      return res.status(200).json({ details: board });
    })
    .catch((error) => internalErrorResponse(error, res));
});

// Get all boards list
boardRouter.get("/all", checkAuth, (req, res, next) => {
  // console.log(req.userData._id);
  Board.find({ user: req.userData._id })
    .select("columnOrder title _id dueDate")
    .exec()
    .then((boards) => {
      if (boards.length === 0) {
        const firstBoard = new Board({
          title: "",
          dueDate: "",
          columnOrder: [],
        });
        return res
          .status(200)
          .json({ message: "Board has not yet created by this user", boards });
      }
      return res.status(200).json({ message: "Success", boards });
    })
    .catch((error) => internalErrorResponse(error, res));
});

// Add member to a board
boardRouter.post("/members/add", checkAuth, (req, res, next) => {
  // console.log(req);
  try {
    const { userId, boardId } = req.body;
    Board.findOne({ _id: boardId }).exec((err, board) => {
      board.members.push(userId);
      board
        .save()
        .then((result) =>
          res
            .status(201)
            .json({ message: "members updated", data: board.members })
        )
        .catch((err) => res.status(500).json(err));
    });
  } catch (e) {
    return internalErrorResponse(e, res);
  }
});

// List members of a board
boardRouter.post("/members/all", (req, res, next) => {
  const { boardId } = req.body;
  let members = [];
  Board.findOne({ _id: boardId })
    .exec()
    .then(async (board) => {
      // board.members.map((memberId) => {
      //   User.findOne({ _id: memberId })
      //     .exec()
      //     .then((member) => {
      //       let publicMember = {
      //         _id: member._id,
      //         email: member.email,
      //       };
      //       newMembers.push(publicMember);
      //       console.log(newMembers);
      //     });
      // });
      const getMembers = async () => {
        for (let memberId of board.members) {
          await User.findOne({ _id: memberId })
            .exec()
            .then((member) => {
              let publicMember = {
                _id: member._id,
                name: member.name,
                email: member.email,
              };
              members.push(publicMember);
              // console.log(members);
            });
        }
        // console.log(members);
      };
      await getMembers();
      // console.log("L150" + members);
      return res.status(200).json({ members: members });
    })
    .catch((error) => internalErrorResponse(error, res));
});

// boardRouter.post("/members/all", async (req, res, next) => {
//   const { boardId } = req.body;
//   const board = await Board.findOne({ _id: boardId });

//   let members = [];

//   board.members.map((memberId) => {
//     User.findOne({ _id: memberId })
//       .exec()
//       .then((member) => {
//         let publicMember = {
//           _id: member._id,
//           email: member.email,
//         };
//         members.push(publicMember);
//       });
//     console.log("inside" + members);
//   });

//   return res.status(200).json({ members: members });
// });

module.exports = boardRouter;
