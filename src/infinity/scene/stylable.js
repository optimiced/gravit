(function (_) {
    /**
     * Mixin to mark something being stylable
     * @class IFStylable
     * @constructor
     * @mixin
     */
    IFStylable = function () {
    };

    // --------------------------------------------------------------------------------------------
    // IFStylable.Paint Mixin
    // --------------------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------------------
    // IFStylable Mixin
    // --------------------------------------------------------------------------------------------
    /**
     * The property-sets this stylable supports
     * @returns {Array<IFStyle.PropertySet>} list of supported
     * property sets
     * @private
     */
    IFStylable.prototype.getStylePropertySets = function () {
        return [IFStyle.PropertySet.Style, IFStyle.PropertySet.Effects];
    };

    /**
     * Set the style default properties
     */
    IFStylable.prototype._setStyleDefaultProperties = function () {
        var propertySets = this.getStylePropertySets();

        if (propertySets.indexOf(IFStyle.PropertySet.Style) >= 0) {
            this._setDefaultProperties(IFStyle.VisualStyleProperties);
        }

        if (propertySets.indexOf(IFStyle.PropertySet.Fill) >= 0) {
            this._setDefaultProperties(IFStyle.GeometryFillProperties);
        }

        if (propertySets.indexOf(IFStyle.PropertySet.Stroke) >= 0) {
            this._setDefaultProperties(IFStyle.GeometryStrokeProperties);
        }

        if (propertySets.indexOf(IFStyle.PropertySet.Text) >= 0) {
            this._setDefaultProperties(IFStyle.GeometryTextProperties);
        }

        if (propertySets.indexOf(IFStyle.PropertySet.Paragraph) >= 0) {
            this._setDefaultProperties(IFStyle.GeometryParagraphProperties);
        }
    };

    /**
     * Returns whether a paintable stroke is available or not
     * @returns {boolean}
     */
    IFStylable.prototype.hasStyleStroke = function () {
        // TODO : Test stroke pattern opacity
        return !!this.$_spt && this.$_sw > 0;
    };

    /**
     * Returns whether a paintable fill is available or not
     * @returns {boolean}
     */
    IFStylable.prototype.hasStyleFill = function (stylable) {
        // TODO : Test fill pattern opacity
        return !!this.$_fpt;
    };

    /**
     * Returns the painted style bounding box
     * @param {IFRect} source the source bbox
     * @returns {IFRect}
     */
    IFStylable.prototype.getStyleBBox = function (source) {
        var propertySets = this.getStylePropertySets();

        var left = 0;
        var top = 0;
        var right = 0;
        var bottom = 0;

        // Add stroke to paddings
        if (this.hasStyleStroke() && propertySets.indexOf(IFStyle.PropertySet.Stroke) >= 0) {
            if (this.$_sa === IFStyle.StrokeAlignment.Center) {
                var sw2 = this.$_sw / 2;
                left += sw2;
                top += sw2;
                right += sw2;
                bottom += sw2;
            } else if (this.$_sa === IFStyle.StrokeAlignment.Outside) {
                left += this.$_sw;
                top += this.$_sw;
                right += this.$_sw;
                bottom += this.$_sw;
            }
        }

        var bbox = source.expanded(left, top, right, bottom);

        // Due to pixel aligning, we may need extra half pixel in some cases
        var paintExtraExpand = [0, 0, 0, 0];
        if (bbox.getX() != Math.floor(bbox.getX())) {
            paintExtraExpand[0] = 0.5;
        }
        if (bbox.getY() != Math.floor(bbox.getY())) {
            paintExtraExpand[1] = 0.5;
        }
        var br = bbox.getSide(IFRect.Side.BOTTOM_RIGHT);
        if (br.getX() != Math.ceil(br.getX())) {
            paintExtraExpand[2] = 0.5;
        }
        if (br.getY() != Math.ceil(br.getY())) {
            paintExtraExpand[3] = 0.5;
        }

        return bbox.expanded(paintExtraExpand[0], paintExtraExpand[1], paintExtraExpand[2], paintExtraExpand[3]);
    };

    /**
     * Change handler for styles
     * @param {Number} change
     * @param {*} args
     */
    IFStylable.prototype._handleStyleChange = function (change, args) {
        if (this instanceof IFElement) {
            if (change === IFNode._Change.BeforePropertiesChange) {
                var propertySets = this.getStylePropertySets();
                if ((propertySets.indexOf(IFStyle.PropertySet.Stroke) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.GeometryStrokeProperties)) ||
                    (propertySets.indexOf(IFStyle.PropertySet.Fill) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.GeometryFillProperties)) ||
                    (propertySets.indexOf(IFStyle.PropertySet.Text) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.GeometryTextProperties)) ||
                    (propertySets.indexOf(IFStyle.PropertySet.Paragraph) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.GeometryParagraphProperties))) {
                    this._notifyChange(IFElement._Change.PrepareGeometryUpdate);
                }
            } else if (change === IFNode._Change.AfterPropertiesChange) {
                var propertySets = this.getStylePropertySets();
                if ((propertySets.indexOf(IFStyle.PropertySet.Stroke) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.GeometryStrokeProperties)) ||
                    (propertySets.indexOf(IFStyle.PropertySet.Text) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.GeometryTextProperties)) ||
                    (propertySets.indexOf(IFStyle.PropertySet.Paragraph) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.GeometryParagraphProperties))) {
                    this._notifyChange(IFElement._Change.FinishGeometryUpdate);
                } else if ((propertySets.indexOf(IFStyle.PropertySet.Style) >= 0 && ifUtil.containsObjectKey(args.properties, IFStyle.VisualStyleProperties))) {
                    this._notifyChange(IFElement._Change.InvalidationRequest);
                }
            }
        }

        if (change === IFNode._Change.Store) {
            var propertySets = this.getStylePropertySets();

            if (propertySets.indexOf(IFStyle.PropertySet.Style) >= 0) {
                this.storeProperties(args, IFStyle.VisualStyleProperties);
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Fill) >= 0) {
                this.storeProperties(args, IFStyle.GeometryFillProperties, function (property, value) {
                    if (value) {
                        if (property === '_fpt') {
                            return IFPattern.asString(value);
                        }
                    }
                    return value;
                });
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Stroke) >= 0) {
                this.storeProperties(args, IFStyle.GeometryStrokeProperties, function (property, value) {
                    if (value) {
                        if (property === '_spt') {
                            return IFPattern.asString(value);
                        }
                    }
                    return value;
                });
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Text) >= 0) {
                this.storeProperties(args, IFStyle.GeometryTextProperties);
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Paragraph) >= 0) {
                this.storeProperties(args, IFStyle.GeometryParagraphProperties);
            }
        } else if (change === IFNode._Change.Restore) {
            var propertySets = this.getStylePropertySets();

            if (propertySets.indexOf(IFStyle.PropertySet.Style) >= 0) {
                this.restoreProperties(args, IFStyle.VisualStyleProperties);
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Fill) >= 0) {
                this.restoreProperties(args, IFStyle.GeometryFillProperties, function (property, value) {
                    if (value) {
                        if (property === '_fpt') {
                            return IFPattern.parsePattern(value);
                        }
                    }
                    return value;
                });
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Stroke) >= 0) {
                this.restoreProperties(args, IFStyle.GeometryStrokeProperties, function (property, value) {
                    if (value) {
                        if (property === '_spt') {
                            return IFPattern.parsePattern(value);
                        }
                    }
                    return value;
                });
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Text) >= 0) {
                this.restoreProperties(args, IFStyle.GeometryTextProperties);
            }

            if (propertySets.indexOf(IFStyle.PropertySet.Paragraph) >= 0) {
                this.restoreProperties(args, IFStyle.GeometryParagraphProperties);
            }
        }
    };

    /**
     * Called to paint with style
     * @param {IFPaintContext} context the context to be used for drawing
     */
    IFStylable.prototype._paintStyle = function (context) {
        if (this.getProperty('_opc') > 0.0) {
            this._paintStyleLayer(context, IFStyle.Layer.Background); // fill
            this._paintStyleLayer(context, IFStyle.Layer.Content); // innner shapes, image, ...
            this._paintStyleLayer(context, IFStyle.Layer.Foreground); // stroke
        }
    };

    /**
     * Called whenever this should paint a specific style layer
     * @param {IFPaintContext} context the context to be used for drawing
     * @param {IFStyle.Layer} layer the actual layer to be painted
     */
    IFStylable.prototype._paintStyleLayer = function (context, layer) {
        // NO-OP
    };

    /** @override */
    IFStylable.prototype.toString = function () {
        return "[Mixin IFStylable]";
    };

    _.IFStylable = IFStylable;
})(this);