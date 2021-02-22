// 下载git包
const downLoad = require('download-git-repo')
// shell动画
const ora = require('ora')


let clone = false;
let downGit = (url, name) => {
    if (!url || !name) {
        console.log(`缺少参数~~~url:${url},name:${name}`);
        process.exit(1);
        return;
    }
    const spinner = ora(`正在拉取git模板:${url}...`)
    spinner.start();
    downLoad(url, name, {
        clone
    }, err => {
        spinner.stop()
        console.log(err ? err : `拉取git模板:${url}完成`);
        process.exit(1)
    })
}

module.exports = downGit