import React, {Component} from 'react';
import {StyleSheet, View, Animated, Dimensions, Easing} from 'react-native';
import {
  PanGestureHandler,
  State,
  PinchGestureHandler,
} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');
const uri =
  'https://scontent.fhph1-1.fna.fbcdn.net/v/t31.0-8/p960x960/19477313_1249139921882444_6270095587876539041_o.jpg?_nc_cat=104&_nc_sid=7aed08&_nc_ohc=-KFIv1zo41cAX9k-O_-&_nc_ht=scontent.fhph1-1.fna&_nc_tp=6&oh=b9a2d4d34a37ec17fcd299b7baa9e5ec&oe=5EC4CA81';

const imageWidth = 100;
const imageHeight = 100;
const cropWidth = width;
const cropHeight = width;

const coordinateXO = (-1 * cropWidth) / 2 + imageWidth / 2;
const coordinateOX = cropWidth / 2 - imageWidth / 2;
const coordinateYO = (-1 * cropHeight) / 2 + imageHeight / 2;
const coordinateOY = cropHeight / 2 - imageHeight / 2;

export default class Draggable extends Component {
  constructor(props) {
    super(props);
    this._translate = new Animated.ValueXY();

    // location current point
    this._lastOffset = {x: 0, y: 0};
    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translate.x,
            translationY: this._translate.y,
          },
        },
      ],
      // {listener: event => console.log(event.nativeEvent)},
    );

    // pinch
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);
    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event([
      {nativeEvent: {scale: this._pinchScale}},
    ]);
  }

  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      console.log('_onPinchHandlerStateChange', event.nativeEvent);
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };

  _isOutsideCrop = event => {
    if (
      this._lastOffset.x >= coordinateXO &&
      this._lastOffset.x <= coordinateOX &&
      this._lastOffset.y >= coordinateYO &&
      this._lastOffset.y <= coordinateOY
    ) {
      return false;
    }
    return true;
  };

  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      console.log('event.nativeEvent', event.nativeEvent);

      this._lastOffset.x +=
        (event.nativeEvent.translationX - width / 2) * this._lastScale;
      this._lastOffset.y +=
        (event.nativeEvent.translationY - width / 2) * this._lastScale;

      console.log(this._lastOffset);

      if (this._isOutsideCrop(event)) {
        if (this._lastOffset.x < coordinateXO) {
          if (this._lastOffset.y < coordinateYO) {
            this._lastOffset = {
              x: coordinateXO,
              y: coordinateYO,
            };

            this._translate.setOffset({
              x: coordinateXO,
              y: coordinateYO,
            });

            Animated.timing(this._translate, {
              toValue: {
                x: 0,
                y: 0,
              },
              easing: Easing.elastic(1),
              duration: 250,
            }).start();
            return;
          }
          if (this._lastOffset.y > coordinateOY) {
            this._lastOffset = {
              x: coordinateXO,
              y: coordinateOY,
            };

            this._translate.setOffset({
              x: coordinateXO,
              y: coordinateOY,
            });
            Animated.timing(this._translate, {
              toValue: {
                x: 0,
                y: 0,
              },
              easing: Easing.elastic(1),
              duration: 250,
            }).start();
            return;
          }

          this._translate.setOffset({
            x: coordinateXO,
            y: this._lastOffset.y,
          });
          Animated.timing(this._translate, {
            toValue: {
              x: 0,
              y: 0,
            },
            easing: Easing.elastic(1),
            duration: 250,
          }).start();
          this._lastOffset = {
            x: coordinateXO,
            y: this._lastOffset.y,
          };
          return;
        }

        //
        if (this._lastOffset.x > coordinateOX) {
          if (this._lastOffset.y < coordinateYO) {
            this._lastOffset = {
              x: coordinateOX,
              y: coordinateYO,
            };

            this._translate.setOffset({
              x: coordinateOX,
              y: coordinateYO,
            });

            Animated.timing(this._translate, {
              toValue: {
                x: 0,
                y: 0,
              },
              easing: Easing.elastic(1),
              duration: 250,
            }).start();
            return;
          }
          if (this._lastOffset.y > coordinateOY) {
            this._lastOffset = {
              x: coordinateOX,
              y: coordinateOY,
            };

            this._translate.setOffset({
              x: coordinateOX,
              y: coordinateOY,
            });
            Animated.timing(this._translate, {
              toValue: {
                x: 0,
                y: 0,
              },
              easing: Easing.elastic(1),
              duration: 250,
            }).start();
            return;
          }

          this._translate.setOffset({
            x: coordinateOX,
            y: this._lastOffset.y,
          });
          Animated.timing(this._translate, {
            toValue: {
              x: 0,
              y: 0,
            },
            easing: Easing.elastic(1),
            duration: 250,
          }).start();
          this._lastOffset = {
            x: coordinateXO,
            y: this._lastOffset.y,
          };
          return;
        }

        if (this._lastOffset.y < coordinateYO) {
          this._translate.setOffset({
            x: this._lastOffset.x,
            y: coordinateYO,
          });

          Animated.timing(this._translate, {
            toValue: {
              x: 0,
              y: 0,
            },
            easing: Easing.elastic(1),
            duration: 250,
          }).start();
          this._lastOffset = {
            x: this._lastOffset.x,
            y: coordinateYO,
          };
          return;
        }

        if (this._lastOffset.y > coordinateOY) {
          this._translate.setOffset({
            x: this._lastOffset.x,
            y: coordinateOY,
          });

          Animated.timing(this._translate, {
            toValue: {
              x: 0,
              y: 0,
            },
            easing: Easing.elastic(1),
            duration: 250,
          }).start();
          this._lastOffset = {
            x: this._lastOffset.x,
            y: coordinateOY,
          };
          return;
        }

        // default center
        this._lastOffset = {
          x: 0,
          y: 0,
        };
        Animated.timing(this._translate, {
          toValue: {
            x: 0,
            y: 0,
          },
          easing: Easing.elastic(1),
          duration: 250,
        }).start();
        this._translate.setOffset({
          x: 0,
          y: 0,
        });
      } else {
        this._translate.setOffset({
          x: this._lastOffset.x,
          y: this._lastOffset.y,
        });
        this._translate.setValue({
          x: 0,
          y: 0,
        });
      }

      // Animated.spring(this._translate, {
      //   toValue: {x: 0, y: 0},
      //   friction: 7,
      // }).start();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.ctCrop}>
          <PanGestureHandler
            {...this.props}
            minDist={10}
            minPointers={1}
            maxPointers={2}
            avgTouches
            onGestureEvent={this._onGestureEvent}
            onHandlerStateChange={this._onHandlerStateChange}>
            {/* <Animated.Image
              style={[
                styles.circle,
                {
                  transform: [
                    {translateX: this._translate.x},
                    {translateY: this._translate.y},
                  ],
                },
              ]}
              source={{uri}}
            /> */}
            <Animated.View style={styles.wrapper}>
              <PinchGestureHandler
                ref={this.pinchRef}
                simultaneousHandlers={this.rotationRef}
                onGestureEvent={this._onPinchGestureEvent}
                onHandlerStateChange={this._onPinchHandlerStateChange}>
                <Animated.View style={styles.container} collapsable={false}>
                  <Animated.Image
                    style={[
                      styles.circle,
                      {
                        transform: [
                          {perspective: 200},
                          {scale: this._scale},
                          {translateX: this._translate.x},
                          {translateY: this._translate.y},
                        ],
                      },
                    ]}
                    source={{uri}}
                  />
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: imageWidth,
    height: imageHeight,
  },
  ctCrop: {
    width: cropWidth,
    height: cropHeight,
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
  },
});
