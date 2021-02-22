# node_modules
node_modules


# 发现npm在全局变为淘宝的镜像源后，登录和发布
```
<!-- 登陆 -->
npm login --registry http://registry.npmjs.org

<!-- 推送 -->
npm publish --registry http://registry.npmjs.org --access=public

<!-- unpublish -->
npm unpublish pkgname --force
```