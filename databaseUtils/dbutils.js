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
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
  await mongoose.connect(uri);
};

//utilities
const toPlain = (doc) => (doc && typeof doc.toObject === "function" ? doc.toObject() : doc);

const ensureFound = (entity, msg = "Not found") => {
  if (!entity) {
    const err = new Error(msg);
    err.code = "NOT_FOUND";
    throw err;
  }
  return entity;
};

const sanitizePageLimit = ({ page = 1, limit = 20 } = {}) => {
  const p = Number.isFinite(+page) && +page > 0 ? Math.floor(+page) : 1;
  const l = Number.isFinite(+limit) && +limit > 0 ? Math.floor(+limit) : 20;
  return { page: p, limit: l };
};


const createAccount = async ({ email, username, password, role }) => {
  const doc = await Account.create({ email, username, password, role });
  return toPlain(doc);
};

const createItemForDonor = async ({
  donorUsername,
  photos = [],
  description = "",
  quantity,
  category = "",
} = {}) => {
  const donor = await Account.findOne({
    username: donorUsername,
    role: "donor",
  }).lean();
  if (!donor) throw new Error("donor not found");
  const doc = await Item.create({
    photos,
    description,
    quantity,
    category,
    donor: donor._id,
    donorUsername,
  });
  return toPlain(doc);
};

const getItemsByUsername = async (username, filter = {}) => {
  return await Item.find({ donorUsername: username, ...filter }).lean();
};

const getItemsByDonorId = async (donorId, filter = {}) => {
  return await Item.find({ donor: donorId, ...filter }).lean();
};

const paginateItems = async ({ username, page = 1, limit = 20, category } = {}) => {
  const { page: p, limit: l } = sanitizePageLimit({ page, limit });

  const q = {};
  if (username) q.donorUsername = username;
  if (category) q.category = category;

  const [items, total] = await Promise.all([
    Item.find(q).skip((p - 1) * l).limit(l).lean(),
    Item.countDocuments(q),
  ]);

  return { items, total, page: p, pages: Math.ceil(total / l) };
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

const upsertHistory = async ({ username, itemIds } = {}) => {
  return await History.findOneAndUpdate(
    { username },
    { $addToSet: { items: { $each: itemIds || [] } } },
    { upsert: true, new: true }
  ).lean();
};

const upsertReceiverCurrent = async ({ username, itemIds } = {}) => {
  return await ReceiverCurrent.findOneAndUpdate(
    { username },
    { $addToSet: { items: { $each: itemIds || [] } } },
    { upsert: true, new: true }
  ).lean();
};

const upsertDonorCurrent = async ({ username, itemIds } = {}) => {
  return await DonorCurrent.findOneAndUpdate(
    { username },
    { $addToSet: { items: { $each: itemIds || [] } } },
    { upsert: true, new: true }
  ).lean();
};

const replaceReceiverCurrent = async ({ username, itemIds } = {}) => {
  return await ReceiverCurrent.findOneAndUpdate(
    { username },
    { $set: { items: itemIds || [] } },
    { upsert: true, new: true }
  ).lean();
};

const replaceDonorCurrent = async ({ username, itemIds } = {}) => {
  return await DonorCurrent.findOneAndUpdate(
    { username },
    { $set: { items: itemIds || [] } },
    { upsert: true, new: true }
  ).lean();
};

const createMatch = async ({
  adminUsername,
  donorUsername,
  receiverUsername,
  itemIds,
} = {}) => {
  const doc = await AdminMatch.create({
    adminUsername,
    donorUsername,
    receiverUsername,
    itemMatched: itemIds,
  });
  return toPlain(doc);
};

const updateMatchStatus = async ({ matchId, status, remarks } = {}) => {
  const updated = await AdminMatch.findByIdAndUpdate(
    matchId,
    { $set: { status, ...(remarks ? { remarks } : {}) } },
    { new: true }
  ).lean();

  ensureFound(updated, "Match not found");
  return updated;
};

const listMatches = async (filter = {}, { page = 1, limit = 20 } = {}) => {
  const { page: p, limit: l } = sanitizePageLimit({ page, limit });
  const q = { ...filter };

  const [rows, total] = await Promise.all([
    AdminMatch.find(q).skip((p - 1) * l).limit(l).lean(),
    AdminMatch.countDocuments(q),
  ]);

  return { rows, total, page: p, pages: Math.ceil(total / l) };
};

const getMatchDetail = async (matchId) => {
  const match = await AdminMatch.findById(matchId).populate("itemMatched").lean();
  ensureFound(match, "Match not found");
  return match;
};

/**
 * Remove items from current selections
 */
const removeItemsFromDonorCurrent = async ({ username, itemIds } = {}) => {
  return await DonorCurrent.findOneAndUpdate(
    { username },
    { $pull: { items: { $in: itemIds || [] } } },
    { new: true }
  ).lean();
};

const removeItemsFromReceiverCurrent = async ({ username, itemIds } = {}) => {
  return await ReceiverCurrent.findOneAndUpdate(
    { username },
    { $pull: { items: { $in: itemIds || [] } } },
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