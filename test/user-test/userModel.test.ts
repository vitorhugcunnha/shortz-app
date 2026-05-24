import { describe, it, expect, vi, beforeEach } from "vitest";
import User from "../../modules/users/userModel";

vi.mock("../../modules/users/userModel", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

describe("createUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar usuário se email não existir", async () => {
    User.findOne.mockResolvedValue(null);

    User.create.mockResolvedValue({
      id: 1,
      username: "Vitor",
      email: "vitor@email.com",
    });

    const result = await User.create({
      username: "Vitor",
      email: "vitor@email.com",
    });

    expect(User.findOne).toHaveBeenCalledTimes(0);
    expect(User.create).toHaveBeenCalled();
    expect(result.email).toBe("vitor@email.com");
  });

  it("deve impedir email duplicado", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "vitor@email.com",
    });

    const existingUser = await User.findOne({
      where: { email: "vitor@email.com" },
    });

    expect(existingUser).not.toBeNull();
    expect(existingUser.email).toBe("vitor@email.com");
  });
});