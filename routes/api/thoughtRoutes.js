const router = require('express').Router();

// import methods
const {
   getAllThoughts,
   getThought,
   createThought,
   updateThought,
   deleteThought,
   addReaction,
   removeReaction
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThought).put(updateThought).delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction)

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;