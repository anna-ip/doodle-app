import {
  PaintStyle,
  Skia,
  StrokeCap,
  StrokeJoin,
} from '@shopify/react-native-skia';

const getPaint = (strokeWidth: number, color: string) => {
  const paint = Skia.Paint();
  //Sets the thickness of the pen used to outline the shape.
  paint.setStrokeWidth(strokeWidth);
  //Sets the limit at which a sharp corner is drawn beveled.
  paint.setStrokeMiter(5);
  //Sets whether the geometry is filled or stroked.
  paint.setStyle(PaintStyle.Stroke);
  //Sets the geometry drawn at the beginning and end of strokes.
  paint.setStrokeCap(StrokeCap.Round);
  //Sets the geometry drawn at the corners of strokes.
  paint.setStrokeJoin(StrokeJoin.Round);
  paint.setAntiAlias(true);
  const _color = paint.copy();
  _color.setColor(Skia.Color(color));
  console.log(color);
  return _color;
};

export default { getPaint };
