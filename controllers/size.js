const Size = require("../models/Size");

exports.getSizeById = (req, res, next, id) => {
  Size.findById(id)
    .select("name")
    .then((size) => {
      if (!size) {
        return res.status(404).json({ errormsg: "size not Found" });
      }
      req.size = size;
      next();
    })
    .catch((error) => {
      return res.status(500).json({ errormsg: "size not Found" });
    });
};

exports.Createsize = (req, res) => {
  const size = new Size(req.body);
  size.save((err, size) => {
    console.log(err, size);
    if (!size || err) {
      return res.status(404).json({ errormsg: "Cannot save size to DB" });
    }
    res.json(size);
  });
};

exports.getsize = (req, res) => {
  return res.json(req.size);
};

exports.getAllsizes = (req, res) => {
  Size.find({})
    .select("name")
    .then((size) => {
      return res.status(200).json(size);
    })
    .catch((error) => {
      return res.status(404).json({ errormsg: "sizes are not available" });
    });
};

exports.updatesize = (req, res) => {
  let size = req.size;
  console.log(req.body);
  size.name = req.body.name;
  size.save((err, updatedsize) => {
    if (err || !updatedsize) {
      return res.status(400).json({ errormsg: "Failed to update catrgory" });
    }
    res.status(200).json(updatedsize);
  });
};

exports.deletesize = (req, res) => {
  let size = req.size;
  size.remove((err, deletedsize) => {
    if (err || !deletedsize) {
      return res.status(400).json({ errormsg: "Failed to delete catrgory" });
    }
    res.status(200).json(deletedsize);
  });
};
