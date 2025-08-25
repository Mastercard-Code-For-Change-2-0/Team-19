const mongoose = require("mongoose");
const {
  Account,
  Item,
  History,
  ReceiverCurrent,
  DonorCurrent,
  AdminMatch,
} = require("../database/go.js");

const connect = async (uri) => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
};

const createAccount = async ({ email, username, password, role }) => {
  return await Account.create({ email, username, password, role });
};

const createItemForDonor = async ({
  donorUsername,
  photos = [],
  description = "",
  quantity,
  category = "",
}) => {
  const donor = await Account.findOne({
    username: donorUsername,
    role: "donor",
  }).lean();
  if (!donor) throw new Error("donor not found");
  return await Item.create({
    photos,
    description,
    quantity,
    category,
    donor: donor._id,
    donorUsername,
  });
};

const getItemsByUsername = async (username, filter = {}) => {
  return await Item.find({ donorUsername: username, ...filter }).lean();
};

const getItemsByDonorId = async (donorId, filter = {}) => {
  return await Item.find({ donor: donorId, ...filter }).lean();
};

const paginateItems = async ({ username, page = 1, limit = 20, category }) => {
  const q = { donorUsername: username };
  if (category) q.category = category;
  const [items, total] = await Promise.all([
    Item.find(q)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Item.countDocuments(q),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
};

const donorInventorySummary = async (username) => {
  const data = await Item.aggregate([
    { $match: { donorUsername: username } },
    {
      $group: {
        _id: "$category",
        totalQty: { $sum: "$quantity" },
        count: { $sum: 1 },
      },
    },
    { $project: { category: "$_id", _id: 0, totalQty: 1, count: 1 } },
  ]);
  return data;
};

const upsertHistory = async ({ username, itemIds }) => {
  return await History.findOneAndUpdate(
    { username },
    { $addToSet: { items: { $each: itemIds } } },
    { upsert: true, new: true }
  ).lean();
};

const upsertReceiverCurrent = async ({ username, itemIds }) => {
  return await ReceiverCurrent.findOneAndUpdate(
    { username },
    { $addToSet: { items: { $each: itemIds } } },
    { upsert: true, new: true }
  ).lean();
};

const upsertDonorCurrent = async ({ username, itemIds }) => {
  return await DonorCurrent.findOneAndUpdate(
    { username },
    { $addToSet: { items: { $each: itemIds } } },
    { upsert: true, new: true }
  ).lean();
};

const replaceReceiverCurrent = async ({ username, itemIds }) => {
  return await ReceiverCurrent.findOneAndUpdate(
    { username },
    { $set: { items: itemIds } },
    { upsert: true, new: true }
  ).lean();
};

const replaceDonorCurrent = async ({ username, itemIds }) => {
  return await DonorCurrent.findOneAndUpdate(
    { username },
    { $set: { items: itemIds } },
    { upsert: true, new: true }
  ).lean();
};

const createMatch = async ({
  adminUsername,
  donorUsername,
  receiverUsername,
  itemIds,
}) => {
  return await AdminMatch.create({
    adminUsername,
    donorUsername,
    receiverUsername,
    itemMatched: itemIds,
  });
};

const updateMatchStatus = async ({ matchId, status, remarks }) => {
  return await AdminMatch.findByIdAndUpdate(
    matchId,
    { $set: { status, ...(remarks ? { remarks } : {}) } },
    { new: true }
  ).lean();
};

const listMatches = async (filter = {}, { page = 1, limit = 20 } = {}) => {
  const q = { ...filter };
  const [rows, total] = await Promise.all([
    AdminMatch.find(q)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AdminMatch.countDocuments(q),
  ]);
  return { rows, total, page, pages: Math.ceil(total / limit) };
};

const getMatchDetail = async (matchId) => {
  return await AdminMatch.findById(matchId).populate("itemMatched").lean();
};

const removeItemsFromDonorCurrent = async ({ username, itemIds }) => {
  return await DonorCurrent.findOneAndUpdate(
    { username },
    { $pull: { items: { $in: itemIds } } },
    { new: true }
  ).lean();
};

const removeItemsFromReceiverCurrent = async ({ username, itemIds }) => {
  return await ReceiverCurrent.findOneAndUpdate(
    { username },
    { $pull: { items: { $in: itemIds } } },
    { new: true }
  ).lean();
};

module.exports = {
  connect,
  createAccount,
  createItemForDonor,
  getItemsByUsername,
  getItemsByDonorId,
  paginateItems,
  donorInventorySummary,
  upsertHistory,
  upsertReceiverCurrent,
  upsertDonorCurrent,
  replaceReceiverCurrent,
  replaceDonorCurrent,
  createMatch,
  updateMatchStatus,
  listMatches,
  getMatchDetail,
  removeItemsFromDonorCurrent,
  removeItemsFromReceiverCurrent,
};
