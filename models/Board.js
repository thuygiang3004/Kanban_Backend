const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  title: { type: String, required: true },
  dueDate: { type: Date },
  columnOrder: [{ type: String, ref: "columns" }],
});

const Board = mongoose.model("boards", BoardSchema);

module.exports = Board;
