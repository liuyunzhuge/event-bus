import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';

let inputBabelOptions = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": "false",
                "useBuiltIns": false
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties"
    ]
}


let outputBabelOptions = {
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": {
                    "version": 3,
                    "proposals": true
                },
                "regenerator": true
            }
        ]
    ]
}


export default [
    // browser-friendly UMD build
    {
        input: 'src/EventBus.js',
        output: {
            name: 'EventBus',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [
            babel(inputBabelOptions),
            resolve(), // so Rollup can find `ms`
            commonjs() // so Rollup can convert `ms` to an ES module
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify 
    // `file` and `format` for each target)
    {
        input: 'src/EventBus.js',
        plugins: [
            babel(inputBabelOptions),
            resolve(), // so Rollup can find `ms`
            commonjs() // so Rollup can convert `ms` to an ES module
        ],
        output: [
            {
                file: pkg.main, format: 'cjs',
                // plugins: [babel.generated(outputBabelOptions)] 
            },
            {
                file: pkg.module, format: 'es',
                // plugins: [babel.generated(outputBabelOptions)] 
            }
        ]
    }
];
