import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { StooqProvider } from "../../src/infrastructure/data/stooq-provider.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadFixture() {
  return readFile(join(__dirname, "../fixtures/aapl.csv"), "utf-8");
}

describe("StooqProvider", () => {
  it("parses CSV into time series", async () => {
    const provider = new StooqProvider();
    const csv = await loadFixture();

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      ({
        ok: true,
        text: async () => csv
      }) as Response;

    const series = await provider.getDailySeries("aapl");

    expect(series).toHaveLength(5);
    expect(series[0].date).toBe("2024-01-02");

    globalThis.fetch = originalFetch;
  });
});
