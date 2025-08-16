export default {
  require: [], // no pre-require
  extension: ["cjs", "js"],
  spec: "test/**/*.js",
  loader: "cjs", // <— this tells mocha to use CommonJS loader
};
