
import Link from "next/link";
import { FaBook, FaExclamationTriangle } from "react-icons/fa";

// Define the Material type based on the Mongoose schema
interface Material {
  _id: string;
  title: string;
  price: string;
  createdAt: string;
}

export default async function Materials() {
  // Fetch materials server-side
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  let materials: Material[] = [];
  let error: string | null = null;

  try {
    const response = await fetch(`${serverUrl}/api/get-materials`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch materials");
    }

    materials = data.materials || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Error fetching materials";
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-destructive">
        <FaExclamationTriangle className="text-5xl mb-4 animate-pulse" />
        <p className="text-xl font-semibold mb-2">Error loading materials</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 font-questrial pt-30 lg:pt-20">
      <div className="bg-card rounded-xl shadow-lg mb-8 border border-border animate-fade-in">
        <div className="bg-myred p-8 text-card-foreground rounded-t-xl">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaBook className="text-4xl glow" />
            <span className="text-shine">All Materials</span>
          </h1>
          <p className="mt-3 text-lg opacity-90">
            Browse all available learning materials
          </p>
        </div>

        <div className="p-8">
          {materials.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-xl animate-fade-in">
              <FaBook className="mx-auto text-6xl text-muted-foreground mb-4 animate-float" />
              <h3 className="text-2xl font-semibold text-card-foreground mb-3">
                No materials available
              </h3>
              <p className="text-muted-foreground">
                Check back later for new learning materials.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div
                  key={material._id}
                  className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-300 animate-fade-in"
                >
                  <div className="relative h-32 bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <FaBook className="text-4xl glow" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-myred/10 p-2 rounded-full text-myred">
                        <FaBook className="text-lg" />
                      </div>
                      <h3 className="font-semibold text-lg truncate text-card-foreground">
                        {material.title}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-myred font-medium text-sm">
                        ৳ {material.price}
                      </span>
                      <Link
                        href={`/materials/${material._id}`}
                        className="px-4 py-2 bg-myred text-primary-foreground rounded-lg hover:bg-myred-secondary transition-colors text-sm font-medium"
                        aria-label={`View ${material.title} material`}
                      >
                        View Material
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}