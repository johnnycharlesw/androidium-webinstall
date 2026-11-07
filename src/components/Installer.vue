<template>
    <div class="d-flex flex-column flex-grow-1">
        <v-stepper
            ref="stepper"
            v-model="curStep"
            :alt-labels="!$vuetify.breakpoint.mobile"
            class="d-flex flex-column flex-grow-1"
            @errorConnectSelect="errorConnectSelect"
            @errorConnectUdev="errorConnectUdev"
            @errorClaim="errorClaim"
            @errorDisconnect="errorDisconnect"
            @errorStorage="errorStorage"
            @errorTimeout="errorTimeout"
            @requestDeviceReconnect="reconnectCallback"
            @prevStep="curStep -= 1"
            @nextStep="curStep += 1"
        >
            <v-stepper-header class="mb-3">
                <v-stepper-step :complete="curStep > 1" step="1">
                    Connect
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="curStep > 2" step="2">
                    Unlock
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="curStep > 3" step="3">
                    Download
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="curStep > 4" step="4">
                    Install
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items class="d-flex flex-column flex-grow-1">
                <v-stepper-content
                    step="-1"
                    :class="
                        curStep === -1 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <prepare-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === -1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="0"
                    :class="
                        curStep === 0 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <install-type-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 0"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="1"
                    :class="
                        curStep === 1 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <connect-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 1"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="2"
                    :class="
                        curStep === 2 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <unlock-step
                        :device="device"
                        :blob-store="blobStore"
                        :curStep="curStep"
                        stepNum="2"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="3"
                    :class="
                        curStep === 3 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <download-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 3"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="4"
                    :class="
                        curStep === 4 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <install-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 4"
                    />
                </v-stepper-content>

                <v-stepper-content
                    step="5"
                    :class="
                        curStep === 5 ? 'd-flex flex-column flex-grow-1' : null
                    "
                >
                    <finish-step
                        :device="device"
                        :blob-store="blobStore"
                        :active="curStep === 5"
                    />
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>

        <v-dialog v-model="connectSelectDialog" :width="userAgent.includes('Windows') ? 600 : 500">
            <v-card>
                <v-card-title class="headline">No device selected</v-card-title>

                <v-card-text>
                    <p>
                        You need to select a device to continue installing (make sure to select the correct one, you don't want to accidentally flash Androidium onto your FTC Driver Station!)
                    </p>
                    <p>
                        Device not showing up? Try following these steps:
                        <ul class="ml-4 mb-4">
                            <li>Put your device into the firmware menu (to do so, turn it off and then hold Power and Volume Down, or at least on most devices, it's only slightly less inconsistent than the BIOS key on PC)</li>
                            <li>Use a different cable (some only charge, this needs a cable supporting data transfer)</li>
                            <li>Clean your USB port (who hasn't had dust in there?)</li>
                            <li>Don’t use sketchy USB hubs (like, don't try to flash Androidium through a no-name USB hub, if it doesn't behave reliably a brick might occur)</li>
                            <li>Make sure the cable isn’t loose (who hasn't had loose cables?)</li>
                        </ul>
                    </p>
                    <p v-if="userAgent.includes('Windows')">
                        If it’s still not working, you need to install Windows drivers (like always 😭):
                        <ol class="ml-4 mb-4">
                            <li>Plug your device into your computer while it’s in the firmware menu</li>
                            <li>Open Settings → Windows Update</li>
                            <li>Click “Check for updates” and wait</li>
                            <li>Click “View optional updates”</li>
                            <li>Select the “Android Bootloader Interface” update (ignore the brand name)</li>
                            <li>Click “Download and install” and wait</li>
                            <li>Yank the USB-C cable and plug it back in (not THAT HARD, actually!)</li>
                        </ol>
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryConnectSelect">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="connectUdevDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Access to phones over USB not allowed</v-card-title>

                <v-card-text>
                    <p>
                        On Linux, access to Android(ium) devices over USB for non-file-transfer purposes isn't allowed.
                    </p>
                    <p>
                        To fix this, install Android(ium) udev rules on your system:
                    </p>

                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>
                                Debian (CLI only)
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                sudo apt install
                                android-sdk-platform-tools-common
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>
                                Debian (LXQt)
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <ol>
                                    <li>
                                        Launch "Synaptic Package Manager" and enter your password
                                    </li>
                                    <li>
                                        Search for "android sdk platform tools"
                                    </li>
                                    <li>
                                        When "android-sdk-platform-tools-common" comes up, install it.
                                    </li>
                                </ol>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>Arch Linux</v-list-item-title>
                            <v-list-item-subtitle
                                >sudo pacman -S
                                android-udev</v-list-item-subtitle
                            >
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-list-item-title>
                                Other distributions
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                Instructions vary (note: while Kali can use the Debian instructions mentioned above, I don't know about you, but I don't want that much bloat preinstalled if I'm only going to use this installer!)
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <p>
                        Once you've installed the Android(ium) udev rules, yank the USB-C cable out of the device's port and then reconnect it (not THAT HARD, actually!)
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryConnectUdev">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="claimDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">
                    Can’t talk to device
                </v-card-title>

                <v-card-text>
                    <p>
                        Another app or browser tab is already talking to your device, and it would not be polite, let alone permitted, to yell over it.
                    </p>
                    <p>
                        This is usually caused by having this installer open in
                        another browser tab.
                    </p>
                    <p>
                        To fix this, close all other web installer tabs in your browser (don't cheat with GrapheneOS!) and make sure you don’t have any tabs remaining in other windows.
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryClaim">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="disconnectDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">
                    Device disconnected
                </v-card-title>
                <v-card-text>
                    <p>
                        Your device disconnected, so the installation cannot continue.
                    </p>
                    <p>
                        To fix this:
                        <ul class="ml-4 mb-4">
                            <li>Don’t touch the device (now is not the time to yank the cable, silly!)</li>
                            <li>Use a different cable (again, some cables aren't as reliable)</li>
                            <li>Clean your USB port (who hasn't had dust in there?)</li>
                            <li>Don’t use sketchy USB hubs (like, don't try to flash Androidium through a no-name USB hub, OH NO THE BRICK MAY HAVE OCCURRED ALREADY! 😯)</li>
                            <li>Make sure the cable isn’t loose (who hasn't had loose cables?)</li>
                        </ul>
                    </p>
                    <connect-banner
                        :device="device"
                        :connecting="disconnectReconnecting"
                        :error="disconnectReconnectError"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryDisconnect">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="storageDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Out of storage</v-card-title>
                <v-card-text>
                    <p>
                        There isn’t enough storage space available and usable to download and unpack Androidium. You need at least 5 GB free (maybe don't save 500,000 hamster gifs for no reason!)
                    </p>
                    <p>
                        If you’re not that low on storage, this is probably caused by using incognito mode. Incognito mode can't store data (not much, if in a non-persistent manner, also it doesn't really work without hardening that makes more sense in a regular Thorium profile tbh).
                    </p>
                    <p>
                        To fix this,
                        <strong>switch to a normal profile</strong>
                        and try again.
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryStorage">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="memoryDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Out of RAM</v-card-title>
                <v-card-text>
                    <p>
                        There isn’t enough free memory (RAM) to unpack and install Androidium. This might be because everyone is rushing to make AGI and consuming petabytes of RAM, but let's not assume.
                    </p>
                    <p>
                        To fix this,
                        <strong>close some unused (proprietary) apps</strong> and try again.
                    </p>
                    <p>
                        If it still doesn’t work, you may need to install from another computer or device with more RAM.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryMemory">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="reconnectDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Reconnect device</v-card-title>

                <v-card-text>
                    To continue installing, allow access to your device again.
                    <v-banner
                        single-line
                        outlined
                        rounded
                        class="mt-8"
                        v-if="reconnectError"
                    >
                        <v-icon slot="icon" color="red darken-3"
                            >mdi-close</v-icon
                        >
                        <div class="my-4">
                            <span
                                class="text-body-1 red--text text--darken-3"
                                >{{ reconnectError }}</span
                            >
                        </div>
                    </v-banner>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="requestReconnect">
                        Reconnect
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="timeoutDialog" width="500" persistent>
            <v-card>
                <v-card-title class="headline">Device is stuck</v-card-title>

                <v-card-text>
                    <p>
                        The connection to your device is stuck.
                    </p>
                    <p>
                        To fix this, use the volume buttons to highlight <strong>“Restart bootloader”</strong> in the firmware menu, and press the power button to select it (don't yank the cable, please).
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="retryTimeout">
                        Retry
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style>
.v-stepper {
    box-shadow: none !important;
    border-radius: 8px !important;
}
.v-stepper__header {
    box-shadow: none !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.v-stepper__wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>

<script>
import * as fastboot from "android-fastboot";
import { BlobStore } from "../core/download";
import ConnectBanner from "./ConnectBanner";
import PrepareStep from "./PrepareStep";
import InstallTypeStep from "./InstallTypeStep";
import ConnectStep from "./ConnectStep";
import UnlockStep from "./UnlockStep";
import DownloadStep from "./DownloadStep";
import InstallStep from "./InstallStep";
import FinishStep from "./FinishStep";

fastboot.setDebugLevel(2);

let device = new fastboot.FastbootDevice();
let blobStore = new BlobStore();

export default {
    name: "Installer",

    components: {
        PrepareStep,
        InstallTypeStep,
        ConnectStep,
        UnlockStep,
        DownloadStep,
        InstallStep,
        FinishStep,
        ConnectBanner,
    },

    data: () => ({
        device: device,
        blobStore: blobStore,
        curStep: -1,
        userAgent: navigator.userAgent,

        connectSelectDialog: false,
        connectUdevDialog: false,
        claimDialog: false,
        storageDialog: false,
        memoryDialog: false,
        timeoutDialog: false,
        retryCallbacks: [],

        disconnectDialog: false,
        disconnectReconnecting: false,
        disconnectReconnectError: null,

        reconnectDialog: false,
        reconnectError: null,
    }),

    methods: {
        handleSelfError(error, retryCallback) {
            this.$refs.stepper.$emit(error, retryCallback);
        },

        errorConnectSelect(retry) {
            this.connectSelectDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryConnectSelect() {
            this.connectSelectDialog = false;
            this.retryCallbacks.pop()();
        },

        errorConnectUdev(retry) {
            this.connectUdevDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryConnectUdev() {
            this.connectUdevDialog = false;
            this.retryCallbacks.pop()();
        },

        errorClaim(retry) {
            this.claimDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryClaim() {
            this.claimDialog = false;
            this.retryCallbacks.pop()();
        },

        errorDisconnect(retry) {
            this.$root.$data.product = null;

            this.disconnectReconnecting = false;
            this.disconnectReconnectError = null;
            this.disconnectDialog = true;
            this.retryCallbacks.push(retry);
        },
        async retryDisconnect() {
            this.disconnectReconnecting = true;
            this.$root.$data.product = null;

            try {
                await this.device.connect();
                this.$root.$data.product = await this.device.getVariable(
                    "product"
                );
                this.disconnectReconnectError = null;
            } catch (e) {
                let [handled, message] = this.bubbleError(e, this.retryDisconnect);
                this.disconnectReconnectError = message;
                if (!handled) {
                    throw e;
                }

                this.disconnectReconnecting = false;
                return;
            }

            this.disconnectReconnecting = false;
            this.disconnectDialog = false;
            this.retryCallbacks.pop()();
        },

        errorStorage(retry) {
            this.storageDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryStorage() {
            this.storageDialog = false;
            this.retryCallbacks.pop()();
        },

        errorMemory(retry) {
            this.memoryDialog = true;
            this.retryCallbacks.push(retry);

            this.saEvent("error__out_of_memory");
        },
        retryMemory() {
            this.memoryDialog = false;
            this.retryCallbacks.pop()();
        },

        reconnectCallback() {
            this.reconnectError = null;
            this.reconnectDialog = true;
        },
        async requestReconnect() {
            try {
                await this.device.connect();
                this.reconnectDialog = false;
                this.reconnectError = null;
            } catch (e) {
                this.reconnectError = e.message;
            }
        },

        errorTimeout(retry) {
            this.timeoutDialog = true;
            this.retryCallbacks.push(retry);
        },
        retryTimeout() {
            this.timeoutDialog = false;
            this.retryCallbacks.pop()();
        },
    },
};
</script>
