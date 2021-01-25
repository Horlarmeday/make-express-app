import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import Listr from 'listr'
import {projectInstall} from 'pkg-install'

const access = promisify(fs.access);
const copy = promisify(ncp)

async function checkDirectory(options) {
    try {
        // Folder exists
      await access(path.join(process.cwd(), `/${options.name}`), fs.constants.F_OK | fs.constants.W_OK,)
      return true
    } catch (e) {
        // Folder does exists
      return false
    }
}

async function createDirectory(options) {
    const resp = await checkDirectory(options);
    if (!resp) {
        await new Promise(async (resolve, reject) => {
            fs.mkdir(path.join(process.cwd(), `/${options.name}`), err => {
                if (err) reject(new Error('Error:' + err));
                else resolve();
            })
        });
        return path.join(process.cwd(), `/${options.name}`);
    }
    return false;
}

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    })
}

async function initGit(options) {
    try {
        const result = await execa('git', ['init'], {
            cwd: options.targetDirectory
        })
        if(result.failed) {
            return Promise.reject(new Error('Failed to initialize git'))
        }
        return;
    } catch (e) {
        console.error(e)
    }
}

export async function createProject(options) {
    const pathDirectory =  await createDirectory(options)
    if(!pathDirectory) {
        console.error('%s Folder already exists', chalk.red.bold('ERROR'))
        process.exit(1)
    }

    options = {
        ...options,
        targetDirectory: pathDirectory || process.cwd(),
    }

    const fullPathName = new URL(import.meta.url).pathname
    const temporaryDir = path.resolve(
        fullPathName.substr(fullPathName.indexOf('/')),
        '../../templates',
        options.template.toLowerCase()
    )
    const templateDir = temporaryDir.substring(3)
    options.templateDirectory = templateDir

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (e) {
        console.error('%s An error occured', chalk.red.bold('ERROR'))
        process.exit(1)
    }

    const tasks = new Listr([
        {
            title: 'Creating project files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Initialize git',
            task: () => initGit(options),
            enabled: () => options.git,
        },
        {
            title: 'Install dependencies',
            task: () => projectInstall({
                cwd: options.targetDirectory
            }),
            skip: () => !options.runInstall ? 'Pass --install to automatically install dependencies' : undefined
        }
    ], 
    {
        exitOnError: false
    })

    await tasks.run();
    console.log('%s Project Ready', chalk.green.bold('DONE'))
    console.log(`cd ${options.name}`)
    console.log(`npm run dev`)
    return true
}