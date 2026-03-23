import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock pg before importing db module
const mockQuery = vi.fn();
const mockEnd = vi.fn();

vi.mock("pg", () => {
  const PoolClass = vi.fn(function () {
    return { query: mockQuery, end: mockEnd };
  });
  return { Pool: PoolClass };
});

describe("db", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("query", () => {
    it("executes a SQL query via pool", async () => {
      const { query } = await import("@/lib/db");
      mockQuery.mockResolvedValueOnce({ rows: [{ id: "1" }], rowCount: 1 });
      const result = await query("SELECT * FROM idems WHERE id = $1", ["1"]);
      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM idems WHERE id = $1", ["1"]);
      expect(result.rows).toEqual([{ id: "1" }]);
    });
  });

  describe("initializeDatabase", () => {
    it("creates table, adds column, and creates index", async () => {
      const { initializeDatabase } = await import("@/lib/db");
      mockQuery.mockResolvedValue({});
      await initializeDatabase();
      expect(mockQuery).toHaveBeenCalledTimes(3);
    });

    it("throws when database initialization fails", async () => {
      const { initializeDatabase } = await import("@/lib/db");
      mockQuery.mockRejectedValueOnce(new Error("Connection refused"));
      await expect(initializeDatabase()).rejects.toThrow("Connection refused");
    });
  });

  describe("getIdems", () => {
    it("returns paginated idems including seeded", async () => {
      const { getIdems } = await import("@/lib/db");
      const mockRows = [
        { id: "1", author: "Alice", content: "Hello", created_at: new Date("2025-01-01T00:00:00Z"), is_seeded: false },
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });
      const idems = await getIdems(1, 20, true);
      expect(idems).toEqual([
        { id: "1", author: "Alice", content: "Hello", createdAt: "2025-01-01T00:00:00.000Z", isSeeded: false },
      ]);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY created_at DESC LIMIT $1 OFFSET $2"),
        [20, 0]
      );
    });

    it("filters out seeded idems when includeSeeded is false", async () => {
      const { getIdems } = await import("@/lib/db");
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await getIdems(2, 10, false);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE is_seeded = false"),
        [10, 10]
      );
    });
  });

  describe("getTotalCount", () => {
    it("returns total count including seeded", async () => {
      const { getTotalCount } = await import("@/lib/db");
      mockQuery.mockResolvedValueOnce({ rows: [{ count: "42" }] });
      const count = await getTotalCount(true);
      expect(count).toBe(42);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.not.stringContaining("WHERE"),
        undefined
      );
    });

    it("returns count excluding seeded", async () => {
      const { getTotalCount } = await import("@/lib/db");
      mockQuery.mockResolvedValueOnce({ rows: [{ count: "10" }] });
      const count = await getTotalCount(false);
      expect(count).toBe(10);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE is_seeded = false"),
        undefined
      );
    });
  });

  describe("createIdem", () => {
    it("inserts a new idem", async () => {
      const { createIdem } = await import("@/lib/db");
      mockQuery.mockResolvedValueOnce({});
      await createIdem({
        id: "idem-001",
        author: "Alice",
        content: "Hello world",
        createdAt: "2025-01-01T00:00:00Z",
      });
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO idems"),
        ["idem-001", "Alice", "Hello world", "2025-01-01T00:00:00Z"]
      );
    });
  });

  describe("closePool", () => {
    it("closes the connection pool", async () => {
      const { closePool } = await import("@/lib/db");
      mockEnd.mockResolvedValueOnce(undefined);
      await closePool();
      expect(mockEnd).toHaveBeenCalled();
    });
  });
});
