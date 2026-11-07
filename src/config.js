export default {
    OS_NAME: "Androidium",
    ACCENT_COLOR: "#0366d6",
    SUPPORTED_DEVICES: [
        {
            name: "Pixel 4",
            model: "flame",
            type: "phone",
        },
        {
            name: "Pixel 4 XL",
            model: "coral",
            type: "phone",
        },
        {
            name: "Pixel 4a 5G",
            model: "bramble",
            type: "phone",
        },
        {
            name: "Pixel 5",
            model: "redfin",
            type: "phone",
        },
        {
            name: "Pixel 6",
            model: "oriole",
            type: "phone",
        },
        {
            name: "Pixel 6 Pro",
            model: "raven",
            type: "phone",
        },
    ],
    RELEASE_VARIANTS: {
        minimal: {
            description: "Standard Androidium.",
            suffix: "",
        },
        test: {
            description: "Experimental version for testing only.",
            suffix: "experimental",
        },
        beta: {
            description: "Beta version for testing only.",
            suffix: "beta",
        },
    },
    DONATION_LINKS: [
        {
            title: "One-time donation",
            description:
                "You make a one-time donation through Dogecoin Core if you wish to do so.",
            highlight: false,
            url: "dogecoin:DCn87e7f8gAptU7LF3dinD72rP7YPSBnGK?amount=750.00000000&label=donation",
            icon: "dogecore",
        },
    ],
};
