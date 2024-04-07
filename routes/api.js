var express = require("express");
var router = express.Router();

//Them model
const Distributors = require("../models/distributors");
const Fruits = require("../models/fruits");

//api them distributor
router.post("/add-distributor", async (req, res) => {
  try {
    const data = req.body;
    const newDistributors = new Distributors({
      name: data.name,
    });
    const result = await newDistributors.save();
    if (result) {
      res.json({
        "status": 200,
        "messenger": "Them thanh cong",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Them that bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//get-list-distributor
router.get("/get-list-distributor", async (req, res) => {
  try {
    const data = await Distributors.find().sort({ createdAt: -1 });
    if (data) {
      res.json({
        "status": 200,
        "messenger": "Thanh cong",
        "data": data,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Thất bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//delete-distributor-by-id/:id
router.delete("/delete-distributor-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Distributors.findByIdAndDelete(id);
    if (result) {
      res.json({
        "status": 200,
        "messenger": "Xoa thanh cong",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Xoa that bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
///update-distributor-by-id/:id
router.put("/update-distributor-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await Distributors.findByIdAndUpdate(id, {
      name: data.name,
    });
    if (result) {
      res.json({
        "status": 200,
        "messenger": "Sua thanh cong",
        "data": result,
      });
    } else {
      res.json({
        "stauts": 400,
        "messenger": "Sua that bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
//search distributor
router.get("/search-distributor", async (req, res) => {
  try {
    const key = req.query.key;
    const data = await Distributors.find({
      name: { $regex: key, $options: "i" },
    }).sort({
      createdAt: -1,
    });
    if (data) {
      res.json({
        "status": 200,
        "messenger": "Thanh cong",
        "data": data,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "That bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//search-fruit
router.get("/search-fruit", async (req, res) => {
  try {
    const key = req.query.key; 
    const fruits = await Fruits.find({
      name: { $regex: key, $options: "i" }, 
    })
      .populate("id_distributor")
      .sort({ createdAt: -1 }); 

    if (result) {
      res.json({
        "status": 200,
        "messenger": "Cap nhat thanh cong",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Cap nhat that bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//them fruits
router.post("/add-fruits", async (req, res) => {
  try {
    const data = req.body;
    const newFruits = new Fruits({
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      image: data.image,
      description: data.description,
      id_distributor: data.id_distributor,
    });
    const result = await newFruits.save();
    if (result) {
      res.json({
        "status": 200,
        "messenger": "Cap nhat thanh cong",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Cap nhat that bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//get danh fruit
router.get("/get-list-fruit", async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) {
    return res.sendStatus(401); 
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); 
  }
  try {
    const payload = JWT.verify(token, SECRETKEY); 
    console.log(payload);
    const data = await Fruits.find().populate("id_distributor");
    res.json({
      "status": 200,
      "message": "Danh sách fruit",
      "data": data,
    });
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError) {
      return res.sendStatus(401); // Token hết hạn
    } else {
      console.error(error);
      return res.sendStatus(403); // Lỗi xác thực
    }
  }
});

//truyen param id
router.get("/get-fruit-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Fruits.findById(id).populate("id_distributor");
    res.json({
      "status": 200,
      "messenger": "Danh sach Fruit",
      "data": data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-fruit-in-price", async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const query = { price: { $gte: minPrice, $lte: maxPrice } };

    const data = await Fruits.find(query, "name quantity price id_distributor")
      .populate("id_distributor")
      .sort({ quantity: -1 })
      .skip(0)
      .limit(2);
    res.json({
      "status": 200,
      "messenger": "Danh sách fruit",
      "data": data,
    });
  } catch (error) {
    console.log(error);
  }
});

//get danh sach Fruits(danh sach tra ve gom : name, quantity, price, id_distributor) co chu cai bat dau ten la A hoac X
router.get("/get-list-fruit-have-name-a-or-x", async (req, res) => {
  try {
    const query = {
      $or: [{ name: { $regex: "A" } }, { name: { $regex: "X" } }],
    };

    const data = await Fruits.find(
      query,
      "name quantity price id_distributor"
    ).populate("id_distributor");
    res.json({
      "status": 200,
      "messenger": "Danh sach fruit",
      "data": data,
    });
  } catch (error) {
    console.log(error);
  }
});

//api cap nhat fruit
router.put("/update-fruit-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatefruit = await Fruits.findById(id);
    let result = null;
    if (updatefruit) {
      updatefruit.name = data.name ?? updatefruit.name;
      updatefruit.quantity = data.quantity ?? updatefruit.quantity;
      updatefruit.price = data.price ?? updatefruit.price;
      updatefruit.status = data.status ?? updatefruit.status;
      updatefruit.image = data.image ?? updatefruit.image;
      updatefruit.description = data.description ?? updatefruit.description;
      updatefruit.id_distributor =
        data.id_distributor ?? updatefruit.id_distributor;
      result = await updatefruit.save();
    }
    if (result) {
      res.json({
        "status": 200,
        "messenger": "Cap nhat thanh cong",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Cap nhat that bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//xoa mot fruit
router.delete("/delete-fruit-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Fruits.findByIdAndDelete(id).populate('id_distributor');
    if (result) {
      res.json({
        "status": 200,
        "messenger": "xoa thanh cong",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "xoa that bai",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//upload file
const Upload = require("../config/common/upload");
router.post(
  "/add-fruit-with-file-image",
  Upload.array("image", 5),
  async (req, res) => {
    try {
      const data = req.body;
      const { files } = req;
      const urlsImage = files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
      const newfruit = new Fruits({
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        status: data.status,
        image: urlsImage,
        description: data.description,
        id_distributor: data.id_distributor,
      });
      const result = (await newfruit.save()).populate("id_distributor");
      if (result) {
        res.json({
          "status": 200,
          "messenger": "Them thanh cong",
          "data": result,
        });
      } else {
        res.json({
          "status": 400,
          "messenger": "Them that bai",
          "data": [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/update-fruit-with-file-image/:id", 
  Upload.array("image", 5),
  async (req, res) => {
     try {
       const { id } = req.params;
       const data = req.body;
       const { files } = req;

       let url1;
       const updatefruit = await Fruits.findById(id);
       if (files && files.length > 0) {
         url1 = files.map(
           (file) =>
             `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
         );
       }
       if (url1 == null) {
         url1 = updatefruit.image;
       }

       let result = null;
       if (updatefruit) {
         (updatefruit.name = data.name ?? updatefruit.name),
           (updatefruit.quantity = data.quantity ?? updatefruit.quantity),
           (updatefruit.price = data.price ?? updatefruit.price),
           (updatefruit.status = data.status ?? updatefruit.status),
           (updatefruit.image = url1),
           (updatefruit.description =
             data.description ?? updatefruit.description),
           (updatefruit.id_distributor =
             data.id_distributor ?? updatefruit.id_distributor),
           (result = (await updatefruit.save()).populate("id_distributor"));
       }
       if (result) {
         res.json({
           "status": 200,
           "messenger": "Cập nhật thành công",
           "data": result,
         });
       } else {
         res.json({
           "status": 400,
           "messenger": "Cập nhật không thành công",
           "data": [],
         });
       }
     } catch (error) {
       console.log(error);
     }
  }
);


/// mail
const Users = require("../models/users");
const Transporter = require("../config/common/mail");
router.post(
  "/register-send-email",
  Upload.single("avatar"),
  async (req, res) => {
    try {
      const data = req.body;
      const { file } = req;
      const newUser = Users({
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
        avatar: `${req.protocol}://${req.get("host")}/uploads/${
          file.filename
        }`,
      });
      const result = await newUser.save();
      if (result) {
        //Gửi mail
        const mailOptions = {
          from: "haindph39815@fpt.edu.vn", 
          to: result.email, 
          subject: "Đăng ký thành công", 
          text: "Cảm ơn bạn đã đăng ký", 
        };
       
        await Transporter.sendMail(mailOptions); 
        res.json({
          "status": 200,
          "messenger": "Thêm thành công",
          "data": result,
        });
      } else {
        res.json({
          "status": 400,
          "messenger": "Lỗi, thêm không thành công",
          "data": [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC";
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username, password });
    if (user) {
      const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: "1h" });
      const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
        expiresIn: "1d",
      });
      res.json({
        "status": 200,
        "messenger": "Đăng nhập thành công",
        "data": user,
        "token": token,
        "refreshToken": refreshToken,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Đăng nhập thất baị",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-page-fruit", async (req, res) => {
  try {
    // Authenticate user
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    // Verify token
    let payload;
    JWT.verify(token, SECRETKEY, (err, _payLoad) => {
      if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
      if (err) return res.sendStatus(403);
      payload = _payLoad;
    });

    // Pagination
    const perPage = 6;
    const page = req.query.page || 1;
    const skip = perPage * page - perPage;

    // Search criteria
    const name = { $regex: req.query.name || "", $options: "i" };
    const price = req.query.price ? parseInt(req.query.price) : 0;
    if (isNaN(price)) {
      return res.status(400).json({ error: "Invalid price parameter" });
    }
    const priceQuery = { $gte: price };

    // Sorting
    const sort = { price: Number(req.query.sort) || 1 };

    // Query database
    const count = await Fruits.find({
      name,
      price: priceQuery,
    }).countDocuments();
    const data = await Fruits.find({ name, price: priceQuery })
      .populate("id_distributor")
      .sort(sort)
      .skip(skip)
      .limit(perPage);

    // Send response
    res.json({
      "status": 200,
      "messenger": "Danh sách fruit",
      "data": {
        "data":data,
        "currentPage": Number(page),
        "totalPage": Math.ceil(count / perPage),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
