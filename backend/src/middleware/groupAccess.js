const Group = require("../models/Group");

const checkGroupAccess = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const group = await Group.findById(req.params.groupId);

      if (!group) {
        return res.status(404).json({ msg: "Group not found" });
      }

      // ✅ Owner always allowed
      if (group.ownerId === req.user.uid) {
        req.group = group;
        return next();
      }

      const member = group.members.find(
        (m) => m.userId === req.user.uid
      );

      if (!member) {
        return res.status(403).json({ msg: "Not a group member" });
      }

      // ✅ Role check
      if (
        requiredRole === "contributor" &&
        member.role !== "contributor"
      ) {
        return res.status(403).json({ msg: "Permission denied" });
      }

      req.group = group;
      next();
    } catch (err) {
      console.error("GROUP ACCESS ERROR:", err);
      res.status(500).json({ msg: "Access check failed" });
    }
  };
};

module.exports = checkGroupAccess;