import { useSearchParams } from "react-router-dom";

const PlayGame = () => {
  const [params] = useSearchParams();
  const mode = params.get("mode");
  const code = params.get("code"); // Only present in custom games
  const difficulty = params.get("diff") || "easy";

  if (!mode || !["word", "number"].includes(mode)) {
    return <p className="text-center mt-10">Invalid game link or mode.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h2 className="text-3xl font-semibold mb-4">
          {code ? "Custom Game" : "New Game"}: {mode.toUpperCase()} Mode
        </h2>
        <p className="mb-2 text-gray-700">Difficulty: {difficulty}</p>
        <p className="mb-8 text-sm text-gray-500">
          {code ? `Code: ${code}` : "Random code will be generated"}
        </p>

        <p className="text-gray-600 italic">
          🚧 Game logic will be added here next...
        </p>
      </div>
    </div>
  );
};

export default PlayGame;