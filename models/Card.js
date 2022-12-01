const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  cardId: { type: String },
  title: { type: String, required: true },
  dueDate: { type: Date },
  column: { type: String, ref: "cards" },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const Card = mongoose.model("tasks", CardSchema);

module.exports = Card;
