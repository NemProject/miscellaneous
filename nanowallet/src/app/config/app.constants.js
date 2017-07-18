const AppConstants = {
    //Application name
    appName: 'Nano Wallet',

    version: 'BETA 1.4.0',

    //Network
    defaultNetwork: 104,

    // Ports
    defaultNisPort: 7890,
    defaultMijinPort: 7895,
    defaultWebsocketPort: 7778,

    // Activate/Deactivate mainnet
    mainnetDisabled: false,

    // Activate/Deactivate mijin
    mijinDisabled: true,

    // Available languages
    languages: [{
        name: "English",
        key: "en"
    }, {
        name: "Chinese",
        key: "cn"
    }, {
        name: "Polish",
        key: "pl"
    }, {
        name: "German",
        key: "de"
    }, {
        name: "Japanese",
        key: "jp"
    }, {
        name: "Русский",
        key: "ru"
    }, {
        name: "Nederlands",
        key: "nl"
    }/*, {
        name: "Français",
        key: "fr"
    }*/],

};

export default AppConstants;
