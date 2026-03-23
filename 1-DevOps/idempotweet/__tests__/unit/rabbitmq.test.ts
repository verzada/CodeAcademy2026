import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendToQueue = vi.fn();
const mockAssertQueue = vi.fn();
const mockCreateChannel = vi.fn();
const mockConnect = vi.fn();
const mockChannelClose = vi.fn();
const mockConnectionClose = vi.fn();

vi.mock("amqplib", () => ({
  default: {
    connect: mockConnect,
  },
}));

describe("rabbitmq", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    mockConnect.mockResolvedValue({
      createChannel: mockCreateChannel,
      close: mockConnectionClose,
    });
    mockCreateChannel.mockResolvedValue({
      assertQueue: mockAssertQueue,
      sendToQueue: mockSendToQueue,
      close: mockChannelClose,
    });
    mockAssertQueue.mockResolvedValue({});
  });

  describe("getChannel", () => {
    it("creates a connection and channel on first call", async () => {
      const { getChannel } = await import("@/lib/rabbitmq");
      const channel = await getChannel();
      expect(mockConnect).toHaveBeenCalled();
      expect(mockCreateChannel).toHaveBeenCalled();
      expect(mockAssertQueue).toHaveBeenCalledWith("idem-events", { durable: true });
      expect(channel).toBeDefined();
    });

    it("reuses channel on subsequent calls", async () => {
      const { getChannel } = await import("@/lib/rabbitmq");
      await getChannel();
      await getChannel();
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });
  });

  describe("publishIdemCreated", () => {
    it("publishes event to queue", async () => {
      const { publishIdemCreated } = await import("@/lib/rabbitmq");
      const event = {
        type: "idem.created" as const,
        timestamp: "2025-01-01T00:00:00Z",
        data: {
          id: "idem-001",
          author: "Alice",
          content: "Hello",
          createdAt: "2025-01-01T00:00:00Z",
          isSeeded: false,
        },
      };

      await publishIdemCreated(event);

      expect(mockSendToQueue).toHaveBeenCalledWith(
        "idem-events",
        expect.any(Buffer),
        { persistent: true, contentType: "application/json" }
      );
    });

    it("serializes event data as JSON", async () => {
      const { publishIdemCreated } = await import("@/lib/rabbitmq");
      const event = {
        type: "idem.created" as const,
        timestamp: "2025-01-01T00:00:00Z",
        data: {
          id: "idem-002",
          author: "Bob",
          content: "World",
          createdAt: "2025-01-01T00:00:00Z",
          isSeeded: false,
        },
      };

      await publishIdemCreated(event);

      const sentBuffer = mockSendToQueue.mock.calls[0][1];
      const parsed = JSON.parse(sentBuffer.toString());
      expect(parsed.data.author).toBe("Bob");
    });
  });

  describe("closeConnection", () => {
    it("closes channel and connection", async () => {
      const { getChannel, closeConnection } = await import("@/lib/rabbitmq");
      await getChannel();
      await closeConnection();
      expect(mockChannelClose).toHaveBeenCalled();
      expect(mockConnectionClose).toHaveBeenCalled();
    });

    it("handles closing when no connection exists", async () => {
      const { closeConnection } = await import("@/lib/rabbitmq");
      await closeConnection(); // Should not throw
    });
  });
});
