import { bundleRequire, defineAction } from "@/lib";
import { fs, path } from "@brandingbrand/code-cli-kit";

export default defineAction(async () => {
  if (
    !(await fs.doesPathExist(path.project.resolve("flaghsip-code.config.ts")))
  ) {
    throw Error(
      "[ConfigActionError]: cannot find flagship-code.config.ts, be sure this exists in the root of your project"
    );
  }

  const flagshipCodeConfig = await bundleRequire(
    path.project.resolve("flagship-code.config.ts")
  );
}, "config");
