/**
 * Description:
 * Fix out of sync video on the specific devices.
 */

console.log("Scripts::Running script video_sync_fix.js");

function VideoSyncFixAddon() {
    this.timeout = 0;
    this.postResult = null;
    this.run = function() {
        this.setupListener();
    };

    this.setupListener = function() {
        this.timeout = this.findDeviceTimeout();
        if (this.timeout == 0)
            return;

        var v = Utils.$('video');
        if (!v) {
            Utils.postDelayed(this.setupListener, this, 100);
            return;
        }

        var $this = this;
        v.addEventListener(EventTypes.PLAYER_PLAY, function() {
            $this.postSyncCallback();
        }, false);
    };

    this.postSyncCallback = function() {
        Utils.cancelPost(this.postResult);
        this.postResult = Utils.postCycled(this.syncVideo, this, this.timeout);
    };

    this.findDeviceTimeout = function() {
        var config = VideoSyncConfig;
        for (var device in config) {
            if (DeviceUtils.isMyDevice(device)) {
                return config[device];
            }
        }
        return 0;
    };

    this.syncVideo = function() {
        var v = Utils.$('video');
        if (v.paused) {
            return;
        }

        console.log("VideoSyncFixAddon::syncing video and audio");
        v.currentTime = v.currentTime;
    };
}

new VideoSyncFixAddon().run();