import { readPlants, writePlants, addPlant, type Plant } from "@/lib/plants";
import { promises as fs } from "fs";
import path from "path";

// Mock the fs module
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe("lib/plants", () => {
  const mockPlants: Plant[] = [
    { id: 1, name: "Monstera", feeling: "Happy" },
    { id: 2, name: "Snake Plant", feeling: "Calm" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("readPlants", () => {
    it("should read and parse plants from JSON file", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPlants));

      const result = await readPlants();

      expect(result).toEqual(mockPlants);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        path.join(process.cwd(), "data", "plants.json"),
        "utf8"
      );
    });

    it("should return empty array when file does not exist", async () => {
      const error = new Error("ENOENT: no such file or directory");
      mockFs.readFile.mockRejectedValue(error);

      const result = await readPlants();

      expect(result).toEqual([]);
    });

    it("should return empty array when JSON is invalid", async () => {
      mockFs.readFile.mockResolvedValue("invalid json");

      const result = await readPlants();

      expect(result).toEqual([]);
    });

    it("should handle empty file", async () => {
      mockFs.readFile.mockResolvedValue("");

      const result = await readPlants();

      expect(result).toEqual([]);
    });
  });

  describe("writePlants", () => {
    it("should write plants to JSON file with proper formatting", async () => {
      mockFs.writeFile.mockResolvedValue(undefined);

      await writePlants(mockPlants);

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        path.join(process.cwd(), "data", "plants.json"),
        JSON.stringify(mockPlants, null, 2),
        "utf8"
      );
    });

    it("should write empty array to file", async () => {
      mockFs.writeFile.mockResolvedValue(undefined);

      await writePlants([]);

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        path.join(process.cwd(), "data", "plants.json"),
        JSON.stringify([], null, 2),
        "utf8"
      );
    });

    it("should throw error when write fails", async () => {
      const error = new Error("Write failed");
      mockFs.writeFile.mockRejectedValue(error);

      await expect(writePlants(mockPlants)).rejects.toThrow("Write failed");
    });
  });

  describe("addPlant", () => {
    it("should add a new plant with incremented id", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockPlants));
      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await addPlant("Pothos", "Energetic");

      expect(result).toEqual({
        id: 3,
        name: "Pothos",
        feeling: "Energetic",
      });

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        path.join(process.cwd(), "data", "plants.json"),
        JSON.stringify([...mockPlants, result], null, 2),
        "utf8"
      );
    });

    it("should add first plant with id 1 when list is empty", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify([]));
      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await addPlant("First Plant", "Happy");

      expect(result).toEqual({
        id: 1,
        name: "First Plant",
        feeling: "Happy",
      });
    });

    it("should handle non-sequential ids correctly", async () => {
      const plantsWithGaps: Plant[] = [
        { id: 1, name: "Plant 1", feeling: "Happy" },
        { id: 5, name: "Plant 5", feeling: "Calm" },
        { id: 3, name: "Plant 3", feeling: "Sad" },
      ];

      mockFs.readFile.mockResolvedValue(JSON.stringify(plantsWithGaps));
      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await addPlant("New Plant", "Excited");

      expect(result.id).toBe(6); // Max id (5) + 1
    });

    it("should trim whitespace from name and feeling", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify([]));
      mockFs.writeFile.mockResolvedValue(undefined);

      const result = await addPlant("  Aloe Vera  ", "  Relaxed  ");

      expect(result.name).toBe("  Aloe Vera  ");
      expect(result.feeling).toBe("  Relaxed  ");
    });
  });
});
