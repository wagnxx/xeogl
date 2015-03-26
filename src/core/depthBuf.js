/**
 A **DepthBuf** configures the WebGL depth buffer for attached {{#crossLink "GameObject"}}GameObjects{{/crossLink}}.

 ## Overview

 <ul>
 <li>A DepthBuf configures **the way** that pixel depths are written to the WebGL depth buffer</li>
 <li>DepthBuf is not to be confused with {{#crossLink "DepthTarget"}}DepthTarget{{/crossLink}}, which stores rendered pixel
 depths for consumption by {{#crossLink "Texture"}}Textures{{/crossLink}}, used when performing *render-to-texture*.</li>
 </ul>

 <img src="http://www.gliffy.com/go/publish/image/7104991/L.png"></img>

 ## Example

 In this example we're configuring the WebGL depth buffer for a {{#crossLink "GameObject"}}{{/crossLink}}.

 The scene contains:

 <ul>
    <li>a DepthBuf that configures the clear depth and depth comparison function,</li>
    <li>a {{#crossLink "Geometry"}}{{/crossLink}} that is the default box shape and
    <li>a {{#crossLink "GameObject"}}{{/crossLink}} attached to all of the above.</li>
 </ul>

 ````javascript
var scene = new XEO.Scene();

// Create a DepthBuf that configures the WebGL depth buffer to set pixels depths to 0.5
// whenever it is cleared, and to use the "less" depth comparison function
var depthBuf = new XEO.DepthBuf(scene, {
    clearDepth: 0.5,
    depthFunc: "less"
});

var geometry = new XEO.Geometry(scene); // Defaults to a 2x2x2 box

// Create a GameObject that renders the Geometry to the depth buffer,
// as configured by our DepthBuf
var gameObject = new XEO.GameObject(scene, {
    depthBuf: depthBuf,
    geometry: geometry
});
````

 @class DepthBuf
 @module XEO
 @constructor
 @param [scene] {Scene} Parent {{#crossLink "Scene"}}Scene{{/crossLink}} - creates this DepthBuf
 within the default {{#crossLink "Scene"}}Scene{{/crossLink}} when omitted.
 @param [cfg] {*} DepthBuf configuration
 @param [cfg.id] {String} Optional ID, unique among all components in the parent {{#crossLink "Scene"}}Scene{{/crossLink}}, generated automatically when omitted.
 @param [cfg.meta] {String:Object} Optional map of user-defined metadata to attach to this DepthBuf.
 @param [cfg.clearDepth=1.0] {Number} The clear depth.
 @param [cfg.depthFunc="less"] {String} The depth function.
 @extends Component
 */
(function () {

    "use strict";

    XEO.DepthBuf = XEO.Component.extend({

        className: "XEO.DepthBuf",

        type: "DepthBuf",

        _init: function (cfg) {
            this.clearDepth = cfg.clearDepth;
            this.depthFunc = cfg.depthFunc;
        },

        _props: {

            /**
             * The clear depth for this DepthBuf.
             *
             * Fires a {{#crossLink "DepthBuf/clearDepth:event"}}{{/crossLink}} event on change.
             *
             * @property clearDepth
             * @default 1.0
             * @type Number
             */
            clearDepth: {

                set: function (value) {
                    value = value !== undefined ? value : 1.0;
                    this._state.clearDepth = value;
                    this._renderer.imageDirty = true;

                    /**
                     Fired whenever this DepthBuf's {{#crossLink "DepthBuf/clearDepth:property"}}{{/crossLink}} property changes.

                     @event clearDepth
                     @param value {Number} The property's new value
                     */
                    this.fire("clearDepth", value);
                },

                get: function () {
                    return this._state.clearDepth;
                }
            },

            /**
             * The depth function for this DepthBuf.
             *
             * Accepted values are:
             *
             * <ul>
             *     <li>"less"</li>
             *     <li>"equal"</li>
             *     <li>"lequal"</li>
             *     <li>"greater"</li>
             *     <li>"notequal"</li>
             *     <li>"gequal"</li>
             * </ul>
             *
             * Fires a {{#crossLink "DepthBuf/depthFunc:event"}}{{/crossLink}} event on change.
             *
             * @property depthFunc
             * @default "less"
             * @type Number
             */
            depthFunc: {

                set: function (value) {
                    value = value || "less";
                    var enumName = this._depthFuncNames[value];
                    if (enumName === undefined) {
                        this.error("unsupported value for 'clearFunc' attribute on depthBuf component: '" + value +
                            "' - supported values are 'less', 'equal', 'lequal', 'greater', 'notequal' and 'gequal'");
                        return;
                    }
                    this._state.depthFunc = this.scene.canvas.gl[enumName];
                    this._state.depthFuncName = value;
                    this._renderer.imageDirty = true;

                    /**
                     Fired whenever this DepthBuf's {{#crossLink "DepthBuf/depthFunc:property"}}{{/crossLink}} property changes.
                     @event depthFunc
                     @param value {String} The property's new value
                     */
                    this.fire("depthFunc", value);
                },

                get: function () {
                    return this._state.depthFuncName;
                }
            }
        },

        /**
         * Lookup GL depth function enums
         * @private
         */
        _depthFuncNames: {
            less: "LESS",
            equal: "EQUAL",
            lequal: "LEQUAL",
            greater: "GREATER",
            notequal: "NOTEQUAL",
            gequal: "GEQUAL"
        },

        _compile: function () {
            this._renderer.depthBuf = this._state;
        },

        _getJSON: function () {
            return {
                clearDepth: this.clearDepth,
                depthFunc: this.depthFunc
            };
        }
    });

})();
