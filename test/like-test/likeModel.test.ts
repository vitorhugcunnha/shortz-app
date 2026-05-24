import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("sequelize", () => ({
  DataTypes: {},
}));

vi.mock("../../configuration/database", () => ({
  default: {
    define: vi.fn(() => ({
      create: vi.fn(),
      destroy: vi.fn(),
      findOne: vi.fn(),
    })),
  },
}));

import sequelize from "../../configuration/database";

const Like = sequelize.define("Like");

describe("LikeModel", () => {
  let mockCreate: any;
  let mockDestroy: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCreate = vi.fn();
    mockDestroy = vi.fn();

    (Like as any).create = mockCreate;
    (Like as any).destroy = mockDestroy;
  });

  it("should be able to create a like", async () => {
    mockCreate.mockResolvedValue({
      id: 1,
      userId: 1,
      videoId: 1,
    });

    const result = await Like.create({
      userId: 1,
      videoId: 1,
    });

    expect(mockCreate).toHaveBeenCalledWith({
      userId: 1,
      videoId: 1,
    });

    expect(result).toEqual({
      id: 1,
      userId: 1,
      videoId: 1,
    });
  });

  it("should be able to delete a like", async () => {
    mockDestroy.mockResolvedValue(1);

    const result = await Like.destroy({
      where: {
        userId: 1,
        videoId: 1,
      },
    });

    expect(mockDestroy).toHaveBeenCalledWith({
      where: {
        userId: 1,
        videoId: 1,
      },
    });

    expect(result).toBe(1);
  });
});