import React from 'react';
import {Animated, StyleSheet, Dimensions, View, Image} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';
const uri =
  'https://scontent.fhph1-1.fna.fbcdn.net/v/t31.0-8/p960x960/19477313_1249139921882444_6270095587876539041_o.jpg?_nc_cat=104&_nc_sid=7aed08&_nc_ohc=-KFIv1zo41cAX9k-O_-&_nc_ht=scontent.fhph1-1.fna&_nc_tp=6&oh=b9a2d4d34a37ec17fcd299b7baa9e5ec&oe=5EC4CA81';
import ViewEditor from 'react-native-view-editor';
const {width, height} = Dimensions.get('window');
export class PinchableBox extends React.Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  dragRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      _isMounted: false,
    };

    /* Pinching */
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);

    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event(
      [{nativeEvent: {scale: this._pinchScale}}],
      {useNativeDriver: true},
    );

    /* Rotation */
    this._rotate = new Animated.Value(0);
    this._rotateStr = this._rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    });
    this._lastRotate = 0;
    this._onRotateGestureEvent = Animated.event(
      [{nativeEvent: {rotation: this._rotate}}],
      {useNativeDriver: true},
    );

    /* Tilt */
    this._tilt = new Animated.Value(0);
    this._tiltStr = this._tilt.interpolate({
      inputRange: [-501, -500, 0, 1],
      outputRange: ['1rad', '1rad', '0rad', '0rad'],
    });
    this._lastTilt = 0;
    this._onTiltGestureEvent = Animated.event(
      [{nativeEvent: {translationY: this._tilt}}],
      {useNativeDriver: true},
    );

    this._translateX = new Animated.Value(0);
    this._translateY = new Animated.Value(0);

    this._lastOffset = {x: 0, y: 0};
    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX,
            translationY: this._translateY,
          },
        },
      ],
      {useNativeDriver: true},
    );
  }

  _onRotateHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };
  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };
  _onTiltGestureStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastTilt += event.nativeEvent.translationY;
      this._tilt.setOffset(this._lastTilt);
      this._tilt.setValue(0);
    }
  };
  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  };

  Mask() {
    return (
      <View style={styles.maskContainer}>
        <View style={[styles.mask, styles.topBottom, styles.top]} />
        <View style={[styles.mask, styles.topBottom, styles.bottom]} />
        <View style={[styles.mask, styles.side, styles.left]} />
        <View style={[styles.mask, styles.side, styles.right]} />
      </View>
    );
  }

  render() {
    const {image, children} = this.props;

    return (
      <ViewEditor
        style={styles.container}
        imageHeight={width}
        imageWidth={width}
        imageContainerHeight={width}
        
        maskHeight={width}
        maskPadding={50}>
        {() => <Image source={{uri}} style={styles.flex} />}
      </ViewEditor>
    );
  }
}

export default PinchableBox;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  flex: {
    flex: 1,
  },
  maskContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  mask: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    overflow: 'hidden',
  },
  topBottom: {
    height: 50,
    width: width - 100,
    left: 50,
  },
  top: {
    top: 0,
  },
  bottom: {
    top: width - 50,
  },
  side: {
    width: 50,
    height: width,
    top: 0,
  },
  left: {
    left: 0,
  },
  right: {
    left: width - 50,
  },
});
