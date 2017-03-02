const AppConstants = {
    //Application name
    appName: 'Nano Wallet - DF',

    version: 'BETA 1.2.12',

    //Network
    defaultNetwork: 104,

    // Ports
    defaultNisPort: 7890,
    defaultMijinPort: 7895,
    defaultWebsocketPort: 7778,

    // Activate/Deactivate mainnet
    mainnetDisabled: false,

    // Activate/Deactivate mijin
    mijinDisabled: false,

    // Available languages
    languages: [{
        name: "English",
        key: "en"
    }/*, {
        name: "Chinese",
        key: "cn"
    }, {
        name: "Polish",
        key: "pl"
    }, {
        name: "Japanese",
        key: "jp"
    }/*, {
        name: "Français",
        key: "fr"
    }*/],

};

export default AppConstants;