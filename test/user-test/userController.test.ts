import { describe, it, expect, vi, beforeEach } from "vitest";
import * as userController from "../../modules/users/userController";

describe("UserController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        username: "TesteUser Supremo",
        password: "67676",
        confirmPassword: "67676",
        email: "testesupremo@gmail.com",
        fullName: "Usuaro Supremo",
      },
      session: {},
      flash: vi.fn(),
    };

    res = {
      redirect: vi.fn(),
      render: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it("should register a new user", async () => {
    await userController.register(req, res);

    expect(req.flash).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalled();
  });

  it("should login user", async () => {
    await userController.login(req, res);

    expect(res.redirect).toHaveBeenCalled();
  });
});