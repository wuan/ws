import { info, warn } from 'loglevel';
import path from 'path';
import { removeAsync, existsAsync } from 'fs-extra-promise';
import { cyan, yellow } from 'chalk';
import { project, TYPE } from '../project';
import {
  compileAsync,
  nodeUnitOptions,
  spaUnitOptions,
  browserUnitOptions
} from '../lib/webpack';
import { testAsync as karmaTestAsync } from '../lib/karma';
import { testAsync as mochaTestAsync  } from '../lib/mocha';
import { compileI18n } from '../lib/i18n-compile';

export default async function unit(options) {
  const hasUnitTests = await existsAsync(project.ws.unitEntry);
  if (!hasUnitTests) {
    warn(`${yellow('warn!')} You tried to run unit tests, but ${yellow(project.ws.unitEntry)} doesn't exist.`);
    return;
  }

  await removeAsync(project.ws.distTestsDir);

  let exitCode;
  switch (project.ws.type) {
    case TYPE.NODE:
      await compileAsync(nodeUnitOptions);
      const files = [
        path.join(nodeUnitOptions.output.path, nodeUnitOptions.output.filename)
      ];
      exitCode = await mochaTestAsync(files);
      break;
    case TYPE.SPA:
      if (project.ws.i18n) {
        await compileI18n();
      }
      await compileAsync(spaUnitOptions);
      exitCode = await karmaTestAsync(options);
      break;
    case TYPE.BROWSER:
      if (project.ws.i18n) {
        await compileI18n();
      }
      await compileAsync(browserUnitOptions);
      exitCode = await karmaTestAsync(options);
      break;
  }

  if (exitCode !== 0) {
    throw `${cyan('unit')} failed.`;
  }
};
