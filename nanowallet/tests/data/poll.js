let testPoll = {
    description: "",
    formData: {
        doe: 1514721540000,
        mosaic: "nem:xem",
        multiple: false,
        title: "test token poll with xem",
        type: 0,
        updatable: false,
    },
    options: {
        addresses: ["TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX", "TAKS2UKMWNT7RWCHHAAC3MZBNPJJ7Z4HFX7I4MWV"],
        strings: ["normal vote", "multisig"],
    },
    whitelist: null,
}

let pastPoll = {
    description: "hjkhjkl",
    formData: {
        doe: 1000000000000,
        mosaic: "nem:xem",
        multiple: false,
        title: "whitelist",
        type: 1,
        updatable: false,
    },
    options: {
        addresses: ["TCOORH3HFT5TKHHVLOMMFYEAZJ636ODSQYDLPIXX", "TAKS2UKMWNT7RWCHHAAC3MZBNPJJ7Z4HFX7I4MWV"],
        strings: ["normal vote", "multisig"],
    },
    whitelist: [],
}

let pollHeader = {
    title: "YYYYYYYYYYY",
    type: 0,
    doe: 1004098560000,
    address: "TDZQAJCDN57LOPS3GF5NVLPPPODRQSUXINRMWWIC"
}

module.exports = {
    testPoll,
    pastPoll,
    pollHeader,
}
