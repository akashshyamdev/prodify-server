import multer from "multer";
import path from "path";

const upload = multer({
	storage: multer.diskStorage({
		destination: `${path.resolve(__dirname, "../../uploads")}`,
		filename: (req, res, cb) => {
			cb(null, `dummy.mp4`);
		},
	}),
});

export default upload;
