const User = require("../Models/User");
const Post = require("../Models/Post");

exports.upload = async (req, res) => {
    try {
        const data = {
            tweet: req.body.tweet,
            owner: req.user.userId,
            code :req.body.code,
            tags : req.body.tags,
            title : req.body.title,
        };
        const identity = await User.findById(req.user.userId).populate("posts");
        
        const post = (await Post.create(data));
        identity.posts.push(post._id);
        try {
            await identity.save();

        } catch (error) {
            console.error("Error updating user's posts array:", error);
        }
        res.status(201).json({
            message: 'post created successfully',
            post,
            identity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }

};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(401).json({
                message: "no post exist !"
            });
        }

        if (post.likes.includes(req.user.userId)) {
            const index = post.likes.indexOf(req.user.userId);
            post.likes.splice(index, 1);
            await post.save();
            res.status(201).json({
                message: "post unliked"
            });
        }
        post.likes.push(req.user.userId);
        await post.save();
        res.status(201).json({
            message: "post liked !"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.commentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(401).json({
                message: "no post exist !"
            });
        }
        post.answers.push({
            avatar: req.user.userId,
            comment: req.body.comment,
            CODE :req.body.CODE,
        });
        await post.save();
        res.status(200).json({
            message: "comment added Successfully !"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.allposts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
};


exports.getPostById = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching post' });
    }
};


exports.getAllPostsByUser = async (req, res) => {
    const userId = req.user.userId; // Assuming you pass the user ID in the request parameters

    try {
        const posts = await Post.find({ owner: userId }).sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found for this user' });
        }

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
};

