const Group = require("../models/Group");
const User = require("../models/User");
const File = require("../models/File");

// ================= GET ALL GROUP FILES =================
exports.getAllGroupFiles = async (req, res) => {
  try {

    console.log("🔥 getAllGroupFiles HIT");

    const userId = req.user.uid;

    // Get all groups where user is member
    const groups = await Group.find({
      $or: [
        { ownerId: userId },
        { "members.userId": userId },
      ],
    });

    const groupIds = groups.map((g) => g._id);

    if (groupIds.length === 0) return res.json([]);

    // 🔥 GET ALL FILES (NO owner filter)
    const files = await File.find({
      groupId: { $in: groupIds },
      isDeleted: { $ne: true },
    })
      .populate("groupId", "name")
      .sort({ createdAt: -1 });

    res.json(files);

  } catch (err) {
    console.error("SHARED FILES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    console.log("🔥 deleteGroup HIT");
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // 🔒 Only owner
    if (group.ownerId !== req.user.uid) {
      return res.status(403).json({ msg: "Only owner can delete group" });
    }

    // 🔥 CHECK FILES
    const filesCount = await File.countDocuments({
      groupId: group._id,
      isDeleted: false,
    });

    if (filesCount > 0) {
      return res.status(400).json({
        msg: "Delete files in the group before deleting the group",
      });
    }

    // ✅ DELETE GROUP
    await Group.findByIdAndDelete(req.params.groupId);

    res.json({ msg: "Group deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ➕ Create group
exports.createGroup = async (req, res) => {
  try {

     
    console.log("🔥 createGroup HIT");
    const { name, description, members = [] } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Group name required" });
    }

    // ✅ Owner auto-added
    const owner = {
      userId: req.user.uid,
      email: req.user.email,
      role: "contributor",
    };

    const group = await Group.create({
      name,
      description,
      ownerId: req.user.uid,
      members: [owner, ...members],
    });

    // console.log("GROUP CREATED:", group.name);

    res.json(group);
  } catch (err) {
    console.error("CREATE GROUP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get user groups
exports.getUserGroups = async (req, res) => {
  try {

      console.log("🔥 getUserGroups HIT");
    const groups = await Group.find({
      $or: [
        { ownerId: req.user.uid },
        { "members.userId": req.user.uid },
      ],
    }).sort({ createdAt: -1 });

    res.json(groups);
  } catch (err) {
    console.error("GET GROUPS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➕ Add member
exports.addMember = async (req, res) => {
  try {

      console.log("🔥 addMember HIT");
    const { userId, email, role = "viewer" } = req.body;

    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ msg: "Group not found" });

    // ✅ Only owner allowed
    if (group.ownerId !== req.user.uid) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // ✅ Prevent duplicate
    const exists = group.members.find((m) => m.userId === userId);

    if (exists) {
      return res.status(400).json({ msg: "User already in group" });
    }

    group.members.push({ userId, email, role });

    await group.save();

    res.json(group);
  } catch (err) {
    console.error("ADD MEMBER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getGroupById = async (req, res) => {
  try {
    console.log("🔥 getGroupById HIT");
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // ✅ check access
    const isOwner = group.ownerId === req.user.uid;
    const isMember = group.members.some(
      (m) => m.userId === req.user.uid
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching group" });
  }
};

exports.addMember = async (req, res) => {
  try {
    console.log("🔥 addMember HIT");
    const { email, role = "viewer" } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    // ✅ Only owner can add
    if (group.ownerId !== req.user.uid) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // 🔥 IMPORTANT → FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ❌ Prevent duplicate
    const exists = group.members.find(
      (m) => m.userId === user.uid
    );

    if (exists) {
      return res.status(400).json({ msg: "Already a member" });
    }

    // ✅ CORRECT DATA
    group.members.push({
      userId: user.uid,
      email: user.email,
      role,
    });

    await group.save();

    res.json(group);

  } catch (err) {
    console.error("ADD MEMBER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    console.log("🔥 removeMember HIT");
    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ msg: "Group not found" });

    // 🔒 ONLY OWNER
    if (group.ownerId !== req.user.uid) {
      return res.status(403).json({ msg: "Only owner can remove members" });
    }

    // ❌ prevent removing owner
    if (req.params.userId === group.ownerId) {
      return res.status(400).json({ msg: "Cannot remove owner" });
    }

    group.members = group.members.filter(
      (m) => m.userId !== req.params.userId
    );

    await group.save();

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateRole = async (req, res) => {
  try {
    console.log("🔥 updateRole HIT");
    const { role } = req.body;

    const group = await Group.findById(req.params.groupId);

    if (!group) return res.status(404).json({ msg: "Group not found" });

    // 🔒 ONLY OWNER
    if (group.ownerId !== req.user.uid) {
      return res.status(403).json({ msg: "Only owner can change roles" });
    }

    const member = group.members.find(
      (m) => m.userId === req.params.userId
    );

    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }

    // ❌ prevent changing owner role
    if (member.userId === group.ownerId) {
      return res.status(400).json({ msg: "Cannot change owner role" });
    }

    member.role = role;

    await group.save();

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};