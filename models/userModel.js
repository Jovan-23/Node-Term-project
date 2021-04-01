const database = [
  // USER 1
  {
    id: 1,
    friends: [],
    name: "Jovan Sekhon",
    email: "jovansekhon@gmail.com",
    password: "jovan123",
    reminders: [
      {
        id: 1,
        title: "Reminder1",
        description: "r1",
        completed: false,
        date: "2021-03-17",
        tags: [
          { tagID: 1, tagName: "Family" },
          { tagID: 2, tagName: "House" },
        ],
        subTasks: [
          { subID: 1, subName: "Go Out", subCheck: true },
          { subID: 2, subName: "Go Int", subCheck: false },
        ],
      },
      {
        id: 2,
        title: "Reminder2",
        description: "r2",
        completed: true,
        date: "2023-03-17",
        tags: [
          { tagID: 1, tagName: "Outdoor" },
          { tagID: 2, tagName: "Grocery" },
        ],
        subTasks: [
          { subID: 1, subName: "Go Shop", subCheck: true },
          { subID: 2, subName: "Leave Shop", subCheck: false },
        ],
      },
    ],
  },
  // USER 2
  {
    id: 2,
    friends: [],
    name: "Bob Test",
    email: "bob@gmail.com",
    password: "bob123",
    reminders: [
      {
        id: 1,
        title: "Bob Reminder1",
        description: "Bob r1",
        completed: false,
        date: "2021-03-19",
        tags: [
          { tagID: 1, tagName: "Bob Family" },
          { tagID: 2, tagName: "Bob House" },
        ],
        subTasks: [],
      },
      {
        id: 2,
        title: "Bob Reminder2",
        description: "Bob r2",
        completed: true,
        date: "2023-03-17",
        tags: [],
        subTasks: [
          { subID: 1, subName: "Bob Go Shop", subCheck: false },
          { subID: 2, subName: "Bob Leave Shop", subCheck: false },
        ],
      },
    ],
  },
  // USER 3
  {
    id: 3,
    friends: [],
    name: "Jim Test",
    email: "jim@gmail.com",
    password: "jim123",
    reminders: [
      {
        id: 1,
        title: "jim Reminder1",
        description: "Jim r1",
        completed: false,
        date: "2021-03-17",
        tags: [
          { tagID: 1, tagName: "Jim Family" },
          { tagID: 2, tagName: "Jim House" },
        ],
        subTasks: [
          { subID: 1, subName: "Jim Go Out", subCheck: true },
          { subID: 2, subName: "Jim Go Int", subCheck: false },
        ],
      },
      {
        id: 2,
        title: "Jim Reminder2",
        description: "jim r2",
        completed: true,
        date: "2023-03-17",
        tags: [
          { tagID: 1, tagName: "Jim Outdoor" },
          { tagID: 2, tagName: "Jim Grocery" },
        ],
        subTasks: [
          { subID: 1, subName: "jim Go Shop", subCheck: true },
          { subID: 2, subName: "Jim Leave Shop", subCheck: false },
        ],
      },
    ],
  },
];

const userModel = {
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  createUserGithub: (user) => {
    const newUser = {
      id: user.id,
      name: user.username,
      // avatar: user._json.avatar_url,
    };
    database.push(newUser);
    console.log("\n\nDatabase", database);
    return newUser;
  },
};

module.exports = { database, userModel };
