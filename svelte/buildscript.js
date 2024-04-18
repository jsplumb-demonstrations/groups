const fs = require("fs");
const esbuild = require("esbuild");
const sveltePlugin = require("esbuild-svelte");

//make sure the directoy exists before stuff gets put into it
if (!fs.existsSync("./dist/")) {
    fs.mkdirSync("./dist/");
}

//build the application
esbuild
    .build({
        entryPoints: ["./entry.js"],
        mainFields: ["svelte", "browser", "module", "main"],
        conditions: ["svelte", "browser"],
        outdir: "./dist",
        format: "iife",
        logLevel: "info",
        minify: false, //so the resulting code is easier to understand
        bundle: true,
        //splitting: true,
        sourcemap: "inline",
        plugins: [sveltePlugin()],
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

//use a basic html file to test with
fs.copyFile("./index.html", "./dist/index.html", (err) => {
    if (err) throw err;
});

fs.copyFile("./app.css", "./dist/app.css", (err) => {
    if (err) throw err;
});

fs.copyFile("./node_modules/@jsplumbtoolkit/browser-ui/css/jsplumbtoolkit.css", "./dist/jsplumbtoolkit.css", (err) => {
    if (err) throw err;
});

fs.copyFile("./node_modules/@jsplumbtoolkit/browser-ui/css/jsplumbtoolkit-demo-support.css", "./dist/jsplumbtoolkit-demo-support.css", (err) => {
    if (err) throw err;
});

fs.copyFile("./node_modules/@jsplumbtoolkit/browser-ui/css/jsplumbtoolkit-controls.css", "./dist/jsplumbtoolkit-controls.css", (err) => {
    if (err) throw err;
});

fs.copyFile("./dataset.json", "./dist/dataset.json", (err) => {
    if (err) throw err;
});