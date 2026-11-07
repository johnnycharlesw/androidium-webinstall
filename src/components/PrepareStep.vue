<template>
    <v-container class="d-flex justify-space-between flex-column flex-grow-1">
        <div class="mb-10 mt-n4" v-if="usbSupported">
            <h6 class="text-h6 pb-4">Hi!</h6>

            <div class="text-body-1">
                <p>
                    This is an easy way to install Androidium on your device. You’ll need a <strong>carrier-unlocked or AT&T (not sponsored btw)</strong> model of one of the supported devices:
                </p>
            </div>

            <v-list-item
                two-line
                v-for="device in $root.$data.SUPPORTED_DEVICES"
                :key="device.model"
            >
                <v-list-item-content>
                    <v-list-item-title>{{ device.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                        device.model
                    }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </div>

        <div class="mb-10 mt-n4" v-else>
            <h6 class="text-h6 pb-4 red--text text--darken-4">
                Your browser isn’t supported
            </h6>

            <div class="text-body-1">
                <p>
                    Unfortunately, you can’t use this web installer for Androidium because your browser doesn’t support WebUSB. Only Thorium and other browsers based on Chromium, such as Supermium or Brave, are supported.
                </p>
            </div>

            <div class="text-body-1 mt-4">
                <p>
                    If you think this is a mistake, update your browser to the latest version and try again.
                </p>
            </div>
        </div>

        <div class="d-flex justify-space-between flex-row-reverse">
            <v-btn
                color="primary"
                @click="$bubble('nextStep')"
                :disabled="!usbSupported"
            >
                Start
                <v-icon dark right>mdi-arrow-right</v-icon>
            </v-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    props: ["device", "blobStore", "active"],

    data: () => ({
        usbSupported: "usb" in navigator,
    }),

    watch: {
        active: async function (newState) {
            if (newState) {
                this.saEvent("step_prepare");
            }
        },
    },
};
</script>
