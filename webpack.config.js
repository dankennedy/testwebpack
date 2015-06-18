var webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: [
        'webpack/hot/only-dev-server',
        // The script refreshing the browser on none hot updates
        'webpack-dev-server/client?http://localhost:8080',
        "./lib/client/app.js"
    ],
    output: {
        devtool: '#eval-source-map',
        path: __dirname + '/public/build',
        filename: "bundle.js",
        publicPath: '/build/'
    },
    resolve: {
        "extensions": [
            "",
            ".js",
            "jsx"
        ]
    },
    module: {
        preLoaders: [{
            test: /\.jsx?/,
            exclude: __dirname + '/node_modules',
            loader: 'jsxhint?harmony'
        }],
        loaders: [{
            test: /\.js?$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/
        }, {
            test: /\.(css|scss)$/,
            loader: "style!css!sass?outputStyle=expanded&includePaths[]=" + (path.resolve(__dirname, "./css")),
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader?limit=8192'
        }],
        postLoaders: []
    },
    jshint: {
        "emitErrors": false,
        "failOnHint": false,

        // JSHint Default Configuration File (as on JSHint website)
        // See http://jshint.com/docs/ for more details

        "maxerr": 50, // {int} Maximum error before stopping

        // Enforcing
        "bitwise": true, // true: Prohibit bitwise operators (&, |, ^, etc.)
        "camelcase": false, // true: Identifiers must be in camelCase
        "curly": true, // true: Require {} for every new block or scope
        "eqeqeq": true, // true: Require triple equals (===) for comparison
        "forin": true, // true: Require filtering for..in loops with obj.hasOwnProperty()
        "freeze": true, // true: prohibits overwriting prototypes of native objects such as Array, Date etc.
        "immed": false, // true: Require immediate invocations to be wrapped in parens e.g. `(function () { } ());`
        "indent": 4, // {int} Number of spaces to use for indentation
        "latedef": false, // true: Require variables/functions to be defined before being used
        "newcap": false, // true: Require capitalization of all constructor functions e.g. `new F()`
        "noarg": true, // true: Prohibit use of `arguments.caller` and `arguments.callee`
        "noempty": true, // true: Prohibit use of empty blocks
        "nonbsp": true, // true: Prohibit "non-breaking whitespace" characters.
        "nonew": false, // true: Prohibit use of constructors for side-effects (without assignment)
        "plusplus": false, // true: Prohibit use of `++` & `--`
        "quotmark": false, // Quotation mark consistency:
        //   false    : do nothing (default)
        //   true     : ensure whatever is used is consistent
        //   "single" : require single quotes
        //   "double" : require double quotes
        "undef": true, // true: Require all non-global variables to be declared (prevents global leaks)
        "unused": true, // Unused variables:
        //   true     : all variables, last function parameter
        //   "vars"   : all variables only
        //   "strict" : all variables, all function parameters
        "strict": true, // true: Requires all functions run in ES5 Strict Mode
        "maxparams": false, // {int} Max number of formal params allowed per function
        "maxdepth": false, // {int} Max depth of nested blocks (within functions)
        "maxstatements": false, // {int} Max number statements per function
        "maxcomplexity": false, // {int} Max cyclomatic complexity per function
        "maxlen": false, // {int} Max number of characters per line

        // Relaxing
        "asi": false, // true: Tolerate Automatic Semicolon Insertion (no semicolons)
        "boss": false, // true: Tolerate assignments where comparisons would be expected
        "debug": false, // true: Allow debugger statements e.g. browser breakpoints.
        "eqnull": false, // true: Tolerate use of `== null`
        "es5": false, // true: Allow ES5 syntax (ex: getters and setters)
        "esnext": true, // true: Allow ES.next (ES6) syntax (ex: `const`)
        "moz": false, // true: Allow Mozilla specific syntax (extends and overrides esnext features)
        // (ex: `for each`, multiple try/catch, function expression…)
        "evil": false, // true: Tolerate use of `eval` and `new Function()`
        "expr": false, // true: Tolerate `ExpressionStatement` as Programs
        "funcscope": false, // true: Tolerate defining variables inside control statements
        "globalstrict": true, // true: Allow global "use strict" (also enables 'strict')
        "iterator": false, // true: Tolerate using the `__iterator__` property
        "lastsemic": false, // true: Tolerate omitting a semicolon for the last statement of a 1-line block
        "laxbreak": false, // true: Tolerate possibly unsafe line breakings
        "laxcomma": false, // true: Tolerate comma-first style coding
        "loopfunc": false, // true: Tolerate functions being defined in loops
        "multistr": false, // true: Tolerate multi-line strings
        "noyield": false, // true: Tolerate generator functions with no yield statement in them.
        "notypeof": false, // true: Tolerate invalid typeof operator values
        "proto": false, // true: Tolerate using the `__proto__` property
        "scripturl": false, // true: Tolerate script-targeted URLs
        "shadow": false, // true: Allows re-define variables later in code e.g. `var x=1; x=2;`
        "sub": false, // true: Tolerate using `[]` notation when it can still be expressed in dot notation
        "supernew": false, // true: Tolerate `new function () { ... };` and `new Object;`
        "validthis": false, // true: Tolerate using this in a non-constructor function

        // Environments
        "browser": true, // Web Browser (window, document, etc)
        "browserify": false, // Browserify (node.js code in the browser)
        "devel": true, // Development/debugging (alert, confirm, etc)
        "jquery": false, // jQuery
        "mocha": true, // Mocha
        "node": false, // Node.js
        "nonstandard": false, // Widely adopted globals (escape, unescape, etc)
        "phantom": false, // PhantomJS
        "typed": false, // Globals for typed array constructions
        "worker": false, // Web Workers

        // Custom Globals
        "globals": {} // additional predefined global variables
    },
    jsx: {
        //Options to jsx-loader https://github.com/petehunt/jsx-loader
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]

};
