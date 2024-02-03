import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("reached here");
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log("Mutler", file);
    let ext = file.originalname.split(".")[1];
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadImage = multer({ storage: storage });
export default uploadImage;
