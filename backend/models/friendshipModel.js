const mongoose = require(`mongoose`);

const friendship = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Student",
    required: true,
  },
  reciever_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Student",
    required: true,
  },
  req_status: {
    type: Number,
    required: true,
  },
  requested_date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Friendship", friendship);