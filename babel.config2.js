module.exports = {
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
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": {
                    "version": 3,
                    "proposals": true
                },
                "regenerator": true
            }
        ],
        "@babel/plugin-proposal-class-properties"
    ]
}