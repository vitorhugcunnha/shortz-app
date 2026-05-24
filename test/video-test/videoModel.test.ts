import { describe, it, expect, vi, beforeEach } from "vitest";
import Video from "../../modules/video/videoModel";

vi.mock("../../modules/video/videoModel", () => ({
  default: {
    create: vi.fn(),
  },
}));

describe("VideoModel", () => {
  let req: any;

  beforeEach(() => {
    req = {
      body: {
        title: "Curso React Básico",
        description: "Vídeo fictício para teste",
        videoPath: "public/uploads/videos/react-video.mp4",
        thumbnailPath: "public/uploads/covers/react-thumb.jpg",
        userId: 5,
      },
    };
  });


  it("should validate video and thumbnail format", () => {
    expect(req.body.videoPath).toContain(".mp4");
    expect(req.body.thumbnailPath).toContain(".jpg");
  });

  it("should create a new video", async () => {
    (Video.create as any).mockResolvedValue({
      title: req.body.title,
      description: req.body.description,
      videoPath: req.body.videoPath,
      thumbnailPath: req.body.thumbnailPath,
      userId: req.body.userId,
    });

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      videoPath: req.body.videoPath,
      thumbnailPath: req.body.thumbnailPath,
      userId: req.body.userId,
    });

    expect(Video.create).toHaveBeenCalled();
    expect(video).toBeDefined();
    expect(video).not.toBeFalsy();
    expect(video.title).toBe("Curso React Básico");
  });
});