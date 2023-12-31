import httpStatus from "http-status";
import Post from "../models/Post";
import User from "../models/Account/User";
import { Router, Response } from "express";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

const postRoute = Router();

//投稿
postRoute.post(
  "/",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(httpStatus.OK).json(savedPost);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

postRoute.put(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (req.body.userId !== post!.userId) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      await post!.updateOne({
        $set: req.body,
      });
      return res.status(httpStatus.OK).json("投稿が更新されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

postRoute.delete(
  "/:id",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (req.body.userId != post!.userId) {
        return res.status(httpStatus.UNAUTHORIZED).send("権限がありません。");
      }
      await post!.deleteOne();
      return res.status(httpStatus.OK).json("投稿が削除されました");
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

//特定の投稿の取得
postRoute.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      model: "User",
    });
    return res.status(httpStatus.OK).json(post);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

//いいね
postRoute.put(
  "/:id/like",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post!.likes.includes(req.body.userId)) {
        await post!.updateOne({
          $push: {
            likes: req.body.userId,
          },
        });
        return res.status(httpStatus.OK).json("投稿にいいねしました");
      } else {
        await post!.updateOne({
          $pull: {
            likes: req.body.userId,
          },
        });
        return res.status(httpStatus.OK).json("投稿のいいねを取り消しました");
      }
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
  },
);

//タイムラインの投稿を取得する。自分の投稿とフォローしている人の投稿を取得する
postRoute.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId)
      .populate([
        {
          path: "followings",
          model: "User",
        },
      ])
      .populate([
        {
          path: "followers",
          model: "User",
        },
      ])
      .populate({
        path: "classId",
        model: "Class",
      });

    if (!currentUser) {
      return res.status(httpStatus.FORBIDDEN).json("ユーザーが存在しません");
    }

    const userPosts = await Post.find({ userId: currentUser!._id }).populate({
      path: "userId",
      model: "User",
    });
    //自分がフォローしている人の投稿を取得する
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      }),
    );
    return res.status(httpStatus.OK).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default postRoute;
