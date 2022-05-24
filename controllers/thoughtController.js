const { Thought, User } = require('../models');

module.exports = {
   // get all thoughts
   getAllThoughts(req, res) {
      Thought.find()
         .then((thoughts) => res.json(thoughts))
         .catch((err) => res.status(500).json(err));
   },

   // get one thought
   getThought(req, res) {
      Thought.findOne({ _id: req.params.thoughtId })
         .then((thought) =>
            !thought
               ? res.status(404).json({ message: 'No thought with that ID' })
               : res.json(thought)
         )
         .catch((err) => res.status(500).json(err));
   },

   // create new thought
   createThought(req, res) {
      Thought.create(req.body)
         .then((thought) =>
            !thought
               ? res.status(404).json({ message: 'No thought with that ID' })
               : User.findOneAndUpdate(
                  { username: req.body.username },
                  { $addToSet: { thoughts: thought._id } },
                  { new: true }
            )
         )
         .then((user) =>
            !user
               ? res.status(404).json({
                  message: 'No user with that ID',
               })
               : res.json({ message: 'Thought created' })
         )
         .catch((err) => {
            console.log(err);
            res.status(500).json(err);
         });
   },

   // update thought
   updateThought(req, res) {
      Thought.findOneAndUpdate(
         { _id: req.params.thoughtId },
         { $set: req.body },
         { runValidators: true, new: true }
      )
         .then((thought) =>
            !thought
               ? res.status(404).json({ message: 'No thought with this id!' })
               : res.json(thought)
         )
         .catch((err) => {
            console.log(err);
            res.status(500).json(err);
         });
   },

   // delete thought
   deleteThought(req, res) {
      Thought.findOneAndRemove({ _id: req.params.thoughtId })
         .then((thought) =>
            !thought
               ? res.status(404).json({ message: 'No thought with this id!' })
               : User.findOneAndUpdate(
                  { thoughts: req.params.thoughtId },
                  { $pull: { thoughts: req.params.thoughtId } },
                  { new: true }
               )
         )
         .then((user) =>
            !user
               ? res.status(404).json({
                  message: 'Thought deleted but no user with that ID',
               })
               : res.json({ message: 'Thought deleted' })
         )
         .catch((err) => res.status(500).json(err));
   },

   // add reaction to thought
   addReaction(req, res) {
      Thought.findOneAndUpdate(
         { _id: req.params.thoughtId },
         { $addToSet: { reactions: req.body } },
         { runValidators: true, new: true }
      )
         .then((thought) =>
            !thought
               ? res.status(404).json({ message: 'No thought with that ID' })
               : res.json(thought)
         )
         .catch((err) => res.status(500).json(err));
   },

   // remove reaction from thought
   removeReaction(req, res) {
      Thought.findOneAndUpdate(
         { _id: req.params.thoughtId },
         { $pull: { reactions: { _id: req.params.reactionId } } },
         { runValidators: true, new: true }
      )
         .then((thought) =>
            !thought
               ? res.status(404).json({ message: 'No thought with that ID' })
               : res.json(thought)
         )
         .catch((err) => res.status(500).json(err));
   }

};