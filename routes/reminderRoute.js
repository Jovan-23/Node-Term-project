const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const database = require("../models/userModel").database;
const alert = require("alert");
const fetch = require("node-fetch");

// GET
// Dashboard Page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const userID = req.user.id;

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  res.render("reminder/dashboard", {
    user: req.user,
    reminders: req.user.reminders,
    friends: database,
    friendsList: grabUser.friends,
  });
});

// GET
// Create Reminder
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("reminder/create");
});

// POST
// Add Friend
router.post("/friend", (req, res) => {
  const userID = req.user.id;
  let selectedFriend = req.body.friendSelected;
  selectedFriend = selectedFriend.split("ID: ").pop();

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get friend object from db
  let grabFriend = database.find((user) => {
    return user.id == selectedFriend;
  });

  if (grabFriend != undefined) {
    // Add friend reminders to user
    const newFriend = {
      friendUserID: selectedFriend,
      friendName: grabFriend.name,
      friendReminders: grabFriend.reminders,
    };

    if (
      grabUser.friends.some((f) => f.friendUserID == newFriend.friendUserID)
    ) {
      alert("This user is already your friend");
      res.redirect("/reminder/dashboard");
    } else {
      grabUser.friends.push(newFriend);
      res.redirect("/reminder/dashboard");
    }
  }
});

// GET
// Friend Single Reminder
router.get("/:friendID/:reminderID/friend", ensureAuthenticated, (req, res) => {
  const userID = req.user.id;
  const friendID = req.params.friendID;
  const reminderID = req.params.reminderID;

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get friend object from db
  let grabFriend = grabUser.friends.find((user) => {
    return user.friendUserID == friendID;
  });

  // Get specific reminder from friend
  let grabReminder = grabFriend.friendReminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  if (grabReminder != undefined) {
    res.render("reminder/single-reminder-friend", {
      reminderItem: grabReminder,
      tagsList: grabReminder.tags,
      subTasksList: grabReminder.subTasks,
    });
  } else {
    res.redirect("/reminder/dashboard");
  }
});

// POST
// Create Reminder
router.post("/create", (req, res) => {
  const userID = req.user.id;

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get the last element ID and increment it by 1, thus no repeat if delete and create
  let lastElementID = grabUser.reminders[grabUser.reminders.length - 1];

  const newReminderInfo = {
    id: grabUser.reminders.length === 0 ? 1 : lastElementID.id + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
    date: req.body.date,
  };

  grabUser.reminders.push(newReminderInfo);
  res.redirect("/reminder/dashboard");
});

// GET
// Single Reminder
router.get("/:id", ensureAuthenticated, (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get specific reminder from user
  let grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  // If tags don't exists add them
  if (!grabReminder.hasOwnProperty("tags")) {
    let tags = [];
    grabReminder["tags"] = tags;
  }

  // If sub tasks don't exists add them
  if (!grabReminder.hasOwnProperty("subTasks")) {
    let subTasks = [];
    grabReminder["subTasks"] = subTasks;
  }

  if (grabReminder != undefined) {
    res.render("reminder/single-reminder", {
      reminderItem: grabReminder,
      tagsList: grabReminder.tags,
      subTasksList: grabReminder.subTasks,
    });
  } else {
    res.redirect("/reminder/dashboard");
  }
});

// POST
// Add Tag
router.post("/:id/addTag", (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get specific reminder from user
  let grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  let lastTagID = grabReminder.tags[grabReminder.tags.length - 1];

  const newTag = {
    tagID: grabReminder.tags.length === 0 ? 1 : lastTagID.tagID + 1,
    tagName: req.body.tagAdd,
  };
  grabReminder.tags.push(newTag);
  res.redirect(`/reminder/${reminderID}`);
});

// POST
// Delete Tag
router.post("/:tagID/:id/deleteTag", (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;
  const tagID = req.params.tagID;

  // Get specific User
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // get Specific Reminder
  grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  // Filter Specific Tag
  grabReminder.tags = grabReminder.tags.filter((tag) => {
    return tag.tagID != tagID;
  });

  res.redirect(`/reminder/${reminderID}`);
});

// POST
// Add Sub Task
router.post("/:id/addSubTask", (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get specific reminder from user
  let grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  let lastSubID = grabReminder.subTasks[grabReminder.subTasks.length - 1];

  const newSubTask = {
    subID: grabReminder.subTasks.length === 0 ? 1 : lastSubID.subID + 1,
    subName: req.body.subTaskAdd,
    subCheck: false,
  };
  grabReminder.subTasks.push(newSubTask);
  res.redirect(`/reminder/${reminderID}`);
});

// POST
// Delete Sub Task
router.post("/:subTaskID/:id/deleteSubTask", (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;
  const subTaskID = req.params.subTaskID;

  // Get specific User
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // get Specific Reminder
  grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  // Filter Specific Sub Task
  grabReminder.subTasks = grabReminder.subTasks.filter((task) => {
    return task.subID != subTaskID;
  });

  res.redirect(`/reminder/${reminderID}`);
});

// GET
// Edit Single Sub Task
router.get("/:subTaskID/:id/edit", ensureAuthenticated, (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;
  const subTaskID = req.params.subTaskID;

  // Get specific User
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // get Specific Reminder
  grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  // get Specific Sub Task
  grabsubTasks = grabReminder.subTasks.find((task) => {
    return task.subID == subTaskID;
  });

  if (grabsubTasks != undefined) {
    res.render("reminder/editSubTask", {
      subTasksItem: grabsubTasks,
      reminderItem: grabReminder,
    });
  } else {
    res.redirect("/reminder/dashboard");
  }
});

// POST
// Edit Single Sub Task
router.post("/:subTaskID/:id/edit", ensureAuthenticated, (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;
  const subTaskID = req.params.subTaskID;

  // Get specific User
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // get Specific Reminder
  grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  // get Specific Sub Task
  grabsubTasks = grabReminder.subTasks.find((task) => {
    return task.subID == subTaskID;
  });

  // Edit the reminder
  if (grabsubTasks != undefined) {
    grabsubTasks.subName = req.body.subTaskName;

    if (req.body.completedSub === "true") {
      grabsubTasks.subCheck = true;
    } else {
      grabsubTasks.subCheck = false;
    }

    res.redirect(`/reminder/${grabReminder.id}`);
  } else {
    res.redirect(`/reminder/${grabReminder.id}`);
  }
});

// GET
// Edit Single Reminder
router.get("/:id/edit", ensureAuthenticated, (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;

  // Get specific user from db
  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get specific reminder from user
  let grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  if (grabReminder != undefined) {
    res.render("reminder/edit", { reminderItem: grabReminder });
  } else {
    res.redirect("/reminder/dashboard");
  }
});

// POST
// Edit Single Reminder
router.post("/:id/edit", (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;

  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  // Get specific reminder from user
  let grabReminder = grabUser.reminders.find((reminder) => {
    return reminder.id == reminderID;
  });

  // Edit the reminder
  if (grabReminder != undefined) {
    grabReminder.title = req.body.title;
    grabReminder.description = req.body.description;

    if (req.body.completed === "true") {
      grabReminder.completed = true;
    } else {
      grabReminder.completed = false;
    }

    grabReminder.date = req.body.date;

    res.redirect(`/reminder/${grabReminder.id}`);
  } else {
    res.redirect(`/reminder/${grabReminder.id}`);
  }
});

// POST
// Delete Single Reminder
router.post("/:id/delete", (req, res) => {
  const userID = req.user.id;
  const reminderID = req.params.id;

  let grabUser = database.find((user) => {
    return user.id == userID;
  });

  grabUser.reminders = grabUser.reminders.filter((reminder) => {
    return reminder.id != reminderID;
  });

  res.redirect("/reminder/dashboard");
});

module.exports = router;
