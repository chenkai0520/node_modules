#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const downLoad = require('../utils/download')

if(!process.argv || process.argv.length <= 2){
    console.log(chalk.yellow(`\nOptions: \n   -h, --help for a list of available commands.`));
    process.exit(1);
}

// const gitPath = 'direct:http://127.0.0.1:8080/utils.zip';
const gitPath = 'chenkai0520/cli_koa';
program
    .version(require('../package').version)

program
    .command('init')
    .description('初始化一个koa项目')
    .arguments('<project_name> [env]')
    .action(async (args) => {
        downLoad(gitPath, `./${args}`);
    });


program.on('option:verbose', function () {
    process.env.VERBOSE = this.verbose;
});


// 未知命令会报错
program.on('command:*', function () {
    console.log(chalk.red(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`));
    process.exit(1);
});
program.parse(process.argv);