import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude self
        { $id: { $nin: currentUser.friends } }, // Exclude existing friends
        { _id: { $nin: currentUser.friendRequestsSent } }, // Exclude users I've sent requests to
        { _id: { $nin: currentUser.friendRequestsReceived } }, // Exclude users who have sent me requests
        { isOnboarded: true }, // Only include onboarded users
      ],
    });
    res.status(200).json({ success: true, recommendedUsers });
  } catch (error) {
    console.error("Error in getRecommendedUsers:", error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage",
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends:", error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    // prevent sending request to self
    if (myId.toString() === recipientId) {
      return res.status(400).json({
        success: false,
        message: "Cannot send friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // check if already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    // check if request already sent
    const existingRequest = await User.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists between you and this user",
      });
    }

    // create friend request
    const friendRequest = await FriendRequest({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest:", error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // verify that the current user is the recipient of the friend request
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each other to friends list
    // use $addToSet to avoid duplicates in case of multiple accept attempts
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage",
    );

    const acceptReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic ");

    res.status(200).json({ incomingReqs, acceptReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {

    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}
