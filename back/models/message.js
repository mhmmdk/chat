// Minimal message model (for future DB integration)
class Message {
  constructor(id, user, text, time) {
    this.id = id;
    this.user = user;
    this.text = text;
    this.time = time;
  }
}

module.exports = Message;
