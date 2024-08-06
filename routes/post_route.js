const ecpress = require("express");
const { upload, likePost, commentPost, allposts, getPostById, getAllPostsByUser } = require("../controllers/Post_controller");
const { follow } = require("../controllers/User_controller");
const router = ecpress.Router();
router.route("/upload").post(upload);
router.route("/like/:id").get(likePost);
router.route("/comment/:id").post(commentPost);
router.route("/allposts").get(allposts);
router.route("/:id").get(getPostById);
router.route("/user/all").get(getAllPostsByUser);
router.route("/follow/:iden").post(follow);
module.exports = router;

