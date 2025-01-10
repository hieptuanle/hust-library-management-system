// import { $ } from "bun"

import type { SpawnOptions } from "bun";

const spawnOptions: SpawnOptions.OptionsObject = {
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
};

const run = async () => {
  Bun.spawn(["bun", "run", "tailwind"], spawnOptions);
  Bun.spawn(["bun", "run", "dev"], spawnOptions);

  process.on("SIGINT", async () => {
    console.log("Cleaning up...");
    // Bun.spawn(["bun", "run", "db:down"])
    // await $`bun run db:down` will also work
  });
};

run();
