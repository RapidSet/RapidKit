import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

let canView = true;
let canEdit = true;

const resolveAccess = vi.fn((_: string, mode: "view" | "edit") =>
  mode === "view" ? canView : canEdit,
);

describe("Input", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canEdit = true;
    resolveAccess.mockClear();
  });

  it("renders label, required marker, and value", () => {
    render(
      <Input
        name="fullName"
        label="Full Name"
        required
        value="John Doe"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Full Name")).toBeTruthy();
    expect(screen.getByText("*")).toBeTruthy();
    expect(
      (screen.getByRole("textbox", { name: /full name/i }) as HTMLInputElement)
        .value,
    ).toBe("John Doe");
  });

  it("calls onChange when user types", () => {
    const onChange = vi.fn();

    render(<Input name="email" value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "a@example.com" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].type).toBe("change");
  });

  it("renders helper text when provided and no error", () => {
    render(
      <Input
        name="phone"
        value=""
        helperText="Include country code"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Include country code")).toBeTruthy();
  });

  it("renders helper text and error text together when both are provided", () => {
    render(
      <Input
        name="username"
        value=""
        helperText="Use your company handle"
        error="Username is required"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Use your company handle")).toBeTruthy();
    expect(screen.getByText("Username is required")).toBeTruthy();
  });

  it("renders error text and error class", () => {
    render(
      <Input
        name="employeeId"
        value=""
        error="Employee ID is required"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Employee ID is required")).toBeTruthy();
    expect(screen.getByRole("textbox").className).toContain(
      "border-destructive",
    );
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("renders normally when access requirements are omitted", () => {
    render(<Input name="nickname" value="mez" onChange={vi.fn()} />);

    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(
      false,
    );
    expect((screen.getByDisplayValue("mez") as HTMLInputElement).value).toBe(
      "mez",
    );
  });

  it("renders normally when access requirements are empty", () => {
    canView = false;
    canEdit = false;

    render(
      <Input
        name="alias"
        value="mez"
        accessRequirements={[]}
        resolveAccess={resolveAccess}
        onChange={vi.fn()}
      />,
    );

    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(
      false,
    );
    expect(resolveAccess).not.toHaveBeenCalled();
  });

  it("does not render when user has no view permission", () => {
    canView = false;

    const { container } = render(
      <Input
        name="secureField"
        value="secret"
        accessRequirements={["resource:view"]}
        resolveAccess={resolveAccess}
        onChange={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(resolveAccess).toHaveBeenCalledWith("resource:view", "view");
    expect(resolveAccess).not.toHaveBeenCalledWith("resource:view", "edit");
  });

  it("renders read-only (disabled) when user can view but cannot edit", () => {
    canView = true;
    canEdit = false;

    render(
      <Input
        name="readonlyField"
        value="locked"
        accessRequirements={["resource:update"]}
        resolveAccess={resolveAccess}
        onChange={vi.fn()}
      />,
    );

    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(
      true,
    );
    expect(resolveAccess).toHaveBeenCalledWith("resource:update", "view");
    expect(resolveAccess).toHaveBeenCalledWith("resource:update", "edit");
  });

  it("keeps the input disabled when disabled is passed explicitly", () => {
    canView = true;
    canEdit = true;

    render(
      <Input name="disabledField" value="locked" disabled onChange={vi.fn()} />,
    );

    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it("stops keydown propagation on the input element", () => {
    const onKeyDown = vi.fn();
    document.body.addEventListener("keydown", onKeyDown);

    render(<Input name="search" value="" onChange={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

    expect(onKeyDown).not.toHaveBeenCalled();
    document.body.removeEventListener("keydown", onKeyDown);
  });
});
