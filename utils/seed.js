const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Create empty array to hold the users
  const users = [];
  // Loop 5 times, add users
  for (let i = 0; i < 5; i++) {
    const username = `User${i}`
    const email = `user${i}@email.com`

    users.push({
      username,
      email,
    });
  }
  await User.collection.insertMany(users);

  // make thoughts array
  const thoughts = [];

  for (let i = 0; i < 5; i++) {
    const reactionsArr = [];
    for (let j = 0; j < 2; j++) {
      reactionsArr.push({
        reactionBody: `cool reaction ${j}`,
        username: `User${Math.floor(Math.random() * 5)}`
      });
    }

    thoughts.push({
      thoughtText: `thought of User${i}`,
      username: `User${i}`,
      reactions: reactionsArr
    });
  }

  // create thoughts and update user
  for (let i = 0; i < thoughts.length; i++) {
    await Thought.create(thoughts[i])
      .then((thought) =>
        User.findOneAndUpdate(
          { username: thoughts[i].username },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        )
      )
      .catch((err) => {
        console.log(err);
      });
  };

  // give each user a random friend, if random friend is self, skip
  for (let i = 0; i < users.length; i++) {
    const allUsers = await User.find();
    const friend = allUsers[[Math.floor(Math.random() * allUsers.length)]];

    if (friend.username != users[i].username) {
      await User.findOneAndUpdate(
        { username: users[i].username },
        { $addToSet: { friends: friend._id } },
        { runValidators: true, new: true }
      )
        .catch((err) => console.log(err));
    }
  };

  // done
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
