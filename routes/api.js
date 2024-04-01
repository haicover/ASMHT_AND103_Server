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
        'status': 200,
        'messenger': "Thanh cong",
        'data': data,
      });
    } else {
      res.json({
        'status': 400,
        'messenger': "Thất bai",
        'data': [],
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
        'status': 200,
        'messenger': "Xoa thanh cong",
        'data': result,
      });
    } else {
      res.json({
        'status': 400,
        'messenger': "Xoa that bai",
        'data': [],
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
        'status': 200,
        'messenger': "Sua thanh cong",
        'data': result,
      });
    } else {
      res.json({
        'stauts': 400,
        'messenger': "Sua that bai",
        'data': [],
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
      name: { "$regex": key, "$options": "i" },
    }).sort({
      createdAt: -1,
    });
    if (data) {
      res.json({
       'status': 200,
        'messenger': "Thanh cong",
        'data': data,
      });
    } else {
      res.json({
        'status': 400,
        'messenger': "That bai",
        'data': [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//search-fruit
router.get("/search-fruit", async (req, res) => {
  try {
    const key = req.query.key; // Lấy tham số truy vấn key từ URL
    const fruits = await Fruits.find({
      name: { "$regex": key, "$options": "i" }, // Tìm kiếm trái cây theo tên, không phân biệt hoa thường
    })
      .populate("id_distributor")
      .sort({ createdAt: -1 }); // Sử dụng populate để lấy thông tin của nhà phân phối

    if (fruits) {
      res.json({
        "status": 200,
        "messenger": "Thành công",
        "data": fruits,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "Thất bại",
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
        'status': 200,
        'messenger': "Them thanh cong",
        'data': result,
      });
    } else {
      res.json({
        'status': 400,
        'messenger': "Them that bai",
        'data': [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//get danh fruit
router.get("/get-list-fruit", async (req, res,next) => {
    const authHeader = req.headers['authorization']
    //Autorization thêm từ khóa 'Bearer token'
    //nên sẽ xử lý cắt chuỗi
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401)//Nếu không có token sẽ trả về 401
    let payload;
    JWT.verify(token,SECRETKEY,(err,_payload)=>{
      //Kiểm tra token, nếu token ko đúng,hoặc hết hạn
      if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401); //Trả status hết hạn 401 khi token hết hạn
      if (err) return res.sendStatus(403); //Trả status 403
      payload = _payload;//Nếu đúng sẽ log ra dữ liệu
    })
    console.log(payload);
    try {
      const data = await Fruits.find().populate("id_distributor");
      res.json({
        status: 200,
        messenger: "Danh sach Fruit",
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
});

//truyen param id
router.get("/get-fruit-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Fruits.findById(id).populate("id_distributor");
    res.json({
      'status': 200,
      'messenger': "Danh sach Fruit",
      'data': data,
    });
  } catch (error) {
    console.log(error);
  }
});

//get danh sách fruits (danh sach tra ve gom: name, quantity, price,id,id_distributor) nam trong khoang gia ( query gia cao nhat , gia thap nhat) va sap xep theo quantity(giam dan)
router.get("/get-list-fruit-in-price", async (req, res) => {
  try {
    const { price_start, price_end } = req.body;
    const query = { price: { $gte: price_start, $lte: price_end } };
    const data = await Fruits.find(query, "name quantity price id_distributor")
      .populate("id_distributor")
      .sort({ quantity: -1 })
      .skip(0)
      .limit(2);

    res.json({
      'status': 200,
      'messenger': "Danh sach Fruit",
      'data': data,
    });
  } catch {
    error;
  }
  {
    console.log(error);
  }
});

//get danh sach Fruits(danh sach tra ve gom : name, quantity, price, id_distributor) co chu cai bat dau ten la A hoac X
router.get("/get-list-fruit-have-name-a-or-x", async (req, res) => {
  try {
    const query = {
      $or: [{ name: { $regex: "T" } }, { name: { $regex: "X" } }],
    };

    const data = await Fruits.find(
      query,
      "name quantity price id_distributor"
    ).populate("id_distributor");
    res.json({
      'status': 200,
      'messenger': "Danh sach fruit",
      'data': data,
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
      updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor;
      result = await updatefruit.save();
    }
    if (result) {
      res.json({
        'status': 200,
        'messenger': "Cap nhat thanh cong",
        'data': result,
      });
    } else {
      res.json({
        'status': 400,
        'messenger': "Cap nhat that bai",
        'data': [],
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
    const result = await Fruits.findByIdAndDelete(id);
    if (result) {
      res.json({
        'status': 200,
        'messenger': "xoa thanh cong",
        'data': result,
      });
    } else {
      res.json({
        'status': 400,
        'messenger': "xoa that bai",
        'data': [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//upload file
const Upload = require("../config/common/upload");
router.post("/add-fruit-with-file-image",Upload.array("image", 5),async (req, res) => {
    try {
      const data = req.body;
      const { files } = req;
      const urlsImage = files.map((file) =>`${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
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
          'status': 200,
          'messenger': "Them thanh cong",
          'data': result,
        });
      } else {
        res.json({
          'status': 400,
          'messenger': "Them that bai",
          'data': [],
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
router.post("/register-send-email",Upload.single("avatar"),async (req, res) => {
    try {
      const data = req.body;
      const { file } = req
      const newUser = Users({
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
        avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      });
      const result = await newUser.save()
      if (result) {
        //Gửi mail
        const mailOptions = {
          from: "haindph39815@fpt.edu.vn", //email gửi đi
          to: result.email, // email nhận
          subject: "Đăng ký thành công", //subject
          text: "Cảm ơn bạn đã đăng ký", // nội dung mail
        };
        // Nếu thêm thành công result !null trả về dữ liệu
        await Transporter.sendMail(mailOptions); // gửi mail
        res.json({
          "status": 200,
          "messenger": "Thêm thành công",
          "data": result,
        });
      } else {
        // Nếu thêm không thành công result null, thông báo không thành công
        res.json({
          "status": 400,
          "messenger": "Lỗi, thêm không thành công",
          "data": []
        });
      }
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.username) {
        // Trùng lặp username
        res.status(400).json({
          status: 400,
          message: "Tên đăng nhập đã tồn tại",
        });
      } else if (error.code === 11000 && error.keyPattern.email) {
        // Trùng lặp email
        res.status(400).json({
          status: 400,
          message: "Email đã được sử dụng",
        });
      } else {
        // Xử lý các lỗi khác
        console.error(error);
        res.status(500).json({
          status: 500,
          message: "Đã xảy ra lỗi không xác định",
        });
      }
    }
  }
);


const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC"
router.post("/login",async(req,res)=>{
  try{
    const { username, password } = req.body;
    const user = await Users.findOne({ username, password });
    if(user){
      const token = JWT.sign({id:user._id},SECRETKEY,{expiresIn:"1h"});
      const refreshToken = JWT.sign({id:user._id},SECRETKEY,{expiresIn:"1d"});
      res.json({
        "status":200,
        "messenger":"Đăng nhập thành công",
        "data":user,
        "token":token,
        "refreshToken":refreshToken
      })
    }else{
      res.json({
        "status":400,
        "messenger":"Đăng nhập thất baị",
        "data":[]
      })
    }
  }catch(error){
    console.log(error);
  }
})

router.get("/get-page-fruit", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  let payload;
  JWT.verify(token, SECRETKEY, (err, _payload) => {
    if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
    if (err) return res.sendStatus(403);
    payload = _payload;
  });
  let perPage = 6;//Số lượng sản phẩm xuất hiện trên 1 page
  let page = req.query.page || 1;//Page truyền lên
  let skip = perPage * page - perPage;//Phân trang
  let count = await Fruits.find().count();//Lấy tổng số phần tử

  //filtering
  //Lọc theo tên
  const name = { "$regex": req.query.name ?? "", "$options": "i" };
  //Lọc giá lớn hơn hoặc bằng giá truyền vào
  const price = { $gte: req.query.price ?? 0 };
  //Lọc sắp xếp theo giá
  const sort = { price: req.query.sort ?? 1 };
  try {
    const data = await Fruits.find({ name: name, price: price })
      .populate("id_distributor")
      .sort(sort)
      .skip(skip)
      .limit(perPage);

    res.json({
      'status': 200,
      'messenger': "Danh sach fruit",
      'data': {
        'data': data,
        'currentPage': Number(page),
        'totalPage': Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.log(error);
  }
});







module.exports = router;
