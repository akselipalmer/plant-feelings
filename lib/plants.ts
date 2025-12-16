import { promises as fs } from "fs";
import path from "path";

export interface Plant {
  id: number;
  name: string;
  feeling: string;
}

const plantsFilePath = path.join(process.cwd(), "data", "plants.json");

export async function readPlants(): Promise<Plant[]> {
  try {
    const fileContents = await fs.readFile(plantsFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading plants file:", error);
    return [];
  }
}

export async function writePlants(plants: Plant[]): Promise<void> {
  try {
    await fs.writeFile(plantsFilePath, JSON.stringify(plants, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing plants file:", error);
    throw error;
  }
}

export async function addPlant(name: string, feeling: string): Promise<Plant> {
  const plants = await readPlants();
  const newId = plants.length > 0 ? Math.max(...plants.map((p) => p.id)) + 1 : 1;

  const newPlant: Plant = {
    id: newId,
    name,
    feeling,
  };

  plants.push(newPlant);
  await writePlants(plants);

  return newPlant;
}
