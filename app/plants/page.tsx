import Link from "next/link";
import { readPlants } from "@/lib/plants";
import AddPlantForm from "@/components/AddPlantForm";
import { addPlantAction } from "./actions";

export default async function PlantsPage() {
  const plants = await readPlants();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Plants</h1>

      <AddPlantForm serverAction={addPlantAction} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{plant.name}</h2>
            <p className="text-gray-400">
              Feeling: <span className="text-green-400">{plant.feeling}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-400 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
