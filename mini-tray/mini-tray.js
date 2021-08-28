const { booleans, primitives, transforms } = require("@jscad/modeling");
const { subtract, union } = booleans;
const { roundedCuboid, cylinder } = primitives;
const { translate } = transforms;

const main = (
  _args,
  columns = 3,
  rows = 4,
  ...{
    bottomHeight = 2,
    bottomRadius = 2,
    bottomShrink = 2,

    miniBaseDiameter = 25,
    miniBaseinset = 4,

    magnetHeight = 2,
    magnetDiameter = 5,

    postDiameter = 8,
    postInsertDiameter = 6,
  }
) => {
  /* setup */

  // derived parameters

  const miniBaseOffset = miniBaseDiameter * 0.075;
  const miniBaseOffsetDiameter = miniBaseDiameter + miniBaseOffset;
  const miniBaseRadius = miniBaseOffsetDiameter / 2;

  const magnetRadius = magnetDiameter / 2;

  // size of the tray
  const width = miniBaseDiameter * columns - bottomShrink;
  const depth = miniBaseDiameter * rows - bottomShrink;
  const height = bottomHeight + miniBaseinset + magnetHeight;

  /* helper functions */

  const miniOffset = (num) => {
    return miniBaseDiameter * num;
  };

  const postOffset = (num) => {
    return miniBaseDiameter * num + miniBaseOffset / 2;
  };

  /* modeling */

  // create plane

  let bottom = roundedCuboid({
    size: [width, depth, height],
    roundRadius: bottomRadius,
  });

  bottom = translate(
    [
      (miniBaseDiameter * columns) / 2 + bottomShrink / 2,
      (miniBaseDiameter * rows) / 2 + bottomShrink / 2,
      0,
    ],
    bottom
  );

  // calculate holes

  let miniBase = cylinder({
    height: miniBaseinset,
    radius: miniBaseRadius,
  });

  miniBase = translate([0, 0, 0], miniBase);

  let magnet = cylinder({
    height: magnetHeight,
    radius: magnetRadius,
  });

  magnet = translate([0, 0, -magnetHeight], magnet);

  miniBase = union(miniBase, magnet);
  miniBase = translate([miniBaseRadius, miniBaseRadius, 0], miniBase);

  let post = cylinder({
    height: height / 2,
    radius: postDiameter / 2,
  });

  post = translate([0, 0, 0], post);

  let postInsertHole = cylinder({
    height: height / 2,
    radius: postInsertDiameter / 2,
  });

  postInsertHole = translate([0, 0, -height / 2], postInsertHole);
  post = union(post, postInsertHole);

  let shape = bottom;

  // create mini holes
  for (const column in Array.from({ length: columns }, (_, i) => i)) {
    for (const row in Array.from({ length: rows }, (_, i) => i)) {
      const miniHole = translate(
        [miniOffset(column), miniOffset(row), bottomHeight],
        miniBase
      );

      shape = subtract(shape, miniHole);
    }
  }

  // create post holes
  for (const column in Array.from({ length: columns - 1 }, (_, i) => i)) {
    for (const row in Array.from({ length: rows - 1 }, (_, i) => i)) {
      const postHole = translate(
        [
          postOffset(parseInt(column) + 1),
          postOffset(parseInt(row) + 1),
          height / 4,
        ],
        post
      );
      shape = subtract(shape, postHole);
    }
  }

  return shape;
};

module.exports = { main };
