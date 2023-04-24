import { resolve } from "path";
import {
  DsgContext,
  AmplicationPlugin,
  Events,
  Module,
  EventNames,
  CreateServerParams,
  CreateServerPackageJsonParams,
  CreateAdminUIPackageJsonParams,
  ModuleMap,
} from "@amplication/code-gen-types";
import { merge } from "lodash";

class ExamplePlugin implements AmplicationPlugin {
  register(): Events {
    return {
      [EventNames.CreateServer]: {
        after: this.afterCreateServer,
      },
      [EventNames.CreateServerPackageJson]: {
        before: this.beforeCreateServerPackageJson,
      },
      [EventNames.CreateAdminUIPackageJson]: {
        before: this.beforeCreateClientPackageJson,
      },
    };
  }

  async afterCreateServer(
    context: DsgContext,
    eventParams: CreateServerParams,
    modules: ModuleMap
  ): Promise<ModuleMap> {
    const staticPath = resolve(__dirname, "./static");
    const staticsFiles = await context.utils.importStaticModules(
      staticPath,
      context.serverDirectories.baseDirectory
    );

    await modules.merge(staticsFiles);
    return modules;
  }

  beforeCreateServerPackageJson(
    context: DsgContext,
    eventParams: CreateServerPackageJsonParams
  ): CreateServerPackageJsonParams {
    const myValues = {
      devDependencies: {
        prettier: "^2.8.0",
      },
      scripts: {
        format: "prettier --write .",
      },
    };

    eventParams.updateProperties.forEach((updateProperty) =>
      merge(updateProperty, myValues)
    );

    return eventParams;
  }

  beforeCreateClientPackageJson(
    context: DsgContext,
    eventParams: CreateAdminUIPackageJsonParams
  ): CreateAdminUIPackageJsonParams {
    const myValues = {
      devDependencies: {
        prettier: "^2.8.0",
      },
      scripts: {
        format: "prettier --write .",
      },
    };

    eventParams.updateProperties.forEach((updateProperty) =>
      merge(updateProperty, myValues)
    );

    return eventParams;
  }
}

export default ExamplePlugin;
