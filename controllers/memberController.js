import Member from '../model/Member_model.js';
import User from '../model/User_model.js';
import { registerMail } from './mailer.js';

/** Get all members for the current user */
export async function getMembers(req, res) {
  try {
    const { userId } = req.query;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const members = await Member.find({ owner: userId })
      .populate('member', 'email username firstName lastName')
      .sort('-addedAt');

    const membersData = members.map(m => ({
      _id: m.member._id,
      email: m.member.email,
      username: m.member.username,
      firstName: m.member.firstName,
      lastName: m.member.lastName,
      permissions: m.permissions,
      addedAt: m.addedAt
    }));

    return res.status(200).json({ members: membersData });
  } catch (error) {
    console.error("Error retrieving members:", error);
    return res.status(500).json({ error: error.message });
  }
}

/** Add a new member */
export async function addMember(req, res) {
  try {
    const { userId, email } = req.body;
    if (!email || !userId) {
      return res.status(400).json({ error: "Email and userId are required" });
    }

    // Check if owner exists
    const owner = await User.findById(userId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Find the user to be added as a member
    const memberUser = await User.findOne({ email });
    if (!memberUser) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    // Check if user is trying to add themselves
    if (memberUser._id.toString() === userId) {
      return res.status(400).json({ error: "You cannot add yourself as a member" });
    }

    // Check if member already exists
    const existingMember = await Member.findOne({
      owner: userId,
      member: memberUser._id
    });

    if (existingMember) {
      return res.status(400).json({ error: "User is already a member" });
    }

    // Create new member
    const member = new Member({
      owner: userId,
      member: memberUser._id,
      permissions: ['view'] // Default permission
    });

    await member.save();    // Send email notification to the added member
    await registerMail({
      body: {
        username: memberUser.username,
        userEmail: memberUser.email,
        subject: 'Added as a Member',
        text: `You have been added as a member with access to GPS modules. You can now view these modules in your dashboard.`
      }
    });

    const memberData = {
      _id: memberUser._id,
      email: memberUser.email,
      username: memberUser.username,
      firstName: memberUser.firstName,
      lastName: memberUser.lastName,
      permissions: member.permissions,
      addedAt: member.addedAt
    };

    return res.status(201).json({ 
      message: "Member added successfully",
      member: memberData
    });
  } catch (error) {
    console.error("Error adding member:", error);
    return res.status(500).json({ error: "Error adding member" });
  }
}

/** Remove a member */
export async function removeMember(req, res) {
  try {
    const { memberId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Check if owner exists
    const owner = await User.findById(userId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Find the member to get their email for notification
    const membershipRecord = await Member.findOne({
      owner: userId,
      member: memberId
    }).populate('member', 'email firstName lastName');

    if (!membershipRecord) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Remove the member
    await Member.deleteOne({
      owner: userId,
      member: memberId
    });    // Send email notification to the removed member
    await registerMail({
      body: {
        username: membershipRecord.member.username,
        userEmail: membershipRecord.member.email,
        subject: 'Removed from Members List',
        text: `Your access to GPS modules has been removed. You will no longer have access to these modules.`
      }
    });

    return res.status(200).json({ 
      message: "Member removed successfully",
      memberId
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return res.status(500).json({ error: "Error removing member" });
  }
}

/** Update member permissions */
export async function updateMemberPermissions(req, res) {
  try {
    const { memberId } = req.params;
    const { userId, permissions } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ error: "Valid permissions array is required" });
    }

    // Check if owner exists
    const owner = await User.findById(userId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const validPermissions = ['view', 'edit', 'delete'];
    if (!permissions.every(p => validPermissions.includes(p))) {
      return res.status(400).json({ error: "Invalid permissions provided" });
    }

    const member = await Member.findOneAndUpdate(
      { owner: userId, member: memberId },
      { permissions },
      { new: true }
    ).populate('member', 'email username firstName lastName');

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const memberData = {
      _id: member.member._id,
      email: member.member.email,
      username: member.member.username,
      firstName: member.member.firstName,
      lastName: member.member.lastName,
      permissions: member.permissions,
      addedAt: member.addedAt
    };

    return res.status(200).json({
      message: "Member permissions updated successfully",
      member: memberData
    });
  } catch (error) {
    console.error("Error updating member permissions:", error);
    return res.status(500).json({ error: "Error updating member permissions" });
  }
}
