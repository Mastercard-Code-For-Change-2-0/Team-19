# Donation-Matching Platform Schemas

This README provides an overview of the **Mongoose schemas** used for a donation-matching platform. The schemas are designed to manage user accounts, track donated items, and handle the matching process between donors and receivers.

---

## Project Goal
The primary goal of this schema set is to create a robust and scalable database structure for a platform where:
- Donors can offer items  
- Receivers can request them  
- Administrators can manage and track all matches  

---

## Key Features
- **User Management**: Separate roles for donors, receivers, and administrators.  
- **Item Tracking**: Detailed records for each item, including photos, descriptions, and categories.  
- **Real-time Needs**: Dynamic schemas to track what items are currently available from donors and what items are currently needed by receivers.  
- **Match History**: A complete log of all successful and pending donation matches.  

---

## Schema Breakdown

### AccountSchema
Handles all user information.  
- `email`: Unique email address of the user.  
- `username`: Unique username.  
- `password`: Hashed password.  
- `role`: User role (`donor`, `receiver`, or `admin`).  

---

### ItemSchema
Core schema for all donated items.  
- `photos`: Array of URLs for item images.  
- `description`: Text description of the item.  
- `quantity`: Number of items available.  
- `category`: Type of item (from predefined list).  
- `donor`: Reference to the **Account** document of the donor.  
- `donorUsername`: Convenience field to query items by donor easily.  

---

### HistorySchema
Records all completed donation transactions for each user.  
- `username`: The username of the user this history belongs to.  
- `items`: Array of item references linked to past transactions.  

---

### ReceiverCurrentSchema
Tracks current needs of a receiver.  
- `username`: The receiver’s username.  
- `items`: Array of item references representing requested items.  

---

### DonorCurrentSchema
Tracks items a donor currently has available.  
- `username`: The donor’s username.  
- `items`: Array of item references representing available items.  

---

### AdminMatchSchema
Used by administrators to create and manage matches.  
- `adminUsername`: Admin who created the match.  
- `donorUsername`: Donor involved.  
- `receiverUsername`: Receiver involved.  
- `itemMatched`: Array of item references included in the match.  
- `status`: Current status (`Proposed`, `Completed`, etc.).  
- `remarks`: Additional notes or comments.  

---

## Getting Started

### Install Dependencies
```bash
npm install mongoose


Usage
const mongoose = require("mongoose");
const { Account } = require("./your-schemas-file");

const connectDB = async () => {
  try {
    await mongoose.connect("your_mongodb_connection_string", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");

    const user = await Account.findOne({ username: "john_doe" });
    console.log(user);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();
