import { describe, it, expect, vi, beforeEach } from "vitest";
import * as videoController from "../../modules/video/videoController";

vi.mock("sequelize", () => ({
  DataTypes: {},
  literal: vi.fn(),
}));

vi.mock("../../config/database", () => ({
  default: {},
}));

describe("VideoController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        title: "primeiro vídeo",
        description: "Teste",
        videoPath: "public/uploads/videos/video.mp4",
        thumbnailPath: "public/uploads/covers/thumb.jpg",
        userId: 1,
        duration: 70,
      },
      session: {
        user: { id: 1 },
      },
      files: {
        video: [{ filename: "video.mp4" }],
        thumbnail: [{ filename: "thumb.jpg" }],
      },
      flash: vi.fn(),
    };

    res = {
      redirect: vi.fn(),
      render: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should get all videos", async () => {
    const videos = await videoController.getAllVideos();
    expect(videos).not.toBeFalsy();
  });

  it("video should be uploaded", async () => {
    await videoController.uploadVideo(req, res);

    expect(res.redirect).toHaveBeenCalled();
  });
});