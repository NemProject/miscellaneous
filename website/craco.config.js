// eslint-disable-next-line
const CracoAntDesignPlugin = require('craco-antd');
// eslint-disable-next-line
const reactHotReloadPlugin = require('craco-plugin-react-hot-reload');
// eslint-disable-next-line
const path = require('path');
const emotionPresetOptions = {};
// eslint-disable-next-line
const emotionBabelPreset = require("@emotion/babel-preset-css-prop").default(
    undefined,
    emotionPresetOptions,
);

module.exports = {
    babel: {
        plugins: [...emotionBabelPreset.plugins],
    },
    webpack: {
        alias: {
            src: path.resolve(__dirname, './src/'),
        },
    },
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeThemeLessPath: path.join(
                    __dirname,
                    'src/styles/variables.less',
                ),
            },
        },
    ],
};
