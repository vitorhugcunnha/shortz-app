import { describe, it, expect, vi, beforeEach } from "vitest";
import Comment from "../../modules/comment/commentModel";

describe("CommentModel", () => {
  let req: any;

  beforeEach(() => {
    req = {
      body: {
        content: "Esse vídeo ficou muito bom",
        userId: 1,
        videoId: 1,
      },
    };
  });

  it("should create a new comment", async () => {
    const fakeComment = {
      id: 1,
      content: "Esse vídeo ficou muito bom",
      userId: 1,
      videoId: 1,
    };

    vi.spyOn(Comment, "create").mockResolvedValue(fakeComment as any);

    const comment = await Comment.create({
      content: req.body.content,
      userId: req.body.userId,
      videoId: req.body.videoId,
    });

    expect(comment).not.toBeFalsy();
    expect(comment.content).toBe("Esse vídeo ficou muito bom");
    expect(comment.userId).toBe(1);
    expect(comment.videoId).toBe(1);
  });

  it("should update a comment", async () => {
    vi.spyOn(Comment, "update").mockResolvedValue([1] as any);

    const updatedComment = await Comment.update(
      {
        content: "Comentário atualizado",
      },
      {
        where: {
          userId: req.body.userId,
          videoId: req.body.videoId,
        },
      }
    );

    expect(updatedComment).not.toBeFalsy();
    expect(Comment.update).toHaveBeenCalledWith(
      {
        content: "Comentário atualizado",
      },
      {
        where: {
          userId: 1,
          videoId: 1,
        },
      }
    );
  });
});