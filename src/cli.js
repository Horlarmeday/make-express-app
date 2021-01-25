import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--name': String,
            '-n': '--name',
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
        },
        {
            argv: rawArgs.slice(2)
        }
    );
    return {
        skipPrompts: args['--yes'] || false,
        name: args['--name'],
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false
    }
}

async function promptForMissingOptions(options) {
    const defaultTemplate = 'Sequelize';
    const defaultProjectName = 'express_app';
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,
            name: options.name || defaultProjectName
        }
    }

    const questions = [];
    if (!options.name) {
        questions.push({
            type: 'input',
            name: 'name',
            message: 'Pick a name for your project?',
            default: defaultProjectName,
            validate: function (input) {
                var done = this.async()
                setTimeout(function() {
                    if (/^\s*$/.test(input)) {
                        console.log(false)
                        done('Provide name with no space', false)
                        return false;
                    }
                    done(null, true)
                }, 2000)
            }
        })
    }

    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose the ORM for your project',
            choices: ['Sequelize', 'Mongoose'],
            default: defaultTemplate
        })
    }

    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository?',
            default: false
        })
    }

    if (!options.runInstall) {
        questions.push({
            type: 'confirm',
            name: 'runInstall',
            message: 'Do you want to install dependencies?',
            default: false
        })
    }


    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
        name: options.name || answers.name,
        runInstall: options.runInstall || answers.runInstall,
    };
}


export async function cli(args) {
    let options = parseArgumentsIntoOptions(args)
    options = await promptForMissingOptions(options)
    await createProject(options)
}