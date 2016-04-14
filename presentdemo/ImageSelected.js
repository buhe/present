/**
 * Created by guguyanhua on 16/4/8.
 */
import React, {
    Image,
    Component,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

var ImagePickerManager = require('NativeModules').ImagePickerManager;

var qiniu = require('react-native-qiniu');

export default class ImageSelected extends Component {
  constructor() {
    super();
    qiniu.conf.ACCESS_KEY = 'KRXNjCvmYMuc2AivStgqoM_APyEskT_AUIFSiwJS';
    qiniu.conf.SECRET_KEY = 'oPs_4CpDqwpAZReFBZxW6i7LLl8QPbvYIsePuxAZ';
    this.state = {
      avatarSource: {uri: "http://www.kiodev.com/wp-content/uploads/2016/03/react-logo.png"},
      info: ''
    }
  }

  downloadPrivate() {
    var getPolicy = new qiniu.auth.GetPolicy();
    let url = getPolicy.makeRequest('http://7xp19y.com2.z0.glb.qiniucdn.com/5.jpg');
    this.setState({avatarSource:{uri:url}});
  }

  imageView2() {
    var imgInfo = new qiniu.imgOps.ImageView(1,1,200);
    let url = imgInfo.makeRequest('http://7xoaqn.com2.z0.glb.qiniucdn.com/16704/6806d20a359f43c88f1cb3c59980e5ef');
    this.setState({avatarSource:{uri:url}});
  }

  imageinfo() {
    var self = this;
    var imgInfo = new qiniu.imgOps.ImageInfo();
    let url = imgInfo.makeRequest('http://7xoaqn.com2.z0.glb.qiniucdn.com/16704/6806d20a359f43c88f1cb3c59980e5ef');
    fetch(url).then((response) => {
      return response.text();
    }).then((responseText) => {
      self.setState({info: responseText});
    }).catch((error) => {
      console.warn(error);
    });
  }

  rsStat() {
    var self = this;
    qiniu.rs.Client.stat("android-release", "testreactnative.jpg")
        .then((response) => response.text())
        .then((responseText) => {
          self.setState({info: responseText});
        })
        .catch((error) => {
          console.warn(error);
        });

  }

  upload() {

    var putPolicy = new qiniu.auth.PutPolicy2(
        {scope: "android-release:testreactnative.jpg"}
    );
    var uptoken = putPolicy.token();
    //var uptoken = "KRXNjCvmYMuc2AivStgqoM_APyEskT_AUIFSiwJS:zHU5eBW-F1jjt76BHr1sUVG7AeY=:eyJzY29wZSI6ImFuZHJvaWQtcmVsZWFzZTp0ZXN0cmVhY3RuYXRpdmUuanBnIiwiZGVhZGxpbmUiOjE0NjA0NTA5NzV9";

    console.log('uptoken :\n' + uptoken);

    qiniu.rpc.uploadImage(this.state.avatarSource.uri, 'testreactnative.jpg', uptoken, function (resp) {
      console.log(JSON.stringify(resp));
    });
  }

  select() {
    var options = {
      title: 'Select Avatar', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      customButtons: {
        'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
      },
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 100, // photos only
      maxHeight: 100, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    /**
     * The first arg will be the options object for customization, the second is
     * your callback which sends object: response.
     *
     * See the README for info about the response
     */
    var self = this;
    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        //// uri (on iOS)
        //const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        //// uri (on android)
        const source = {uri: response.uri, isStatic: true};
        self.setState({
          avatarSource: source
        });
      }
    });
  }

  render() {
    return (
        <View style={{width:300,height:600}}>
          <Image source={this.state.avatarSource} style={{width:200,height:200}}/>
          <Text style={{width:200,height:100}}>{this.state.info}</Text>
          <TouchableHighlight onPress={this.select.bind(this)} style={{width:100,height:50}}>
            <Text>Select</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.upload.bind(this)} style={{width:100,height:50}}>
            <Text>Upload to Qiniu</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.imageView2.bind(this)} style={{width:100,height:50}}>
            <Text>ImageView2</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.imageinfo.bind(this)} style={{width:100,height:50}}>
            <Text>ImageInfo</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.rsStat.bind(this)} style={{width:100,height:50}}>
            <Text>RS stat</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.downloadPrivate.bind(this)} style={{width:100,height:50}}>
            <Text>Private File</Text>
          </TouchableHighlight>
        </View>

    )
  }
}