import {PermissionsAndroid} from 'react-native';
import {logi} from './logutil';
import {showToast} from './until';

// 安卓权限
export class AndroidPermissions {

    /**
     * 申请定位权限
     * @param callbackGranted
     * @param callbackDenied
     */
    static checkLocationPermission(callbackGranted, callbackDenied) {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];
        this.checkPermissionsImpl(callbackGranted, callbackDenied, permissions);
    }

    static checkCameraPermissions(callbackGranted, callbackDenied) {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.CAMERA,
        ];
        this.checkPermissionsImpl(callbackGranted, callbackDenied, permissions);
    }

    static checkStoragePermissions(callbackGranted, callbackDenied) {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ];
        this.checkPermissionsImpl(callbackGranted, callbackDenied, permissions);
    }

    static checkPermissionsImpl(callbackGranted, callbackDenied, permissions) {
        PermissionsAndroid.requestMultiple(permissions)
            .then((result) => {
                logi('permission result', result);
                if (permissions) {
                    let grantedAll = true;
                    permissions.forEach(value => {
                        const grantResult = result[value];
                        if (grantResult !== 'granted') {
                            grantedAll = false;
                        }
                    });
                    if (grantedAll) {
                        if (callbackGranted) {
                            callbackGranted();
                        }
                    } else {
                        if (callbackDenied) {
                            callbackDenied();
                        }
                    }
                }
            })
            .catch((reason => {
                showToast(reason);
            }));
    }

    /**
     * 申请谈话类需要的权限
     * 相机，语音，相册
     */
    static checkChatPermissions(callbackGranted, callbackDenied) {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
        ];
        this.checkPermissionsImpl(callbackGranted, callbackDenied, permissions);
    }
}

// iOS权限
export class iOSPermissions {

}
