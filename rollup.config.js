import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [
    {
        input: 'src/EventBus.js',
        output: {
            name: 'EventBus',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [
            babel({
                runtimeHelpers: true
            }),
            resolve(),
            commonjs()
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
            babel({
                runtimeHelpers: true,
                plugins: [
                    [
                        "@babel/plugin-transform-runtime",
                        {
                            "regenerator": false
                        }
                    ]
                ]
            }),
            resolve(),
            commonjs()
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
